const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon,boat;
var balls = [];
var boats = [];
var brokenboat=[]
var brokenboatjson,brokenboatsprite;
var boatAnimation=[]; var boatSprite, boatJson;


function preload() {
  backgroundImg = loadImage("assets/background.gif");
  towerImage = loadImage("assets/tower.png");
  brokenboatjson = loadJSON("assets/boat/broken_boat.json")
  brokenboatsprite = loadImage("assets/boat/broken_boat.png")
  boatJson=loadJSON("assets/boat/boat.json"); boatSprite=loadImage("assets/boat/boat.png");

  
}

function setup() {

  createCanvas(1200,600);

  engine = Engine.create();
  world = engine.world;

  angle = -PI / 4;

  ground = new Ground(0, height - 1, width * 2, 1);

  tower = new Tower(150, 350, 160, 310);

  cannon = new Cannon(180, 110, 100, 50, angle);

  cannonBall = new CannonBall(cannon.x, cannon.y);

  //boat = new Boat(1200,550,150,150,-100);
  var brokenboatsFrames = brokenboatjson.frames
  for(var i=0;i<brokenboatsFrames.length;i++)
  { 
    var pos=brokenboatsFrames[i].position; 
    var img= brokenboatsprite.get(pos.x,pos.y,pos.w,pos.h);
     brokenboat.push(img); }

     var boatFrames = brokenboatjson.frames
  for(var i=0;i<boatFrames.length;i++)
  { 
    var pos=boatFrames[i].position; 
    var img= boatSprite.get(pos.x,pos.y,pos.w,pos.h);
     boatAnimation.push(img); }
     
  

  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

 

  Engine.update(engine);
  ground.display();
  cannon.display();
  tower.display();
  showBoats();
 

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);

    for (var k = 0 ; k < boats.length;k++ ){
      if(balls[i]!==undefined && boats[k]!==undefined){
        var collision= Matter.SAT.collides(balls[i].body,boats[k].body)
        
        if(collision.collided){
          boats[k].remove(k)

          Matter.World.remove(world,balls[i])
          balls.splice(i,1)
          i--;
            
        }
      

      }
    }

  }

 

   
}
function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40,-60,-70,-20 ];
      var position = random(positions);
      var boat = new Boat(1200,550, 150, 150, position,boatAnimation);
      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate
    }
  } else {
    var boat = new Boat(1200,550, 150, 150, -100,boatAnimation);
    boats.push(boat);
  }
}


function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall);
  }
}

//function to show the ball
function showCannonBalls(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
  }
}



function keyReleased() {
  if (keyCode === DOWN_ARROW) { 
    balls[balls.length - 1].shoot();
  }
}