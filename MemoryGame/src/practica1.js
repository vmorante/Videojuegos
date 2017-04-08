/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
	this.gs = gs;
	this.cartas = new Array("8-ball","potato","dinosaur","kronos","rocket","unicorn","guy","zeppelin","back");
	this.numCartasEncontradas=0;
	this.estadoJuego="Memory Game";
	this.cartasCreadas = new Array();
	this.numVolteadas=0;
	this.primeraCarta;


};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(sprite) {
	this.spriteCarta=sprite;
	this.estado="abajo"

};

MemoryGame.prototype={


	initGame :function(){
		for (var i=0;i<this.cartas.length-1; i++){
			this.cartasCreadas.push(new MemoryGameCard(this.cartas[i]));
			this.cartasCreadas.push(new MemoryGameCard(this.cartas[i]));
		}
		this.cartasCreadas = this.cartasCreadas.sort(function() {return Math.random() - 0.5});
		
		this.loop();

	},

	draw: function(){
		this.gs.drawMessage(this.estadoJuego);
		for(var i=0;i<this.cartasCreadas.length; i++){
			this.cartasCreadas[i].draw(this.gs,i);
		};

	},

	loop: function(){
		var self = this;
		setInterval(function(){	self.draw()	},16);
	},

	onClick: function(cardId){
		var self = this;
		if((cardId>=0 && cardId<16 && cardId!=null) && this.cartasCreadas[cardId].estado=="abajo" && this.numVolteadas<2){
			this.numVolteadas++;
			this.cartasCreadas[cardId].flip();
			if(this.numVolteadas==2){
			if(this.cartasCreadas[cardId].compareTo(this.cartasCreadas[this.primeraCarta])){
				this.numVolteadas=0;
				this.cartasCreadas[cardId].found();
				this.cartasCreadas[this.primeraCarta].found();
				this.numCartasEncontradas=this.numCartasEncontradas+2;
				if(this.numCartasEncontradas==16)
					this.estadoJuego="You win";
				else
					this.estadoJuego="Match found";

			}else{
				this.estadoJuego="Try again";
				setTimeout(function(){
							self.numVolteadas = 0; 
							self.cartasCreadas[cardId].flip();
							self.cartasCreadas[self.primeraCarta].flip();
						},1000);

			}

		}else if(this.numVolteadas==1){
			this.primeraCarta=cardId;
		}
			
		}
		
		
	}

};

MemoryGameCard.prototype = {

	flip: function(){
		if(this.estado=="abajo"){
			this.estado = "arriba";
		}
		else if(this.estado=="arriba"){
			this.estado="abajo";
		}
	},

	found:function(){
		this.estado="encontrada";
	},

	compareTo:function(otherCard){
		var iguales=false;
		if(this.spriteCarta==otherCard.spriteCarta){
			iguales=true;
		}
		return iguales;

	},

	draw: function(gs,pos){
		if(this.estado=="abajo"){
			gs.draw("back",pos);
		}
		else{
			gs.draw(this.spriteCarta,pos);
		}

	}


};