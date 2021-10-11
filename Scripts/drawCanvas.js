
//Tomar y configurar el canvas
        var canvas = document.getElementById("canvasDraw");
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;

        //mousedown, mouseup y mousemove: Eventos de canvas para dibujar segun el estado del mouse
        var mousedown = false;

        canvas.onmousedown = function(e){
            var pos = fixPosition(e, canvas);

            mousedown = true;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            return false;
        };

        canvas.onmousemove = function(e) {
            var pos = fixPosition(e, canvas);
            if (mousedown) {
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            }
        };

        canvas.onmouseup = function(e){
            mousedown = false;
        };
        
        // http://jsfiddle.net/ghostoy/wTmFE/1/
        // https://stackoverflow.com/questions/6770899/javascript-library-for-free-form-drawing
        function fixPosition(e, gCanvasElement){
            var x;
            var y;
            if (e.pageX || e.pageY) { 
              x = e.pageX;
              y = e.pageY;
            }
            else { 
              x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
              y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            } 
            x -= gCanvasElement.offsetLeft;
            y -= gCanvasElement.offsetTop;
            return {x: x, y:y};
        }

        //Agregamos para que envia el canvas.
        window.addEventListener("keydown", function (event) {console.log(event)
            if(event.key == ' '){
                alert("envio");               
                //Arreglo para almacenar los pixeles
                var pixels = [];
                for (var y=0; y < 250; y++) {
                    for (var x=0; x < 500; x++) {
                        var imgData = ctx.getImageData(x,y,1,1);
                        var data = imgData.data;
    
                        //Pixel negro o blanco?
                        var color = 255- data[3] //Data tiene 4 canales. Rojo, Verde, Azul, Alpha
                        //Divido entre 255 para tener de 0 a 1
                        
                        //Dejar siempre 2 decimales
                        //color = (Math.round(color*100)/100).toFixed(2)
                        pixels.push(color);
                    }
                }         
                
                //Enviar un post con ajax hacia el puerto 8000.
                //Se envia 'pixeles', el cual es el arreglo convertido en cadena separada por comas.
                //Al regresar el resultado, lo pone en el div con id 'resultado'
                $.post("http://localhost:8000", {pixeles: pixels.join(",")},
                    function(response) {
                       console.log("Resultado: " + response);
                       var box = document.getElementById("ecuacionBox");
                       box.value = response;
                    }
                );
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        },false);
