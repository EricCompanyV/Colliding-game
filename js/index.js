// DOM elements
const canvas = document.getElementById("canvas");
const gameIntro = document.querySelector(".game-start");
const runningGame = document.querySelector(".running-game");
const scoreBoard = document.querySelector(".score-display");
const titleText = document.getElementById("space-invaders-title");
const ctx = canvas.getContext("2d");
const startGameBtn = document.getElementById("start-button");
const gameOverScreen = document.querySelector(".game-over");
const restartBtn = document.getElementById("restart-button");
const gameScore = document.getElementById("score");
const gameLevel = document.getElementById("level");
const maxScore = document.getElementById("maximum-score");
const finalScore = document.getElementById("final-score");

// Images
const bgImage = new Image();
bgImage.src = "./images/pixel-art-stellar-background.jpg";
const playerImage = new Image();
playerImage.src = "./images/playerShip3_orange.png";
const brownMeteorImage = new Image();
brownMeteorImage.src = "./images/meteorBrown_big4.png";
const destroyedBrownMeteor = new Image();
destroyedBrownMeteor.src = "";
const missileImage = new Image();
missileImage.src = "./images/laserRed02.png";
const lifeImage = new Image();
lifeImage.src = "./images/hearth.png.png";
const lifePlusDrop = new Image();
lifePlusDrop.src = "./images/pill_red.png";
const speedPlusDrop = new Image();
speedPlusDrop.src = "./images/pill_yellow.png";
const shieldPlusDrop = new Image();
shieldPlusDrop.src = "./images/pill_blue.png";
const enemyImage = new Image();
enemyImage.src = "./images/enemyBlue2.png";
const pauseScreenImage = new Image();
pauseScreenImage.src = "./images/pause-screen.png";

//Audios
let gameAudio = new Audio();
gameAudio.src = "./audio/running-game.mp3";
gameAudio.volume = 0.1;
let laserShot = new Audio();
laserShot.src = "./audio/laserShot.mp3";
laserShot.volume = 0.025;
let explodeSound = new Audio();
explodeSound.volume = 0.2;
explodeSound.src = "./audio/explosion.mp3";
let startAudio = new Audio();
startAudio.src = "./audio/startAudio.mp3";
startAudio.volume = 0.15;
let restartAudio = new Audio();
restartAudio.src = "./audio/restartAudio.mp3";
restartAudio.volume = 0.1;

// Variables
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
let playerIsBubbled = false;
let pauseGame = true;
let gamePaused = false;
let muteGame = false;

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

let enemys = [];
let enemWidth = 50;
let enemHeight = 50;

let animationFrameId;
let pauseFrameId;
let gameOver = false;
let score = 0;
let currentLevel = 1;
let maximumScore = 0;

// Classes
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
    this.chanceToDrop = 1 + Math.floor(Math.random() * 99);
  }
  move() {
    this.yPos += this.speed;
  }
}

class Missile {
  constructor(xPos, xWidth, yPos, direction) {
    this.width = missileWidth;
    this.height = missileHeight;
    this.speed = missileSpeed;
    this.xPos = xPos + xWidth / 2;
    this.yPos = yPos + 10 * direction;
    this.destroyed = false;
    this.direction = direction;
  }
  move() {
    this.yPos += this.direction * this.speed;
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
    this.category = 1 + Math.floor(Math.random() * 3);
  }
  move() {
    this.yPos += this.speed;
  }
}
class Enemy {
  constructor() {
    this.width = enemWidth;
    this.height = enemHeight;
    this.speed = gravity * 1.05;
    this.xPos = Math.floor(Math.random() * (canvas.width - this.width));
    this.yPos = 0;
    this.destroyed = false;
    this.chanceToDrop = 1 + Math.floor(Math.random() * 100);
  }
  move() {
    this.yPos += this.speed;
  }
}

// Functions
function drawPlayer() {
  ctx.drawImage(
    playerImage,
    player.xPos,
    player.yPos,
    player.width,
    player.height
  );
  if (playerIsBubbled) {
    ctx.beginPath();
    ctx.arc(
      player.xPos + player.width / 2,
      player.yPos + player.height / 2,
      40,
      0,
      2 * Math.PI
    );
    ctx.lineWidth = 5;
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.closePath();
  }
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
    explodeSound.play();
    collisionChecked = true;
  }
  return collisionChecked;
}

function damagePlayer(player, objectCollidedWith) {
  objectCollidedWith.destroyed = true;
  explodeSound.play();
  if (!playerIsBubbled) {
    player.health -= 1;
    if (player.health === 0) {
      gameOver = true;
    }
  }
}

function objectDestruction(object, missile) {
  if (collision(object, missile)) {
    explodeSound.play();
    object.destroyed = true;
    missile.destroyed = true;
    if (object.chanceToDrop > 75) {
      drops.push(new Drop(object.xPos, object.yPos));
    }
    score += 100 + currentLevel * 25;
  }
}

function restartGame() {
  player.xPos = playerX;
  player.yPos = playerY;
  player.health = 3;
  player;
  obstacles = [];
  missiles = [];
  drops = [];
  enemys = [];
  gameOver = false;
  gravity = 2;
  animationFrameId = 0;
  playerSpeed = 3;
  currentLevel = 1;
  score = 0;
  gameAudio.currentTime = 0;
  restartAudio.pause();
  restartAudio.currentTime = 0;
  startGame();
}

