var sprites = {
  Beer: { sx: 512,    sy: 99,    w: 23,    h: 32,    frames: 1  },
  Glass: {sx: 512,    sy: 131,    w: 23,    h: 32,    frames: 1  },
  NPC: {sx: 512,    sy: 66,    w: 33,    h: 33,    frames: 1  },
  ParedIzda: {sx: 0,    sy: 0,    w: 512,    h: 480,    frames: 1  },
  Player: {sx: 512,    sy: 0,    w: 56,    h: 66,    frames: 1  },
  TapperGameplay: {    sx: 0,    sy: 480,    w: 512,    h: 480,    frames: 1,  }
};



var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_BEER = 2,
    OBJECT_ENEMY = 4,
    OBJECT_PLAYER_GLASS = 8,
    OBJECT_DeadZone = 16;

var startGame = function() {
  GameManager.max=0;
  var board=new GameBoard();
  board.add(new Fondo());
  Game.setBoard(0,new Fondo());  
  board.add(new PantallaPrincipal("Tapper", 
                                  "Select a number for a level  1-Easy  2-Medium 3-Difficult",
                                  playGame));
  Game.setBoard(2,board);
};




var playGame = function() {
  

  
  
  var board = new GameBoard();
  board.add(new Player());

  GameManager.initialize();
 
  if(Game.nivel==1){
    board.add(new Spawner(new Client(20),110,80, 2, 0,5));
    board.add(new Spawner(new Client(20),110,177, 2, 8,10));
    board.add(new Spawner(new Client(20),90,273 ,2, 13,1));
    board.add(new Spawner(new Client(20),85,370, 1, 20,5));
  }
  else if(Game.nivel==2){
    board.add(new Spawner(new Client(40),110,80, 5, 0,5));
    board.add(new Spawner(new Client(20),110,177, 2, 5,10));
    board.add(new Spawner(new Client(20),90,273 ,2, 15,1));
    board.add(new Spawner(new Client(20),85,370, 4, 20,5));
  }
  else if(Game.nivel==3){
    board.add(new Spawner(new Client(10),110,80, 7, 0,5));
    board.add(new Spawner(new Client(20),110,177, 3, 8,1));
    board.add(new Spawner(new Client(30),90,273 ,4, 10,1));
    board.add(new Spawner(new Client(30),85,370, 6, 20,5));
  }
  
  board.add(new DeadZone(100,100,true));
  board.add(new DeadZone(70,200,true));
  board.add(new DeadZone(40,300,true));
  board.add(new DeadZone(10,400,true));
  
  board.add(new DeadZone(433,400,false));
  board.add(new DeadZone(405,300,false));
  board.add(new DeadZone(365,200,false));
  board.add(new DeadZone(333,100,false));  

  Game.setBoard(2, board);
 
  
  Game.setBoard(3,new Points(0));
  Game.setBoard(4,new Lifes(0));
};

var winGame = function() {
  var board = new GameBoard();
  if(GameManager.points>GameManager.max){
    GameManager.max=GameManager.points;
  }
  if(Game.nivel<3){
    Game.nivel++;
  }
  board.add(new TitleScreen("You win! Pts: " + GameManager.points +" Pts max:" + GameManager.max,
                                  "Press enter to play again",
                                  playGame));
  Game.setBoard(2, board);
};

var loseGame = function() {
  var board = new GameBoard();
  board.add(new TitleScreen("You lose! Pts: " + GameManager.points,
                                  "Press enter to play again",
                                  playGame));
  Game.setBoard(2, board);
};




var Fondo = function Fondo(){
this.setup('TapperGameplay');
this.x = 0;
this.y = 0;  }

Fondo.prototype = new Sprite();
Fondo.prototype.step = function(dt){};

var Player = function() {
  this.setup('Player', {reloadTime: 0.10 });
  this.reload = this.reloadTime;
  this.x = 325
  this.y = 90
  this.vx = 0;
  
  this.step = function(dt) {
  
    
    this.reload-=dt;
  
    if(this.reload < 0){
      this.reload = this.reloadTime;    
      if(Game.keys['down']) { this.dy = 96; this.dx=32 ;}
      else if(Game.keys['up']) { this.dy = -96; this.dx=-32;}
      else {this.dy=0; this.dx=0;}
     
      if(this.x==325 && Game.keys['up']){
        this.x=421;this.y=377;
      }else if(this.x==421 &&Game.keys['down']){
        this.x=325;this.y=90;}
      
      else{
      this.x += this.dx;
      this.y += this.dy;
      }

      if(Game.keys['fire']){     
        this.board.add(Object.create(new Beer(this.x-23,this.y,-23)));   
      
      }
    }
    
   
    
    
    var collision = this.board.collide(this,OBJECT_PLAYER_GLASS);
    if(collision ) {
      GameManager.numGlass--;
      GameManager.points += 100;
      GameManager.comprobacion();
      collision.removeGlass();}
  };

}

Player.prototype = new Sprite();
Player.prototype.type = OBJECT_PLAYER;

