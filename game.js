const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let score = parseInt(localStorage.getItem('highScore')) || 0;
let level = 1;
let bullets = [];
let aliens = [];
let ship = { x: 180, y: 550, width: 40, height: 10 };
let gameOver = false;
let alienSpeed = 0.5;

const shootSound = document.getElementById('shoot-sound');

const alienColors = [
  '#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff9900',
  '#ff3300', '#cc00ff', '#00ccff', '#33ff33', '#ff0000'
];

function getAlienColor(level) {
  return alienColors[Math.min(level - 1, alienColors.length - 1)];
}

function updateScoreDisplay() {
  const display = document.getElementById('score-display');
  if (gameOver) {
    display.innerText = `GAME OVER – Score: ${score} – Tap to restart`;
  } else {
    display.innerText = `Score: ${score} | Level: ${level}`;
  }
}

function drawShip() {
  ctx.fillStyle = 'white';
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function drawBullets() {
  ctx.fillStyle = 'orange';
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, 4, 10);
    b.y -= 5;
  });
}

function drawAliens() {
  ctx.fillStyle = getAlienColor(level);
  aliens.forEach(a => {
    if (a.alive) {
      ctx.fillRect(a.x, a.y, a.width, a.height);
      a.y += alienSpeed;

      if (a.y + a.height > ship.y) {
        gameOver = true;
        updateScoreDisplay();
      }
    }
  });
}

function shoot() {
  if (gameOver) return;
  bullets.push({ x: ship.x + ship.width / 2 - 2, y: ship.y });
  shootSound.currentTime = 0;
  shootSound.play();
}

function spawnAliens() {
  aliens = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      aliens.push({
        x: 50 + i * 60,
        y: 50 + j * 40,
        width: 30,
        height: 10,
        alive: true
      });
    }
  }
}

function handleCollisions() {
  bullets.forEach(b => {
    aliens.forEach(a => {
      if (a.alive &&
        b.x < a.x + a.width &&
        b.x + 4 > a.x &&
        b.y < a.y + a.height &&
        b.y + 10 > a.y) {
        a.alive = false;
        b.hit = true;
        score += 10;
        localStorage.setItem('highScore', score);
        updateScoreDisplay();
      }
    });
  });
  bullets = bullets.filter(b => !b.hit && b.y > 0);
}

function checkLevelComplete() {
  const allDead = aliens.every(a => !a.alive);
  if (allDead) {
    level = Math.min(level + 1, 10);
    alienSpeed *= 1.1; // 10% harder
    spawnAliens();
  }
}

function resetGame() {
  gameOver = false;
  score = 0;
  level = 1;
  alienSpeed = 0.5;
  bullets = [];
  ship.x = 180;
  spawnAliens();
  updateScoreDisplay();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!gameOver) {
    drawShip();
    drawBullets();
    drawAliens();
    handleCollisions();
    checkLevelComplete();
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') ship.x = Math.max(0, ship.x - 10);
  if (e.key === 'ArrowRight') ship.x = Math.min(canvas.width - ship.width, ship.x + 10);
  if (e.key === ' ') shoot();
});

canvas.addEventListener('click', () => {
  if (gameOver) resetGame();
});

updateScoreDisplay();
spawnAliens();
gameLoop();
