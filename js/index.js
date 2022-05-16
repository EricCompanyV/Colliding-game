const canvas = document.getElementById("canvas");
const gameIntro = document.querySelector(".game-start");
const runningGame = document.querySelector(".running-game");
const titleText = document.getElementById("space-invaders-title");
const ctx = canvas.getContext("2d");
const startGameBtn = document.getElementById("start-button");
const gameOverScreen = document.querySelector(".game-over")

const bgImage = new Image();
bgImage.src = "../images/pixel-art-stellar-background.jpg";
const playerImage = new Image();
playerImage.src = "../images/playerShip3_orange.png";
const brownMeteorImage = new Image();
brownMeteorImage.src = "../images/meteorBrown_big4.png";
const destroyedBrownMeteor = new Image();
destroyedBrownMeteor.src = "";
const missileImage = new Image();
missileImage.src = "../images/laserRed02.png";
const lifeImage = new Image();
lifeImage.src = "../images/hearth.png.png";
const lifePlusDrop = new Image();
lifePlusDrop.src = "../images/pill_red.png";

const playerHeight = 60;
const playerWidth = 60;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - 200;
let playerSpeed = 3;

let playerIsGoingLeft = false;
let playerIsGoingRight = false;
let playerIsGoingUp = false;
let playerIsGoingDown = false;
let playerIsShooting = false;

let obstacles = [];
let obstWidth = 70;
let obstHeight = 70;
let gravity = 2;

let missiles = [];
let missileWidth = 10;
let missileHeight = 10;
let missileSpeed = playerSpeed + 0.5;
let laserInCooldown = false;

let drops = [];
let dropWidth = 22;
let dropHeight = 20;
let dropSpeed = gravity;

let animationFrameId;
let gameOver = false;
let score = 0;

class Player {
  constructor() {
    this.xPos = playerX;
    this.yPos = playerY;
    this.speed = playerSpeed;
    this.width = playerWidth;
    this.height = playerHeight;
    this.health = 3;
  }
}
class Obstacle {
  constructor() {
    this.width = obstWidth;
    this.height = obstHeight;
    this.speed = gravity;
    this.xPos = Math.floor(Math.random() * (canvas.width - this.width));
    this.yPos = 0;
    this.destroyed = false;
    this.chanceToDrop = 1 + Math.floor(Math.random() * 100);
  }
  move() {
    this.yPos += this.speed;
  }
}

class Missile {
  constructor() {
    this.width = missileWidth;
    this.height = missileHeight;
    this.speed = missileSpeed;
    this.xPos = player.xPos + player.width / 2;
    this.yPos = player.yPos - 10;
    this.destroyed = false;
  }
  move() {
    this.yPos -= this.speed;
  }
}

class Drop {
  constructor(destroyedObstacleX, destroyedObstacleY) {
    this.width = dropWidth;
    this.height = dropHeight;
    this.speed = dropSpeed;
    this.xPos = destroyedObstacleX + obstWidth / 2;
    this.yPos = destroyedObstacleY + obstHeight / 2;
    this.destroyed = false;
  }
  move() {
    this.yPos += this.speed;
  }
}
function drawPlayer() {
  ctx.drawImage(
    playerImage,
    player.xPos,
    player.yPos,
    player.width,
    player.height
  );
  for (let i = 0; i < player.health; i += 1) {
    ctx.drawImage(lifeImage, 20 * i, 0, 50, 50);
  }

  if (playerIsGoingLeft) {
    if (player.xPos > 0) {
      player.xPos -= player.speed;
    }
  }
  if (playerIsGoingRight) {
    if (player.xPos + player.width < canvas.width) {
      player.xPos += player.speed;
    }
  }

  if (playerIsGoingUp) {
    if (player.yPos > 0) {
      player.yPos -= player.speed;
    }
  }
  if (playerIsGoingDown) {
    if (player.yPos + player.height < canvas.height) {
      player.yPos += player.speed;
    }
  }
}

function collision(a, b) {
  let collisionChecked = false;
  if (
    a.xPos < b.xPos + b.width &&
    a.xPos + a.width > b.xPos &&
    a.yPos < b.yPos + b.height &&
    a.height + a.yPos > b.yPos
  ) {
    // ¡colision detected!
    collisionChecked = true;
  }
  return collisionChecked;
}

function drawObstacle(obstacle) {
  const { xPos, yPos, width, height } = obstacle;

  obstacle.move();

  ctx.drawImage(brownMeteorImage, xPos, yPos, width, height);
}

function drawMissile(missile) {
  const { xPos, yPos, width, height } = missile;

  missile.move();
  ctx.drawImage(missileImage, xPos, yPos, width, height);
}

function drawDrop(drop) {
  const { xPos, yPos, width, height } = drop;

  drop.move();
  ctx.drawImage(lifePlusDrop, xPos, yPos, width, height);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  drawPlayer();
  const nextObstacles = [];
  obstacles.forEach((obstacle) => {
    if (collision(player, obstacle)) {
      obstacle.destroyed = true;
      player.health -= 1;
      console.log(player.health)
      console.log(animationFrameId)
      if (player.health === 0) {
        gameOver = true;
      }

    }
    missiles.forEach((missile) => {
      if (collision(obstacle, missile)) {
        obstacle.destroyed = true;
        missile.destroyed = true;
        if (obstacle.chanceToDrop > 75) {
          drops.push(new Drop(obstacle.xPos, obstacle.yPos));
        }
        score += 10;
      }
    });
    if (
      obstacle.yPos < canvas.height + obstacle.height &&
      !obstacle.destroyed
    ) {
      nextObstacles.push(obstacle);
      drawObstacle(obstacle);
      obstacles = nextObstacles;
    }
  });

  const nextMissiles = [];
  missiles.forEach((missile) => {
    if (missile.yPos > 0 - missile.height && !missile.destroyed) {
      nextMissiles.push(missile);
      drawMissile(missile);
      missiles = nextMissiles;
    }
  });

  const nextDrops = [];
  drops.forEach((drop) => {
    if (collision(player, drop)) {
      drop.destroyed = true
      if(player.health<3) {
        player.health +=1
      }
    }
    if (drop.yPos > 0 - drop.height && !drop.destroyed) {
      nextDrops.push(drop);
      drawDrop(drop);
      drops = nextDrops;
    }
  });
  if (animationFrameId % 75 === 0) {
    obstacles.push(new Obstacle());
  }

  if (playerIsShooting && !laserInCooldown) {
    laserInCooldown = true;
    setTimeout(() => {
      laserInCooldown = false;
    }, 350);
    missiles.push(new Missile());
  }

  if (animationFrameId % 500 == 0) {
    gravity += 2;
    playerSpeed += 1;
  }
  if (gameOver) {
    cancelAnimationFrame(animationFrameId);
    runningGame.style.display = "none"
    gameOverScreen.style.display = "block"

  } else {
    animationFrameId = requestAnimationFrame(animate);
    console.log({obstacles})
  }
}

function startGame() {
  gameIntro.style.display = "none";
  runningGame.style.display = "block";

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
    if (event.code === "Space") {
      playerIsShooting = false;
    }
  });
});

const player = new Player();