var Beer = function(x,y,v){
    this.setup('Beer');
    this.x = x ;
    this.vx=v;    
    this.y = y ;
   

}
Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_PLAYER_BEER;

Beer.prototype.step = function(dt){
  this.x += this.vx * dt;
}

Beer.prototype.removeBeer = function(){
  this.board.remove(this);
  
}

var Glass = function(x,y,v){
    this.setup('Glass',{ vx: v});
    this.x = x ;
    this.y = y ;


}
Glass.prototype = new Sprite();
Glass.prototype.type = OBJECT_PLAYER_GLASS;

Glass.prototype.step = function(dt){
  this.x += this.vx * dt;
}

Glass.prototype.removeGlass = function(){
  this.board.remove(this)
}


var Client = function(v){
  this.setup('NPC',{vx :v}); 
  this.vx=v;
 
  
}
Client.prototype = new Sprite();
Client.prototype.type = OBJECT_ENEMY;

Client.prototype.step = function(dt){

  this.x +=this.vx * dt;
  var collision = this.board.collide(this,OBJECT_PLAYER_BEER);
    if(collision) {
      collision.removeBeer();
      GameManager.points += 50;
      GameManager.clientesServidos++;     
      this.board.add(new Glass(collision.x,collision.y,23));
      GameManager.numGlass++;
      GameManager.comprobacion();
      this.removeClient();
  }
 
}
Client.prototype.removeClient = function(){
  this.board.remove(this)
}


var DeadZone = function(x,y,salida){
  
  this.x=x;
  this.y=y;
  this.w=8;
  this.h=58;
  this.salida=salida;

   this.draw = function() {
    Game.ctx.fillStyle = "green";
    Game.ctx.fillRect(this.x, this.y, 8, 58);
     
  }
    this.step = function(dt) {

    var collisionBeer = this.board.collide(this,OBJECT_PLAYER_BEER);
    if((collisionBeer) && (this.salida)  ){
      GameManager.extremo=true;
      GameManager.vidasGastadas++;     
      GameManager.comprobacion();
      collisionBeer.removeBeer();
    }
    var collisionClient = this.board.collide(this,OBJECT_ENEMY);
    if((collisionClient) && (!this.salida) ){
      GameManager.vidasGastadas++;
      GameManager.clientesServidos++;
      GameManager.extremo=true;
      GameManager.comprobacion();
      collisionClient.removeClient();
    }
    var collisionGlass = this.board.collide(this,OBJECT_PLAYER_GLASS);
    if((collisionGlass) && (!this.salida)  ){
      GameManager.vidasGastadas++;
      GameManager.numGlass--;
      GameManager.extremo=true;
      GameManager.comprobacion();
      collisionGlass.removeGlass();
    }
  };
}
DeadZone.prototype.type = OBJECT_DeadZone;

var Spawner = function(obj,x,y,num, reloadTime,delayTime) {
  this.obj=obj;
  this.num = num;
  GameManager.totalClientes=GameManager.totalClientes+this.num;
  this.reloadTime = reloadTime;
  this.delayTime = delayTime;
  this.obj.x=x;
  this.obj.y=y;
  this.n=0;

};

Spawner.prototype.step = function(dt) {
    
  if(this.n<this.num){
  this.reloadTime-=dt;
  if(this.reloadTime < 0){
    this.reloadTime = this.delayTime;    
    this.board.add(Object.create(this.obj));
   
     this.n++;
  }
 
}
};
Spawner.prototype.draw = function(ctx) { };

var GameManager = new function(){
  this.initialize = function(){
    this.totalClientes=0;
    this.numGlass=0;
    this.clientesServidos=0;
    this.extremo=false;
    this.vidas=3;
    this.vidasGastadas=0;
    this.points=0;
  
};

  this.comprobacion = function(){
    
  if((this.totalClientes==this.clientesServidos) && (this.numGlass==0) && (this.totalClientes>0)){    
    winGame();
  }
  if(this.extremo && this.vidasGastadas>=this.vidas){    
    loseGame();
  }
}
}
var Points = function() {
  

  var pointsLength = 8;

  this.draw = function(ctx) {
    ctx.save();
    ctx.font = "bold 18px arial";
    ctx.fillStyle= "#FFFFFF";

    var txt = "Points:" + GameManager.points;
    var i = pointsLength - txt.length, zeros = "";
    while(i-- > 0) { zeros += "0"; }

    ctx.fillText(zeros + txt,10,20);
    ctx.restore();

  };

  this.step = function(dt) { };
};
var Lifes = function() {
  

  var pointsLength = 2;

  this.draw = function(ctx) {
    ctx.save();
    ctx.font = "bold 18px arial";
    ctx.fillStyle= "#FFFFFF";

    var txt = "Lifes:" + (GameManager.vidas - GameManager.vidasGastadas);
    var i = pointsLength - txt.length, zeros = "";
    while(i-- > 0) { zeros += "0"; }

    ctx.fillText(zeros + txt,320,20);
    ctx.restore();

  };

  this.step = function(dt) { 
  };
};



window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});




