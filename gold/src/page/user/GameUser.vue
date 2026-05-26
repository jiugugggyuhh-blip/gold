<template>
  <div class="snake-container" dir="rtl">
    
    <div class="game-ui">
      
      <div class="hud-top">
        <div class="score-card">
          <span class="label">امتیاز</span>
          <span class="value">{{ score }}</span>
        </div>
        <div class="score-card small">
          <span class="label">رکورد</span>
          <span class="value">{{ highScore }}</span>
        </div>
      </div>

      <div class="overlay-modal" v-if="!isPlaying">
        <div class="modal-content">
          <div class="logo">🐍</div>
          <h2 v-if="isGameOver" class="status-text">باختی!</h2>
          <h2 v-else class="status-text">مارِ زرین</h2>
          
          <p v-if="isGameOver">امتیاز نهایی: <span class="gold-text">{{ score }}</span></p>
          <p v-else>جواهرات را بخورید و طولانی شوید!</p>

          <button @click="startGame" class="btn-start">
            {{ isGameOver ? 'تلاش دوباره ↻' : 'شروع بازی ▶' }}
          </button>
        </div>
      </div>

      <div class="touch-controls" v-if="isPlaying">
        <div class="t-btn t-up" @click="changeDir(0, -1)"></div>
        <div class="t-btn t-down" @click="changeDir(0, 1)"></div>
        <div class="t-btn t-left" @click="changeDir(-1, 0)"></div>
        <div class="t-btn t-right" @click="changeDir(1, 0)"></div>
      </div>

    </div>

    <canvas ref="canvasRef"></canvas>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// --- تنظیمات بازی ---
const GRID_SIZE = 20; // اندازه هر خانه
const SPEED_BASE = 150; // سرعت اولیه (میلی ثانیه)
const COLORS = {
  bg: '#111111',
  snakeHead: '#00ffff', // فیروزه‌ای
  snakeBody: '#FFD700', // طلا
  foodCoin: '#ffcc00',
  foodDiamond: '#00eaff'
};

// --- State ---
const canvasRef = ref(null);
const isPlaying = ref(false);
const isGameOver = ref(false);
const score = ref(0);
const highScore = ref(parseInt(localStorage.getItem('snake_highscore')) || 0);

// متغیرهای منطق بازی (خارج از ری‌اکتیویتی ویو برای پرفورمنس بالا)
let ctx = null;
let gameLoopId = null;
let snake = [];
let food = {};
let direction = { x: 0, y: 0 }; // حرکت فعلی
let nextDirection = { x: 0, y: 0 }; // بافر حرکت بعدی (برای جلوگیری از باگ برگشت ناگهانی)
let lastTime = 0;
let canvasWidth = 0;
let canvasHeight = 0;
let tilesX = 0;
let tilesY = 0;
let gameSpeed = SPEED_BASE;

// --- راه‌اندازی ---

onMounted(() => {
  initCanvas();
  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', handleKeydown);
  
  // تنظیم تاچ (Swipe)
  const c = canvasRef.value;
  c.addEventListener('touchstart', handleTouchStart, { passive: false });
  c.addEventListener('touchmove', handleTouchMove, { passive: false });
});

onUnmounted(() => {
  stopGame();
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', handleKeydown);
});

const initCanvas = () => {
  const c = canvasRef.value;
  ctx = c.getContext('2d');
  handleResize();
};

const handleResize = () => {
  // تنظیم سایز کانواس بر اساس کانتینر والد
  const container = canvasRef.value.parentElement;
  canvasWidth = container.clientWidth;
  // ارتفاع را مضربی از GRID_SIZE می‌کنیم که کامل پر شود
  canvasHeight = Math.floor(container.clientHeight / GRID_SIZE) * GRID_SIZE;
  canvasWidth = Math.floor(canvasWidth / GRID_SIZE) * GRID_SIZE;

  canvasRef.value.width = canvasWidth;
  canvasRef.value.height = canvasHeight;

  tilesX = canvasWidth / GRID_SIZE;
  tilesY = canvasHeight / GRID_SIZE;
  
  if (!isPlaying.value) render(); // رندر یک فریم ثابت
};

// --- هسته بازی ---

const startGame = () => {
  score.value = 0;
  isGameOver.value = false;
  isPlaying.value = true;
  gameSpeed = SPEED_BASE;
  
  // تنظیم اولیه مار (وسط صفحه)
  const startX = Math.floor(tilesX / 2);
  const startY = Math.floor(tilesY / 2);
  snake = [
    { x: startX, y: startY },
    { x: startX, y: startY + 1 },
    { x: startX, y: startY + 2 }
  ];
  
  direction = { x: 0, y: -1 }; // حرکت به بالا
  nextDirection = { x: 0, y: -1 };
  
  spawnFood();
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
};