function randomSpawnByLevel(n) {
  if (currentLevel <= 10) {
    return 50 - currentLevel * 5 + n;
  } else {
    return 2+n;
  }
}

function updateVisuals() {
  gameScore.innerHTML = score;
  gameLevel.innerHTML = currentLevel;
}

function toggleMuteGame() {
  if (muteGame) {
    gameAudio.volume = 0;
    startAudio.volume = 0;
    restartAudio.volume = 0;
  } else {
    gameAudio.volume = 0.1;
    startAudio.volume = 0.15;
    restartAudio.volume = 0.1;
  }
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
  switch (drop.category) {
    case 1:
      ctx.drawImage(lifePlusDrop, xPos, yPos, width, height);
      break;
    case 2:
      ctx.drawImage(speedPlusDrop, xPos, yPos, width, height);
      break;
    case 3:
      ctx.drawImage(shieldPlusDrop, xPos, yPos, width, height);
      break;
  }
}

function drawEnemy(enemy) {
  const { xPos, yPos, width, height } = enemy;
  enemy.move();
  ctx.drawImage(enemyImage, xPos, yPos, width, height);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  drawPlayer();
  const nextObstacles = [];
  obstacles.forEach((obstacle) => {
    if (collision(obstacle, player)) {
      damagePlayer(player, obstacle);
    }
    missiles.forEach((missile) => {
      objectDestruction(obstacle, missile);
    });
    if (
      obstacle.yPos < canvas.height + obstacle.height &&
      !obstacle.destroyed
    ) {
      nextObstacles.push(obstacle);
      drawObstacle(obstacle);
    }
  });
  obstacles = nextObstacles;

  const nextEnemys = [];
  enemys.forEach((enemy) => {
    if (collision(enemy, player)) {
      damagePlayer(player, enemy);
    }
    missiles.forEach((missile) => {
      objectDestruction(enemy, missile);
    });
    if (enemy.yPos < canvas.height + enemy.height && !enemy.destroyed) {
      nextEnemys.push(enemy);
      drawEnemy(enemy);
    }
  });
  enemys = nextEnemys;

  const nextMissiles = [];
  missiles.forEach((missile) => {
    if (missile.yPos > 0 - missile.height && !missile.destroyed) {
      nextMissiles.push(missile);
      drawMissile(missile);
    }
  });
  missiles = nextMissiles;

  const nextDrops = [];
  drops.forEach((drop) => {
    if (collision(player, drop)) {
      drop.destroyed = true;
      switch (drop.category) {
        case 1:
          if (player.health < 3) {
            player.health += 1;
          }
          break;
        case 2:
          player.speed *= 1.5;
          setTimeout(() => {
            player.speed /= 1.5;
          }, 3000);
          break;
        case 3:
          playerIsBubbled = true;
          setTimeout(() => {
            playerIsBubbled = false;
          }, 3000);
      }
    }
    if (drop.yPos < canvas.height + drop.height && !drop.destroyed) {
      nextDrops.push(drop);
      drawDrop(drop);
    }
  });

  drops = nextDrops;
  if (animationFrameId % randomSpawnByLevel(2) === 0) {
    obstacles.push(new Obstacle());
  }
  if (animationFrameId % randomSpawnByLevel(3) === 0) {
    enemys.push(new Enemy());
  }

  if (playerIsShooting && !laserInCooldown) {
    laserInCooldown = true;
    setTimeout(() => {
      laserInCooldown = false;
    }, 350);
    missiles.push(new Missile(player.xPos, playerWidth, player.yPos, -1));
    laserShot.play();
  }

  if (animationFrameId % 400 == 0) {
    gravity += 2;
    playerSpeed += 1;
    currentLevel += 1;
  }

  updateVisuals();

  if (gameOver) {
    cancelAnimationFrame(animationFrameId);
    gameAudio.pause();
    restartAudio.play();
    restartAudio.loop = true;
    if (score > maxScore.innerHTML) {
      maxScore.innerHTML = score;
    }
    finalScore.innerHTML = score;
    runningGame.style.display = "none";
    scoreBoard.style.display = "none";
    gameOverScreen.style.display = "flex";
    restartBtn.style.display = "flex";
  } else if (pauseGame) {
    gameAudio.play();
    gameAudio.loop = true;
    animationFrameId = requestAnimationFrame(animate);
  }
}

function startGame() {
  startAudio.pause();
  gameAudio.play();

  gameAudio.loop = true;
  gameIntro.style.display = "none";
  runningGame.style.display = "block";
  scoreBoard.style.display = "flex";
  gameOverScreen.style.display = "none";
  animate();
}

function drawPauseScreen() {
  ctx.drawImage(pauseScreenImage, 200, 200, 300, 300);
}

// Events
window.addEventListener("load", () => {
  startAudio.play();
  startAudio.loop = true;
  startGameBtn.addEventListener("click", () => {
    startGame();
  });
  restartBtn.addEventListener("click", () => {
    restartGame();
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
    if (event.code === "Escape") {
      pauseGame = !pauseGame;
      if (pauseGame) {
        cancelAnimationFrame(pauseFrameId);
        animate();
      } else if (!pauseGame) {
        gameAudio.pause();

        pauseFrameId = requestAnimationFrame(drawPauseScreen);
      }
    }
    if (event.code === "KeyM") {
      muteGame = !muteGame;
      toggleMuteGame();
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
