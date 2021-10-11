function setup() {
  createCanvas(window.innerWidth -17, (window.innerWidth-17)/2);
}

var divisions = 80;
var dis = (window.innerWidth-17)/divisions;
var textsize = null;

var ecuation = "";


function draw() {
  translate(width/2,height/2);
  background(0);
  
  //Dibujamos los eje X e Y
  stroke(200);
  strokeWeight(1);
  line(-width/2,0,width/2,0);
  line(0,-height/2,0,height/2);
  
  //Marcamos la dos lineas X e Y
  dis = width/divisions;
  
  //Determinamos el tamaño de letra inicial
  textsize = 2;
  if(width>500) textsize = 4;
  if(width>800) textsize = 6;
  if(width>1300) textsize = 8;
  
  for(var i = 0;i <= divisions;i++){
    if((divisions >= 100 && i%2 == 0)||divisions<100){
        line((i*dis)-(width/2),-5,(i*dis)-(width/2),5);
        fill(255);
        textSize(textsize);
        text(i-divisions/2,(i*dis)-(width/2)-4,14);
      }
  }
  for(var i = 0; i <= divisions/2;i++){
      if((divisions >= 100 && i%2 == 0)||divisions<100){
        line(-3,(i*dis)-(height/2),3,(i*dis)-(height/2));
        fill(255);
        textSize(textsize);
        text(divisions/4-i,8,(i*dis)-(height/2));
      }
  }
  
  //Función que representa
  if(ecuation != ""){
    noFill();
    stroke(200,0,0);
    strokeWeight(5);
    beginShape();
    for(var i = 0;i < divisions*dis;i++){
      var x = i/dis;
      var a = x-divisions/2;
      var y = eval(ecuation);
      vertex(a*dis,-y*dis);
    }
    endShape();
  }
}

function mouseWheel(event) {
  var e = event.delta;
  
    if(e > 0 && divisions < 160){
      divisions += 20;
      textsize -= 0.5;
    } 
    if(e < 0 && divisions > 20){
      divisions -= 20;
      textsize +=0.5;
    } 

  dis = width/divisions;
}


function setEcuation(){
  var ecuacionBox = document.getElementById("ecuacionBox")
  ecuation = ecuacionBox.value;
}