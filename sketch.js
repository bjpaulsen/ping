var BALL_R = 5;
var ballX;
var ballY;
var dx;
var dy;

var BUFFER = 10;

var PADDLE_LENGTH = 75;
var rPaddleY = 200 - PADDLE_LENGTH / 2;
var lPaddleY = 200 - PADDLE_LENGTH / 2;
var DEFAULT_PADDLE_SPEED = 5;
var paddleSpeed = DEFAULT_PADDLE_SPEED;

var leftScore = 0;
var rightScore = 0;

var singlePlayer = false;
var zeroPlayer = true;
var AI_HANDICAP = 0;

var pause = false;

function setup() {
	ellipseMode(RADIUS);

	createCanvas(600, 400);
	frameRate(60);

	background(0);
	stroke(255);
	strokeWeight(10);

	menu();

	spawn();
}

function menu() {
	if (document.getElementById("menu1").innerHTML == "") {
		document.getElementById("menu1").innerHTML = "Welcome to Ping!";
		document.getElementById('menu2').innerHTML = "ESC = Menu;<br>0 = AI vs AI;<br>1 = Singleplayer;<br>2 = Multiplayer;<br>R = Reset;";
	} else {
		document.getElementById("menu1").innerHTML = "";
		document.getElementById('menu2').innerHTML = "";
	}
}

function draw() {
	background(0);
	stroke(255);
	strokeWeight(10);

	computerOpponent();

	updatePaddles();
	updateBall();
	checkWalls();
	checkPaddles();
	checkPoints();
}

function computerOpponent() {
	if ((singlePlayer || zeroPlayer) && ballX > width / 2 && dx > 0) {
		if (dy > 0) {
			if ((rPaddleY + 3 * PADDLE_LENGTH / 4) > ballY && rPaddleY - 5 > 0) { rPaddleY -= paddleSpeed - AI_HANDICAP; }
			if ((rPaddleY + 3 * PADDLE_LENGTH / 4) < ballY && rPaddleY + PADDLE_LENGTH + 5 < 400) { rPaddleY += paddleSpeed - AI_HANDICAP; }
		} else {
			if ((rPaddleY + PADDLE_LENGTH / 4) > ballY && rPaddleY - 5 > 0) { rPaddleY -= paddleSpeed - AI_HANDICAP; }
			if ((rPaddleY + PADDLE_LENGTH / 4) < ballY && rPaddleY + PADDLE_LENGTH + 5 < 400) { rPaddleY += paddleSpeed - AI_HANDICAP; }
		}
	} else if ((singlePlayer || zeroPlayer) && dx < 0) {
		if ((rPaddleY + PADDLE_LENGTH / 2) > 200 && rPaddleY - 5 > 0) { rPaddleY -= paddleSpeed - AI_HANDICAP; }
		if ((rPaddleY + PADDLE_LENGTH / 2) < 200 && rPaddleY + PADDLE_LENGTH + 5 < 400) { rPaddleY += paddleSpeed - AI_HANDICAP; }
	}
	if (zeroPlayer && ballX < width / 2 && dx < 0) {
		if (dy > 0) {
			if ((lPaddleY + 3 * PADDLE_LENGTH / 4) > ballY && lPaddleY - 5 > 0) { lPaddleY -= paddleSpeed - AI_HANDICAP; }
			if ((lPaddleY + 3 * PADDLE_LENGTH / 4) < ballY && lPaddleY + PADDLE_LENGTH + 5 < 400) { lPaddleY += paddleSpeed - AI_HANDICAP; }
		} else {
			if ((lPaddleY + PADDLE_LENGTH / 4) > ballY && lPaddleY - 5 > 0) { lPaddleY -= paddleSpeed - AI_HANDICAP; }
			if ((lPaddleY + PADDLE_LENGTH / 4) < ballY && lPaddleY + PADDLE_LENGTH + 5 < 400) { lPaddleY += paddleSpeed - AI_HANDICAP; }
		}
	} else if (zeroPlayer && dx > 0) {
		if ((lPaddleY + PADDLE_LENGTH / 2) > 200 && lPaddleY - 5 > 0) { lPaddleY -= paddleSpeed - AI_HANDICAP; }
		if ((lPaddleY + PADDLE_LENGTH / 2) < 200 && lPaddleY + PADDLE_LENGTH + 5 < 400) { lPaddleY += paddleSpeed - AI_HANDICAP; }
	}
}

function updateBall() {
	ballX += dx;
	ballY -= dy;
	ellipse(ballX, ballY, BALL_R, BALL_R);
}

function checkPaddles() {
	if ((ballY >= rPaddleY - 5) && (ballY <= rPaddleY + PADDLE_LENGTH + 5)) {
		if ((ballX >= (width - BUFFER - 5 - BALL_R)) && ballX <= (width - BUFFER + 5)) { paddleBounce(); }
	}
	if ((ballY >= lPaddleY - 5) && (ballY <= lPaddleY + PADDLE_LENGTH + 5)) {
		if ((ballX <= (BUFFER + 5 + BALL_R)) && ballX >= (BUFFER - 5)) { paddleBounce(); }
	}
}

function updatePaddles() {
	if (keyIsDown(38) && rPaddleY - 5 > 0) { rPaddleY -= paddleSpeed; }
	if (keyIsDown(40) && rPaddleY + PADDLE_LENGTH + 5 < 400) { rPaddleY += paddleSpeed; }
	line(width - BUFFER, rPaddleY, width - BUFFER, rPaddleY + PADDLE_LENGTH);
	if (keyIsDown(87) && lPaddleY - 5 > 0) { lPaddleY -= paddleSpeed; }
	if (keyIsDown(83) && lPaddleY + PADDLE_LENGTH + 5 < 400) { lPaddleY += paddleSpeed; }
	line(BUFFER, lPaddleY, BUFFER, lPaddleY + PADDLE_LENGTH);
}

function spawn() {
	paddleSpeed = DEFAULT_PADDLE_SPEED;
	ballX = 300;
	ballY = 200;
	do {
		dx = random(-4, 4);
		dy = random(-4, 4);
	} while ((dy > -1.5 && dy < 1.5) || (dx > -1 && dx < 1))
	ellipse(ballX, ballY, BALL_R, BALL_R)
}

function checkPoints() {
	if (ballX >= width + BALL_R) {
		leftScore++;
		document.getElementById("score").innerHTML = leftScore + " | " + rightScore;
		spawn();
	} else if (ballX <= 0 - BALL_R) {
		rightScore++;
		document.getElementById("score").innerHTML = leftScore + " | " + rightScore;
		spawn();
	}
}

function checkWalls() {
	if (ballY <= 0 + BALL_R) wallBounce();
	if (ballY >= 400 - BALL_R) wallBounce();
}

function wallBounce() {
	dy *= -1;
}

function paddleBounce() {
	if (ballX < 300) {
		dx = abs(dx) + .2;
	} else {
		dx = -1 * abs(dx) - .15;
	}
	if (dy < 0) { dy -= .15 } else { dy += .15 }
	paddleSpeed += .1;
}

function keyPressed() {
	switch (keyCode) {
		case 27:
			menu();
			break;
		case 48:
			zeroPlayer = true;
			break;
		case 49:
			singlePlayer = true;
			zeroPlayer = false;
			break;
		case 50:
			singlePlayer = false;
			zeroPlayer = false;
			break;
		case 82:
			leftScore = 0;
			rightScore = 0;
			document.getElementById("score").innerHTML = leftScore + " | " + rightScore;
			spawn();
			break;
	}
}
