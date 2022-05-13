const canvas = document.getElementById("canvas");
const gameIntro = document.querySelector(".game-screen");
const titleText = document.getElementById("space-invaders-title");
const ctx = canvas.getContext("2d");
const startGameBtn = document.getElementById("start-button");

const bgImage = new Image();
bgImage.src = "../images/pixel-art-stellar-background.jpg";
const playerImg = new Image();
playerImg.src = "../images/playerShip3_orange.png";

const playerHeight = 60;
const playerWidth = 60;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - 200;
let playerSpeed = 3;

let playerIsGoingLeft = false;
let playerIsGoingRight = false;
let playerIsGoingUp = false;
let playerIsGoingDown = false;

let animationFrameId;
let gameOver = false;

function drawPlayer() {
  ctx.drawImage(playerImg, playerX, playerY, playerWidth, playerHeight);
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
    if (playerY  > 0) {
      playerY -= playerSpeed;
    }
  }
  if (playerIsGoingDown) {
    if (playerY + playerHeight < canvas.height) {
      playerY += playerSpeed;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  drawPlayer();
  animationFrameId = requestAnimationFrame(animate);
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
  });
  document.addEventListener("keyup", (event) => {
    playerIsGoingLeft = false;
    playerIsGoingRight = false;
    playerIsGoingUp = false;
    playerIsGoingDown = false;
  });
});
