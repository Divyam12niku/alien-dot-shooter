const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let score = parseInt(localStorage.getItem('highScore')) || 0;
let level = 1;
let bullets = [];
let ship = { x: 180, y: 550, width: 40, height: 10 };
const shootSound = document.getElementById('shoot-sound');

function updateScoreDisplay() {
  document.getElementById('score-display').innerText = `Score: ${score}`;
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

function shoot() {
  bullets.push({ x: ship.x + ship.width / 2 - 2, y: ship.y });
  shootSound.currentTime = 0;
  shootSound.play();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  drawBullets();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') ship.x -= 10;
  if (e.key === 'ArrowRight') ship.x += 10;
  if (e.key === ' ') shoot();
});

updateScoreDisplay();
gameLoop();
