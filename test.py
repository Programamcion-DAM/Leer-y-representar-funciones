
from urllib import parse
from http.server import HTTPServer, BaseHTTPRequestHandler
import cv2
import numpy as np

import PIL 
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential

import matplotlib.pyplot as plt
from imutils.contours import sort_contours
import imutils
import pandas as pd

#Cargamos el modelo y todos los metodos para predecir los símbolos
model = keras.models.load_model('modelo.h5')

#Los distintos simbolos
class_names = ['(', ')', '+', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'A', 'cos', 'div', 'e', 'log', 'pi', 'sin', 'sqrt', 'tan', 'times']

batch_size = 32
img_height = 100
img_width = 100

#Te devuelve la predicción de un numero, a esta funcion de la pasamos 
#como parametro el numero de foto al que debe hacer referencia
def prediction(number):
  print(number)
  test_image_path = "/content/image"+str(number)+".jpg"
  test_image = PIL.Image.open(test_image_path)

  img = keras.preprocessing.image.load_img(
    test_image_path, target_size=(img_height, img_width)
  )
  img_array = keras.preprocessing.image.img_to_array(img)
  img_array = tf.expand_dims(img_array, 0) # Create a batch

  predictions = model.predict(img_array)
  score = tf.nn.softmax(predictions[0])

  return class_names[np.argmax(score)]

#Divide la imagen general según los simbolos y luego los manda a predecir. Son almacenados en la variable chars
def predict_image():
    image = cv2.imread('/content/drive/MyDrive/TestImagenes/canvas.jpg')
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # perform edge detection, find contours in the edge map, and sort the
    # resulting contours from left-to-right
    edged = cv2.Canny(blurred, 30, 150)
    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sort_contours(cnts, method="left-to-right")[0]
    chars=[]

    i = 0

    for c in cnts:
       # compute the bounding box of the contour
       (x, y, w, h) = cv2.boundingRect(c)
       if w*h>600:

           roi = gray[y-15:y + h + 15, x -15:x + w + 15]
           path = 'image'+str(i)+'.jpg'
           cv2.imwrite(path,roi)
           chars.append(prediction(i))
           cv2.rectangle(image, (x-15, y-15), (x + w +15 , y + h +15), (0, 255, 0), 1)
           i+=1

    return chars

#Transformamos los chars en operacion matematica para que pueda ser devuelta
def transform_into_operation(chars):
    operation = ""
    for char in chars:
        if char == "A" : operation +='a'
        elif char == 'div': operation += '/'
        elif char == 'pi': operation += 'PI'
        elif char == 'times': operation += '*'
        else: operation +=char

    return operation



#Clase para definir el servidor http. Solo recibe solicitudes POST.
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        print("Peticion recibida")

        #Obtener datos de la peticion y limpiar los datos
        content_length = int(self.headers['Content-Length'])
        data = self.rfile.read(content_length)
        data = data.decode().replace('pixeles=', '')
        data = parse.unquote(data)

        #Realizar transformacion para poder ser guardada
        arr = np.fromstring(data, np.float32, sep=",")
        arr = arr.reshape(250,500)
        arr = np.array(arr)

        #Escribir la imagen la carpeta del proyecto
        status = cv2.imwrite('C:/Users/Dani/Desktop/Math Web/canvas.jpg',arr)
        print("Image written to file-system : ",status)

        #Guardar la predicciones de la imagen
        symbols = predict_image()
        operation = transform_into_operation(symbols)

        #Regresar respuesta a la peticion HTTP
        self.send_response(200)
        #Evitar problemas con CORS
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(operation.encode())


#Iniciar el servidor en el puerto 8000 y escuchar por siempre
#Si se queda colgado, en el admon de tareas buscar la tarea de python y finalizar tarea
print("Iniciando el servidor...")
server = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
server.serve_forever()

#import webbrowser
#webbrowser.open_new_tab('index.html')