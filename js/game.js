var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var asteroidCoords = [[canvas.width + 20,100], 
					  [canvas.width + 20,150], 
					  [canvas.width + 20,200], 
					  [canvas.width + 20,250], 
					  [canvas.width + 20,300]];

//sound
gameSound = new Audio("sounds/Breathing Weird-SoundBible.com-445559305.mp3");
gameSound.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
}, false);
gameSound.play();

//space
var spaceImage = new Image();
spaceImage.onload = function () {	
	settings.spaceImageReady = true;
	ctx.drawImage(spaceImage, 0, 0);
};
spaceImage.src = "images/space.jpg";

//planet
var planetImage = new Image();
planetImage.onload = function () {	
	settings.planetImageReady = true;
	ctx.drawImage(planetImage, 0, 0);
};
planetImage.src = "images/planet.png";

//asteroids
var asteroidImage = new Image();
asteroidImage.onload = function () {	
	settings.asteroidImageReady = true;
};
asteroidImage.src = "images/asteroid.png";

//character
var characterImage = new Image();
characterImage.onload = function () {	
	settings.characterImageReady = true;
};
characterImage.src = "images/character.png";

//general game settings
var settings = {
	x: 100,
	blockTimer: 250,
	fall: false,
	fallIndex: -1,
	xpos: 0,
	totalSeconds: 0,
	vx: 100,
	numImages: Math.ceil(canvas.width / 3500) + 1,
	spaceSpeed: 10,
	gameOver: false,
	planetImageReady: false,
	asteroidImageReady: false,
	characterImageReady: false,
	spaceImageReady: false
}

var character = {
	x: 0,
	y: 100,
	direction: "right"
}

var update = function(delta) {
	settings.blockTimer++;
	if(settings.blockTimer == 700) {
		settings.x += (50 * delta);
		settings.fall = true;
		settings.blockTimer = 1;
		settings.fallIndex++;
	}

	//background
	settings.totalSeconds += delta;	
	settings.xpos = settings.totalSeconds * settings.vx % 3500;

	//check catch
	if(asteroidCoords[settings.fallIndex] != undefined) {
		if(((character.x + 100) >= asteroidCoords[settings.fallIndex][0]) && (asteroidCoords[settings.fallIndex][1] >= character.y) && (asteroidCoords[settings.fallIndex][1] <= character.y + 145) && asteroidCoords[settings.fallIndex][0] > 0) {
			settings.gameOver = true;
		}	
	}

	//character
	if(character.direction == "up") {
		character.y -= 30 * delta;
	}
	if(character.direction == "down") {
		character.y += 30 * delta;
	}
	if(character.direction == "left") {
		character.x -= 20 * delta;
	}
	if(character.direction == "right") {
		character.x += 20 * delta;
	}

	//asteroid
	if(settings.fall) {
		asteroidCoords[settings.fallIndex][0] -= 250 * delta;
	}
};

var init = function() {
	//reset settings
	settings.gameOver = false;
	//reset character
	character.x = 0;
	character.y = 100;
	character.direction = "right";
}

var render = function () {
	ctx.clearRect(0, 0, 800, 600);
	
	if (settings.spaceImageReady) {		
		ctx.save();
		ctx.translate(-settings.xpos/settings.spaceSpeed, 0);
		for (var i = 0; i < settings.numImages; i++) {
			ctx.drawImage(spaceImage, i * 3500, 0);
		}
		ctx.restore();
	}
	
	if (settings.planetImageReady) {
		ctx.drawImage(planetImage, 0, 0);
	}

	if (settings.characterImageReady) {	
		ctx.drawImage(characterImage, character.x, character.y);
	}	
	
	if(settings.asteroidImageReady) {
		for (var i = 0; i < asteroidCoords.length; i++) {
			ctx.drawImage(asteroidImage, asteroidCoords[i][0], asteroidCoords[i][1]);
		}		
	}

	if(settings.gameOver) {
		ctx.font = "60px Arial";
		ctx.fillStyle = "red";
		ctx.fillText("GAME OVER", (canvas.width / 2) - 60, (canvas.height / 2) - 100);
		gameSound.pause();
		gameSound.currentTime = 0;
	}	
};

addEventListener("keydown", function (e) {
	//up
	if(e.keyCode == 38) {
		character.direction = "up";
	}
	//down
	if(e.keyCode == 40) {
		character.direction = "down";
	}
	//left
	if(e.keyCode == 37) {
		character.direction = "left";
	}
	//right
	if(e.keyCode == 39) {
		character.direction = "right";
	}
}, false);

addEventListener("keyup", function (e) {
}, false);

// The main game loop
var main = function (timestamp) {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	
	if(!settings.gameOver) {
		lacsmi = requestAnimationFrame(main);	
	} else {
		cancelAnimationFrame(lacsmi)
	}
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
cancelAnimationFrame = w.cancelAnimationFrame || w.mozCancelAnimationFrame;

// Let's play this game!
var then = Date.now();

init();
main();
