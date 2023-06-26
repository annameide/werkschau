
// a simple knn algorithm 

// https://discourse.processing.org/t/very-simple-k-nn-algorithm-does-not-work/10305

// no classes / oop 

/*
Definition:
 rot hat den Wert 0 --> red is 0
 blau hat den Wert 1 --> blue is 1
 (--> im ersten array von balls ist dies der Wert in slot 2)
 */


const container4 = document.getElementById('containerforknn')


function algorithm4(sketch) {
  
var balls = new Array(3);   // 2D array: the first array holds x,y,red/blue (0/1), 
balls[0]= new Array(200);
balls[1]= new Array(200);
balls[2]= new Array(200);
                                  // the 2nd array just the index of the ball [normally we would have it [200][3] I guess]

// using float here 
var abstand = new Array(200);
var minabstand = new Array(3);

// not used anymore!!!
var state = 0;

var ballanzahl;

var sortingWasExecutedOnce = false; 

// ------------------------------------------------------------------------------

sketch.setup = function() {
  const containerSize = container4.getBoundingClientRect();
  const canvs = sketch.createCanvas(containerSize.width, containerSize.height);

  sketch.ballsInit();
}

sketch.draw = function() {
  // delete screen
  sketch.background(0);  
  sketch.noStroke(); 
  // draw all balls 
  sketch.ballsDraw();

  // show a help text 
  sketch.fill(255); 
  sketch.text("Hit any key for new distribution", 23, 23); 
  if (sortingWasExecutedOnce) {
    sketch.text("The numbers show the sequence of the balls (in terms of their distance to the new ball)", 23, 43);
  }

  state++;
  if (state == 1) {
    // ballsDraw();
  } else if (state==2) {
    //balls[0][11]=10+ int(random(0, 790));
    //balls[1][11]=10+ int(random(0, 790));
    //fill(255);
    //ellipse(balls[0][11], balls[1][11], 10, 10);
  } else if (state==3) {
    // action();
  }
}

// ------------------------------------------------------------------------------
// Inputs 

sketch.keyPressed = function() {
  // reset 
  sketch.ballsInit();
}

sketch.mousePressed = function() {
  // was formerly called : function action() {
  // add a new ball and decide its kind. 
  // This simulate a new item that has to be classified by the AI in the vector space 

  // add ball at mouse position 
  balls[0][ballanzahl]=sketch.mouseX;
  balls[1][ballanzahl]=sketch.mouseY;
  balls[2][ballanzahl]=3; // 3 = unknown

  // define abstand[] in relation to the new ball 
  for (var k = 0; k<ballanzahl; k++) {
    abstand[k] = sketch.dist( balls[0][k], balls[1][k], 
      balls[0][ballanzahl], balls[1][ballanzahl] ); // using dist() here
  }//for 

  // the core idea 
  sketch.bubbleSort();
  sketch.regel();

  // increase ballanzahl (after all that has happened) 
  ballanzahl++;
}

// ------------------------------------------------------------------------------
// other functions 

sketch.ballsInit = function() { 
  // die Koordinaten der Bälle werden zufällig erzeugt  
  // init (and reset on keyPressed)
  ballanzahl = 10; // reset 
  for (var i=0; i < ballanzahl; i++) { 
    balls[0][i]= 10 + parseInt(sketch.random(0, sketch.width-20)); // 10 is the diameter of the balls 
    balls[1][i]= 10 + parseInt(sketch.random(0, sketch.width-20));
    balls[2][i]= parseInt(sketch.random(0, 2));
    //println(balls[2][i]);
  }
}

sketch.ballsDraw = function() {
  // die Bälle werden gezeichnet
  for (var i=0; i < ballanzahl; i++) {  // in for-loop we must use ballanzahl (and not 10) so that new balls are displayed !!!!!!!!!!!!!!!!!! 

    // show new bal with white
    if (sortingWasExecutedOnce && i==ballanzahl-1) {
      sketch.stroke(255);
      sketch.noFill(); 
      sketch.ellipse(balls[0][i], balls[1][i], 14, 14);
      sketch.ellipse(balls[0][i], balls[1][i], 18, 18);
      sketch.noStroke();
    }

    // check type red/blue and set color  
    if (balls[2][i]==0) {
      sketch.fill(255, 0, 0);//red
    } else {
      sketch.fill(0, 145, 255); // blue
    }//else

    // show ball at x,y
    sketch.ellipse(balls[0][i], balls[1][i], 10, 10);
    // show the number in the array sequence 
    if (sortingWasExecutedOnce) {
      sketch.text(i, balls[0][i]+10.5, balls[1][i]);
    }
  }//for
}//func 

sketch.bubbleSort = function() {
  // sort abstand 
  var tausch; // swap var for abstand/dist
  var tauschBall = new Array(3);  // swap var for a ball

  for (var n=ballanzahl; n>0; n--) {
    for (var i=0; i<n; i++) {
      if (abstand[i] < abstand[i+1]) {
        tausch = abstand[i];
        abstand[i]=abstand[i+1];
        abstand[i+1]=tausch;

        // also swap the ball !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THAT WAS THE MAJOR MISTAKE  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! The function regel() uses balls[][], not abstand[] !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        tauschBall[0] = balls[0][i];
        tauschBall[1] = balls[1][i];
        tauschBall[2] = balls[2][i];

        balls[0][i] = balls[0][i+1];
        balls[1][i] = balls[1][i+1];
        balls[2][i] = balls[2][i+1];

        balls[0][i+1] = tauschBall[0];
        balls[1][i+1] = tauschBall[1];
        balls[2][i+1] = tauschBall[2];
      } // Ende if
    } // Ende innere for-Schleife
  } // Ende äußere for-Schleife

  // set flag 
  sortingWasExecutedOnce = true;
}// ENDE func 

sketch.regel = function() {
  var rot=0;
  var blau=0;

  // we try to count the types/colors of the nearest three balls  
  for (var i=1; i<=3; i++) {
    if (balls[2][ballanzahl-i] > 0)
      blau++;
    else 
    rot++;
  }//for 

  // eval result and classify the new ball accordingly 
  if (rot > blau)
    balls[2][ballanzahl]=0;
  else balls[2][ballanzahl]=1;
  //println(balls[2][ballanzahl]);
}//func
//
}

new p5(algorithm4, container4)