const stopGame = () => {
  isPlaying.value = false;
  cancelAnimationFrame(gameLoopId);
};

const gameOver = () => {
  stopGame();
  isGameOver.value = true;
  if (score.value > highScore.value) {
    highScore.value = score.value;
    localStorage.setItem('snake_highscore', highScore.value);
  }
};

const spawnFood = () => {
  let valid = false;
  while (!valid) {
    food = {
      x: Math.floor(Math.random() * tilesX),
      y: Math.floor(Math.random() * tilesY),
      type: Math.random() > 0.8 ? 'diamond' : 'coin' // 20% شانس الماس
    };
    // مطمئن شویم غذا روی بدن مار نیفتد
    valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
  }
};

// --- حلقه اصلی بازی ---

const gameLoop = (timestamp) => {
  if (!isPlaying.value) return;

  // کنترل سرعت بازی
  if (timestamp - lastTime > gameSpeed) {
    update();
    lastTime = timestamp;
  }
  
  render();
  gameLoopId = requestAnimationFrame(gameLoop);
};

const update = () => {
  // اعمال جهت جدید
  direction = { ...nextDirection };

  // محاسبه موقعیت سر جدید
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // 1. بررسی برخورد با دیوار
  if (head.x < 0 || head.x >= tilesX || head.y < 0 || head.y >= tilesY) {
    gameOver();
    return;
  }

  // 2. بررسی برخورد با خود
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }

  // حرکت مار (اضافه کردن سر جدید)
  snake.unshift(head);

  // 3. بررسی خوردن غذا
  if (head.x === food.x && head.y === food.y) {
    // امتیاز
    const points = food.type === 'diamond' ? 50 : 10;
    score.value += points;
    
    // افزایش سرعت جزئی به ازای هر غذا (چالش)
    if (gameSpeed > 50) gameSpeed -= 1; 
    
    spawnFood();
    // دم مار را حذف نمی‌کنیم تا بلند شود
  } else {
    // غذا نخورده، پس دم را حذف می‌کنیم تا حرکت کند
    snake.pop();
  }
};

// --- رندرینگ (گرافیک) ---

const render = () => {
  // پاک کردن صفحه
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // رسم گرید (اختیاری - کمرنگ)
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= canvasWidth; x += GRID_SIZE) { ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); }
  for (let y = 0; y <= canvasHeight; y += GRID_SIZE) { ctx.moveTo(0, y); ctx.lineTo(canvasWidth, y); }
  ctx.stroke();

  // رسم غذا
  const fx = food.x * GRID_SIZE + GRID_SIZE/2;
  const fy = food.y * GRID_SIZE + GRID_SIZE/2;
  
  ctx.shadowBlur = 15;
  if (food.type === 'diamond') {
    ctx.shadowColor = COLORS.foodDiamond;
    ctx.fillStyle = COLORS.foodDiamond;
    ctx.beginPath();
    ctx.arc(fx, fy, GRID_SIZE/2 - 2, 0, Math.PI * 2); // دایره
    ctx.fill();
  } else {
    ctx.shadowColor = COLORS.foodCoin;
    ctx.fillStyle = COLORS.foodCoin;
    ctx.beginPath();
    ctx.rect(food.x * GRID_SIZE + 2, food.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4); // مربع
    ctx.fill();
  }
  ctx.shadowBlur = 0; // ریست سایه

  // رسم مار
  snake.forEach((segment, index) => {
    const x = segment.x * GRID_SIZE;
    const y = segment.y * GRID_SIZE;
    
    if (index === 0) {
      // سر مار
      ctx.fillStyle = COLORS.snakeHead;
      ctx.shadowBlur = 10;
      ctx.shadowColor = COLORS.snakeHead;
    } else {
      // بدن مار (گرادینت طلایی)
      ctx.fillStyle = COLORS.snakeBody;
      ctx.shadowBlur = 0;
    }

    // کمی گرد کردن گوشه‌های مار
    const padding = 1;
    ctx.fillRect(x + padding, y + padding, GRID_SIZE - 2*padding, GRID_SIZE - 2*padding);
  });
};

// --- کنترل‌ها ---

