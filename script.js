const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d'); 
const bgMusic = document.getElementById('bg-music'); 

const box = 15;
let dog, direction, score, bread, gameInterval;

// 🟡 Iniciar juego
startBtn.addEventListener('click', startGame);

function startGame() {
  startScreen.classList.add('display-none');
  gameContainer.classList.remove('hidden');

  // Estado inicial del juego
  dog = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  score = 0; 
  bread = randomBreadPosition();

  // Inicia el bucle
  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, 100);

   bgMusic.play().catch(err => {
    console.log('El navegador bloqueó la reproducción automática:', err);
  });
}

// 🥖 Pan aleatorio
function randomBreadPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// 🎮 Controles táctiles
document.getElementById('up').addEventListener('click', () => {
  if (direction !== 'DOWN') direction = 'UP';
});
document.getElementById('down').addEventListener('click', () => {
  if (direction !== 'UP') direction = 'DOWN';
});
document.getElementById('left').addEventListener('click', () => {
  if (direction !== 'RIGHT') direction = 'LEFT';
});
document.getElementById('right').addEventListener('click', () => {
  if (direction !== 'LEFT') direction = 'RIGHT';
});

// 🎹 Teclado
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  else if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

function drawGame() {
  ctx.fillStyle = '#fff8e1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pan
  ctx.fillStyle = '#d2a679';
  ctx.beginPath();
  ctx.arc(bread.x + box / 2, bread.y + box / 2, box / 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Perro
  for (let i = 0; i < dog.length; i++) {
    ctx.fillStyle = i === 0 ? '#8b4513' : '#a0522d';
    ctx.fillRect(dog[i].x, dog[i].y, box, box);
    ctx.strokeStyle = '#5c3317';
    ctx.strokeRect(dog[i].x, dog[i].y, box, box);
  }

  // Movimiento
  let dogX = dog[0].x;
  let dogY = dog[0].y;
  if (direction === 'LEFT') dogX -= box;
  if (direction === 'UP') dogY -= box;
  if (direction === 'RIGHT') dogX += box;
  if (direction === 'DOWN') dogY += box;

  // Comer pan
  if (dogX === bread.x && dogY === bread.y) {
    score++;
    bread = randomBreadPosition();
  } else {
    dog.pop();
  }

  let newHead = { x: dogX, y: dogY };

  // Colisiones
  if (
    dogX < 0 ||
    dogY < 0 ||
    dogX >= canvas.width ||
    dogY >= canvas.height ||
    collision(newHead, dog)
  ) {
    clearInterval(gameInterval);
    setTimeout(() => {
      alert(`🐶 ¡El perrito chocó! 🥺\nPuntaje final: ${score}`);
      gameContainer.classList.add('hidden');
      startScreen.classList.remove('display-none');
    }, 100);
  }

  dog.unshift(newHead);
}

function collision(head, array) {
  return array.some(segment => segment.x === head.x && segment.y === head.y);
}
