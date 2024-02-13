import Player from "./Player.js";
import Ground from "./Ground.js";
import EnemieController from "./EnemieController.js";
import Score from "./Score.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.5;
const PLAYER_HEIGHT = 84 / 1.5;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 170;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 120;
const GROUND_AND_ENEMIES_SPEED = 0.5;

const ENEMIE_CONFIG = [
  { width: 100 / 1.5, height: 100 / 1.5, image: "images/Koopagreen.png" },
  { width: 140 / 1.5, height: 150 / 1.5, image: "images/king_boo.png" },
  { width: 130 / 1.5, height: 100 / 1.5, image: "images/enemiesmall.png" },
  //   { width: 140 / 1.5, height: 170 / 1.5, image: "images/bowswer.png" },
];

//GAME OBJECTS

let player = null;
let ground = null;
let enemieController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenerForRestart = false;
let startGame = true;

function createSprites() {
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minHeightJumpInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minHeightJumpInGame,
    maxJumpHeightInGame,
    scaleRatio,
  );
  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    GROUND_AND_ENEMIES_SPEED,
    scaleRatio,
  );

  const enemieImages = ENEMIE_CONFIG.map((enemies) => {
    const image = new Image();
    image.src = enemies.image;
    return {
      image: image,
      width: enemies.width * scaleRatio,
      height: enemies.height * scaleRatio,
    };
  });

  enemieController = new EnemieController(
    ctx,
    enemieImages,
    scaleRatio,
    GROUND_AND_ENEMIES_SPEED,
  );

  score = new Score(ctx, scaleRatio);
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();

window.addEventListener("resize", () => setTimeout(setScreen, 200));

if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}

function getScaleRatio() {
  const screeHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight,
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth,
  );

  if (screenWidth / screeHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screeHeight / GAME_HEIGHT;
  }
}

const collisionSound = new Audio(
  "Audio/mixkit-player-losing-or-failing-2042.wav",
);

const backgroundMusic = new Audio();
backgroundMusic.src = "Audio/panic-182769.mp3";
backgroundMusic.volume = 0.3;

function showGameOver() {
  const fontSize = 90 * scaleRatio;
  ctx.font = `${fontSize}px Brush Script MT`;
  ctx.fillStyle = "HotPink";
  const x = canvas.width / 3.3;
  const y = canvas.height / 2;
  ctx.fillText("Game Over", x, y);
}

// window.addEventListener("keydown", (event) => {
//   if (event.code === "KeyC") {
//     score.clearHighScore();
//   }
// });

function setupGameReset() {
  if (!hasAddedEventListenerForRestart) {
    hasAddedEventListenerForRestart = true;

    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
    }, 3000);
  }
}

function reset() {
  hasAddedEventListenerForRestart = false;
  gameOver = false;
  startGame = false;
  ground.reset();
  enemieController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
  backgroundMusic.load();
  backgroundMusic.play();
}

function startText() {
  const fontSize = 20 * scaleRatio;
  ctx.font = `${fontSize}px Courier New`;
  ctx.fillStyle = "Teal";
  const x = canvas.width / 5;
  const y = canvas.height / 2;
  ctx.fillText(" Tryck enter (skärm) för att Spela & Hoppa", x, y);

  backgroundMusic.load();
  backgroundMusic.loop = true;
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

function clearScreen() {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  // score.clearHighScore();

  if (!gameOver && !startGame) {
    //UPDATE GAME OBJECTS
    ground.update(gameSpeed, frameTimeDelta);

    enemieController.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);

    updateGameSpeed(frameTimeDelta);
  }

  if (!gameOver && enemieController.collideWith(player)) {
    gameOver = true;
    setupGameReset();
    score.setHighScore();
    backgroundMusic.pause();
    collisionSound.play();
  }

  //   backgroundMusic.play();

  //DRAW GAME OBJECTS
  ground.draw();
  enemieController.draw();
  player.draw();
  score.draw();

  if (gameOver) {
    showGameOver();
  }

  if (startGame) {
    startText();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
