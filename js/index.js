const canvas = document.getElementById("canvas");
const gameIntro = document.querySelector(".game-screen");
const titleText = document.getElementById("space-invaders-title");
const ctx = canvas.getContext("2d");
const startGameBtn = document.getElementById("start-button");

const bgImage = new Image();
bgImage.src = "../images/pixel-art-stellar-background.jpg";
const playerImg = new Image();
playerImg.src = "../images/playerShip3_orange.png";
const brownMeteorImage = new Image();
brownMeteorImage.src = "../images/meteorBrown_big4.png";

const playerHeight = 60;
const playerWidth = 60;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - 200;
let playerSpeed = 3;
let obstSpeed = 2;
let obstW = 70;
let obsHeight = 70;

let playerIsGoingLeft = false;
let playerIsGoingRight = false;
let playerIsGoingUp = false;
let playerIsGoingDown = false;
let playerIsShooting = false

let animationFrameId;
let gameOver = false;

let obstacles = [];

class Obstacle {
  constructor() {
    this.width = obstW;
    this.height = obsHeight;
    this.speed = obstSpeed;
    this.xPos = Math.floor(Math.random() * (canvas.width-this.width));
    this.yPos = 0;
  }

  move() {
    this.yPos += this.speed;
  }
}

function drawPlayer() {
  ctx.drawImage(playerImg, playerX, playerY, playerWidth, playerHeight);
  console.log("player printed");
  if (playerIsGoingLeft) {
    if (playerX > 0) {
      playerX -= playerSpeed;
    }
  }
  if (playerIsGoingRight) {
    if (playerX + playerWidth < canvas.width) {
      playerX += playerSpeed;
    }
  }

  if (playerIsGoingUp) {
    if (playerY > 0) {
      playerY -= playerSpeed;
    }
  }
  if (playerIsGoingDown) {
    if (playerY + playerHeight < canvas.height) {
      playerY += playerSpeed;
    }
  }
}

function drawObstacle(obstacle) {
  const { xPos, yPos, width, height } = obstacle; 
  console.log(obstacle)

  obstacle.move();

  ctx.drawImage(brownMeteorImage, xPos, yPos, width, height);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  drawPlayer();
  const nextObstacles = [];
  obstacles.forEach((obstacle) => {
    console.log("new obs");
    if (
      playerX < obstacle.xPos + obstacle.width &&
      playerX + playerWidth > obstacle.xPos &&
      playerY < obstacle.yPos + obstacle.height &&
      playerHeight + playerY > obstacle.yPos
    ) {
      gameOver = true;
      console.log("Collision!")
    } 
    

    drawObstacle(obstacle);
    if (obstacle.yPos > canvas.height + obstacle.yPos) {
      nextObstacles.push(obstacle);

      obstacles = nextObstacles;
    }
  });
  
  if (animationFrameId % 75 === 0) {
    obstacles.push(new Obstacle());
  }

  if(animationFrameId % 500 == 0){
    obstSpeed += 2
    playerSpeed += 1
    
  }
  if (gameOver) {
    cancelAnimationFrame(animationFrameId);
  } else {
    console.log(animationFrameId);
    animationFrameId = requestAnimationFrame(animate);
  }
}

function startGame() {
  startGameBtn.style.display = "none";
  titleText.style.display = "none";
  canvas.style.display = "block";
  animate();
}

window.addEventListener("load", () => {
  startGameBtn.addEventListener("click", () => {
    startGame();
  });
  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
      playerIsGoingLeft = true;
    }
    if (event.code === "ArrowRight") {
      playerIsGoingRight = true;
    }
    if (event.code === "ArrowUp") {
      playerIsGoingUp = true;
    }
    if (event.code === "ArrowDown") {
      playerIsGoingDown = true;
    }
    if (event.code === "Space") {
      playerIsShooting = true;
    }
  });
  document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") {
      playerIsGoingLeft = false;
    }
    if (event.code === "ArrowRight") {
      playerIsGoingRight = false;
    }
    if (event.code === "ArrowUp") {
      playerIsGoingUp = false;
    }
    if (event.code === "ArrowDown") {
      playerIsGoingDown = false;
    }
  });
});