const changeDir = (x, y) => {
  // جلوگیری از دنده عقب (مثلا اگر داره میره بالا، نمیتونه بیاد پایین)
  if (direction.x === -x && direction.y === -y) return;
  nextDirection = { x, y };
};

const handleKeydown = (e) => {
  if (!isPlaying.value) return;
  
  switch(e.key) {
    case 'ArrowUp': changeDir(0, -1); break;
    case 'ArrowDown': changeDir(0, 1); break;
    case 'ArrowLeft': changeDir(-1, 0); break;
    case 'ArrowRight': changeDir(1, 0); break;
  }
};

// --- تاچ و Swipe ---
let touchStartX = 0;
let touchStartY = 0;

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  if (!isPlaying.value) return;
  e.preventDefault(); // جلوگیری از اسکرول صفحه

  if (!touchStartX || !touchStartY) return;

  const touchEndX = e.touches[0].clientX;
  const touchEndY = e.touches[0].clientY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  // تشخیص اینکه حرکت بیشتر افقی بوده یا عمودی
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // افقی
    if (diffX > 0) changeDir(-1, 0); // چپ (برعکس Swipe) -> اصلاح: در Swipe اگر بکشی چپ یعنی میخوای بری چپ
    else changeDir(1, 0); // راست
  } else {
    // عمودی
    if (diffY > 0) changeDir(0, -1); // بالا
    else changeDir(0, 1); // پایین
  }
  
  // ریست برای جلوگیری از تغییر جهت مداوم در یک Swipe طولانی
  // برای حساسیت کمتر، این خط رو پاک کنید و فقط در Touchend اجرا کنید
  // اما برای مار بازی، واکنش سریع بهتره:
  if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
      touchStartX = touchEndX;
      touchStartY = touchEndY;
  }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap');

.snake-container {
  font-family: 'Vazirmatn', sans-serif;
  position: relative;
  width: 100%;
  max-width: 500px; /* عرض مناسب موبایل */
  height: 60vh;     /* ارتفاع ثابت */
  min-height: 400px;
  background: #000;
  margin: 0 auto;
  border-radius: 15px;
  border: 2px solid #333;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  display: block;
  background: #111;
  width: 100%;
  height: 100%;
}

/* UI */
.game-ui {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; /* کلیک‌ها از UI رد بشن برسن به دکمه‌ها */
  z-index: 10;
}

.hud-top {
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

.score-card {
  background: rgba(255, 215, 0, 0.15);
  border: 1px solid #FFD700;
  padding: 5px 15px;
  border-radius: 20px;
  color: #FFD700;
  text-align: center;
  backdrop-filter: blur(4px);
}
.score-card.small { transform: scale(0.9); opacity: 0.8; border-color: #aaa; color: #aaa; }

.label { display: block; font-size: 0.7rem; text-transform: uppercase; }
.value { display: block; font-size: 1.2rem; font-weight: bold; }

/* Modals */
.overlay-modal {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto; /* فعال کردن کلیک روی مودال */
  backdrop-filter: blur(5px);
}

.modal-content {
  text-align: center;
  color: white;
  animation: popIn 0.3s ease;
}

.logo { font-size: 4rem; margin-bottom: 10px; filter: drop-shadow(0 0 10px gold); }
.status-text { font-size: 2rem; margin: 0; color: #fff; }
.gold-text { color: #FFD700; font-weight: bold; font-size: 1.4rem; }

.btn-start {
  background: linear-gradient(45deg, #FFD700, #DAA520);
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  color: #000;
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
  transition: transform 0.2s;
}
.btn-start:active { transform: scale(0.95); }

/* Touch Controls Grid */
.touch-controls {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  pointer-events: auto;
  z-index: 5;
}
/* دکمه‌های نامرئی برای کنترل راحت‌تر */
/* اما چون Swipe داریم، این‌ها رو می‌تونیم برای کلیک گوشه‌ها استفاده کنیم یا حذف کنیم.
   اینجا منطق ساده‌تری پیاده کردم: کلیک روی ۴ جهت صفحه */
.t-btn {  } 
.t-up { grid-column: 1 / span 2; grid-row: 1 / 2; clip-path: polygon(50% 100%, 0 0, 100% 0); }
.t-down { grid-column: 1 / span 2; grid-row: 2 / 3; clip-path: polygon(50% 0, 0 100%, 100% 100%); }
/* نکته: پیاده سازی دکمه‌های نامرئی کمی پیچیده است، پیشنهاد میکنم فقط به Swipe و کیبورد اکتفا کنید 
   چون بازی با Swipe خیلی طبیعی‌تره */

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>