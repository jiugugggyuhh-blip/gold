<template>
  <div dir="rtl" class="relative w-full min-h-[760px] flex flex-col items-center justify-start overflow-hidden pt-10 pb-14">

    <!-- Background نزدیک به عکس -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,214,102,0.12),transparent_45%),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(#071824,#050d14)]"></div>
      <div class="absolute inset-0 opacity-[0.05]" style="background-image:url('https://www.transparenttextures.com/patterns/stardust.png');"></div>

      <!-- چند المان دکوری (اختیاری) -->
      <div class="absolute left-6 top-24 w-28 h-28 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,214,102,0.35),transparent_60%)] blur-[2px]"></div>
      <div class="absolute right-10 top-40 w-20 h-28 rounded-2xl bg-white/10 blur-[0.5px] rotate-12"></div>
      <div class="absolute left-10 bottom-28 w-24 h-14 bg-white/5 rounded-2xl blur-[0.5px] rotate-[-12deg]"></div>
    </div>

    <!-- تیتر مثل عکس -->
    <div class="text-center px-6">
      <div class="text-[28px] sm:text-[32px] font-extrabold text-white">
        یه چرخ بزن، <span class="text-gold">بیت‌کوین</span> ببر!
      </div>
    </div>

    <!-- Wheel -->
    <div class="mt-8 relative">
      <!-- Outer white border -->
      <div class="wheel-outer">
        <!-- Gold ring -->
        <div class="wheel-ring">

          <!-- bulbs -->
          <div class="absolute inset-0">
            <div
              v-for="n in bulbCount"
              :key="n"
              class="bulb"
              :class="isSpinning ? 'bulb-blink' : ''"
              :style="getBulbStyle(n - 1, bulbCount)"
            />
          </div>

          <!-- inner white border -->
          <div class="wheel-inner-border">
            <!-- Rotating wheel -->
            <div
              ref="wheelRef"
              class="wheel-face"
              :style="{
                transform: `rotate(${currentRotation}deg)`,
                transition: isSpinning ? `transform ${spinDuration}s cubic-bezier(.15,.85,.2,1)` : 'none'
              }"
            >
              <svg viewBox="0 0 100 100" class="w-full h-full">
                <g v-for="(item, i) in items" :key="i">
                  <path
                    :d="getSectorPath(i)"
                    :fill="i % 2 === 0 ? '#1C1C1C' : '#FFFFFF'"
                    stroke="#E5E7EB"
                    stroke-width="0.6"
                  />

                  <!-- Label -->
                  <g :transform="getLabelTransform(i)">
                    <text
                      text-anchor="middle"
                      dominant-baseline="middle"
                      :fill="i % 2 === 0 ? '#FFFFFF' : '#111827'"
                      font-weight="800"
                      font-size="4.6"
                      class="font-dana select-none"
                      style="paint-order: stroke; stroke: rgba(0,0,0,0.18); stroke-width: 0.35px;"
                    >
                      <tspan
                        v-for="(line, li) in normalizeLabel(item)"
                        :key="li"
                        x="0"
                        :dy="li === 0 ? 0 : 5.2"
                      >
                        {{ line }}
                      </tspan>
                    </text>
                  </g>

                  
                </g>
              </svg>

              <!-- یک گلس/هایلایت خیلی کم مثل عکس -->
              <div class="absolute inset-0 pointer-events-none rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_55%)]" />
            </div>

            <!-- Center pointer (قطره طلایی رو به بالا) -->
            <div class="center-pointer">
              <svg viewBox="0 0 100 100" class="w-full h-full">
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#FFE08A" />
                    <stop offset="0.55" stop-color="#F6C34A" />
                    <stop offset="1" stop-color="#D5961E" />
                  </linearGradient>
                </defs>

                <!-- teardrop -->
                <path
                  d="M50 10
                     C38 26 34 36 34 48
                     C34 66 42 78 50 78
                     C58 78 66 66 66 48
                     C66 36 62 26 50 10Z"
                  fill="url(#goldGrad)"
                  stroke="#C88914"
                  stroke-width="2"
                />
                <!-- hub circle -->
                <circle cx="50" cy="60" r="18" fill="url(#goldGrad)" stroke="#C88914" stroke-width="2"/>
              </svg>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Button مثل عکس -->
    <button
      class="mt-8 w-[90vw] max-w-[520px] h-14 rounded-lg bg-[#D9A63F] text-[#111827] font-extrabold text-lg shadow-[0_12px_30px_-14px_rgba(0,0,0,0.9)] active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      :disabled="isSpinning"
      @click="spin"
    >
      <span class="inline-flex w-6 h-6 rounded-full bg-black/10 items-center justify-center">🎡</span>
      <span>چرخاندن گردونه</span>
    </button>

    <!-- نمایش نتیجه (اختیاری) -->
    <div class="mt-5 min-h-[44px] flex items-center justify-center px-6">
      <transition name="pop" mode="out-in">
        <div v-if="winner" key="w" class="text-white font-bold">
          برنده شدی: <span class="text-gold">{{ winner.labelText }}</span>
        </div>
        <div v-else key="i" class="text-white/50 text-sm">
          شانس خود را امتحان کنید
        </div>
      </transition>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";

const items = ref([
  // برای “عین عکس” بهتره label دو خطی باشه
  { label: ["0.1", "بیت‌کوین"], labelText: "0.1 بیت‌کوین", weight: 6 },

  { label: ["پلی‌استیشن", "5"], labelText: "پلی‌استیشن 5", weight: 5 },

  { label: ["کارت", "1000 دلار"], labelText: "کارت 1000 دلار", weight: 10 },

  { label: ["اتریوم", "1"], labelText: "اتریوم 1", weight: 10 },

  { label: ["بالانس", "2"], labelText: "بالانس 2", weight: 12  },

  { label: ["17", "تتر"], labelText: "17 تتر", weight: 20  },
  { label: ["0.1", "بیت‌کوین"], labelText: "0.1 بیت‌کوین", weight: 6 },

  { label: ["پلی‌استیشن", "5"], labelText: "پلی‌استیشن 5", weight: 5 },

  { label: ["کارت", "1000 دلار"], labelText: "کارت 1000 دلار", weight: 10 },

  { label: ["اتریوم", "1"], labelText: "اتریوم 1", weight: 10 },

  { label: ["بالانس", "2"], labelText: "بالانس 2", weight: 12  },

  { label: ["17", "تتر"], labelText: "17 تتر", weight: 20  },

  
]);

const bulbCount = 12;

const isSpinning = ref(false);
const currentRotation = ref(0);
const spinDuration = ref(5.5);
const winner = ref(null);

const wheelRef = ref(null);

const count = computed(() => items.value.length);
const sliceDeg = computed(() => 360 / count.value);

// صداها (اختیاری)
const sounds = ref({ tick: null, win: null, spinStart: null });

onMounted(() => {
  try {
    sounds.value.tick = new Audio("https://assets.mixkit.co/active_storage/sfx/2579/2579-preview.m4a");
    sounds.value.win = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.m4a");
    sounds.value.spinStart = new Audio("https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.m4a");
    Object.values(sounds.value).forEach((s) => s && (s.volume = 0.4));
    if (sounds.value.tick) sounds.value.tick.volume = 0.25;
  } catch {
    console.log("E");
    
  }
});

function playSound(name) {
  const s = sounds.value[name];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
}

// ---- Geometry ----
const degToRad = (d) => (d * Math.PI) / 180;

function polar(angleDeg, radius) {
  const a = degToRad(angleDeg);
  return {
    x: 50 + radius * Math.cos(a),
    y: 50 + radius * Math.sin(a),
  };
}

/**
 * اسلایس‌ها طوری ساخته شدن که “مرکز اسلایس 0” دقیقاً بالا (۱۲) باشه مثل عکس
 * centerAngle(i) = -90 + i*slice
 * start = center - slice/2
 */
function getSectorPath(i) {
  const ang = sliceDeg.value;
  const center = -90 + i * ang;
  const startDeg = center - ang / 2;
  const endDeg = center + ang / 2;

  const r = 50, cx = 50, cy = 50;
  const s = degToRad(startDeg);
  const e = degToRad(endDeg);

  const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);

  const largeArc = ang > 180 ? 1 : 0;
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;
}

function getLabelTransform(i) {
  const ang = sliceDeg.value;
  const center = -90 + i * ang;
  const pos = polar(center, 34); // نزدیک لبه مثل عکس
  const rot = center + 90;       // بالا => 0 درجه (مثل عکس)
  return `translate(${pos.x},${pos.y}) rotate(${rot})`;
}


function normalizeLabel(item) {
  if (Array.isArray(item.label)) return item.label;
  return [String(item.label)];
}

// ---- Logic ----
function getWeightedWinnerIndex() {
  const total = items.value.reduce((s, it) => s + (it.weight || 1), 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.value.length; i++) {
    const w = items.value[i].weight || 1;
    if (r < w) return i;
    r -= w;
  }
  return 0;
}

/**
 * تبدیل زاویه روتیشن فعلی به اندیس برنده (با توجه به اینکه اسلایس 0 بالاست)
 */
function indexFromRotation(rotDeg) {
  const ang = sliceDeg.value;
  const rot = ((rotDeg % 360) + 360) % 360;        // 0..359
  const local = (360 - rot) % 360;                 // -rot mod 360
  const idx = Math.floor((local + ang / 2) / ang) % count.value; // نزدیک‌ترین مرکز
  return idx;
}

// Tick monitor
let rafId = null;
let lastIndex = -1;
function monitorTick() {
  if (!isSpinning.value || !wheelRef.value) return;

  const style = window.getComputedStyle(wheelRef.value);
  const Matrix = window.DOMMatrix || window.WebKitCSSMatrix;
  if (!Matrix) return;

  const m = new Matrix(style.transform);
  let angle = Math.atan2(m.b, m.a) * (180 / Math.PI);
  if (angle < 0) angle += 360;

  const idx = indexFromRotation(angle);
  if (lastIndex !== -1 && idx !== lastIndex) {
    playSound("tick");
  }
  lastIndex = idx;

  rafId = requestAnimationFrame(monitorTick);
}

async function spin() {
  if (isSpinning.value) return;

  isSpinning.value = true;
  winner.value = null;
  lastIndex = -1;

  playSound("spinStart");

  const winIndex = getWeightedWinnerIndex();
  const extraSpins = 7; // مثل عکس (چند دور کامل)
  const jitter = (Math.random() - 0.5) * (sliceDeg.value * 0.65);

  // برای اینکه با روتیشن مثبت (ساعتگرد) به برنده برسیم:
  // align = 360 - winIndex*slice
  const align = (360 - (winIndex * sliceDeg.value)) % 360;

  spinDuration.value = 5.5;
  currentRotation.value = currentRotation.value + extraSpins * 360 + align + jitter;

  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(monitorTick);
}

// پایان چرخش
onMounted(() => {
  if (!wheelRef.value) return;

  wheelRef.value.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;
    if (!isSpinning.value) return;

    isSpinning.value = false;
    if (rafId) cancelAnimationFrame(rafId);

    const finalIdx = indexFromRotation(currentRotation.value);
    const winItem = items.value[finalIdx];
    winner.value = winItem;

    playSound("win");

    Swal.fire({
      title: "تبریک!",
      html: `<div style="font-size:18px">شما برنده <b style="font-size:22px">${winItem.labelText}</b> شدید</div>`,
      icon: "success",
      background: "#071824",
      color: "#fff",
      confirmButtonColor: "#D9A63F",
      confirmButtonText: "باشه"
    });
  });
});

function getBulbStyle(i, total) {
  const angle = (i * (360 / total));
  const r = 46; // درصد
  return {
    top: `${50 - r * Math.cos(degToRad(angle))}%`,
    left: `${50 + r * Math.sin(degToRad(angle))}%`,
    transform: `translate(-50%, -50%)`,
  };
}
</script>

<style scoped>
.font-dana { font-family: Dana, system-ui, sans-serif; }

.text-gold { color: #f6c34a; text-shadow: 0 0 18px rgba(246,195,74,0.25); }

/* اندازه کلی مثل عکس */
.wheel-outer{
  width: 360px;
  height: 360px;
  border-radius: 9999px;
  background: #ffffff;
  padding: 8px;
  box-shadow: 0 25px 60px -25px rgba(0,0,0,0.9);
}

.wheel-ring{
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  position: relative;
  padding: 18px;
  background: linear-gradient(180deg, #ffd36a 0%, #f1b93a 40%, #d5961e 100%);
  box-shadow:
    inset 0 0 0 2px rgba(255,255,255,0.25),
    inset 0 -10px 18px rgba(0,0,0,0.18);
}

.wheel-inner-border{
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: #ffffff;
  padding: 7px;
  position: relative;
  box-shadow: inset 0 0 0 2px rgba(0,0,0,0.06);
}

.wheel-face{
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 0 2px rgba(17,24,39,0.15);
  will-change: transform;
}

.center-pointer{
  position: absolute;
  left: 50%;
  top: 50%;
  width: 62px;
  height: 62px;
  transform: translate(-50%, -50%);
  z-index: 30;
  filter: drop-shadow(0 10px 10px rgba(0,0,0,0.45));
}

/* bulbs مثل عکس */
.bulb{
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: radial-gradient(circle at 30% 30%, #fff6cf 0%, #ffd36a 38%, #d5961e 78%, #b7770b 100%);
  box-shadow:
    inset 0 0 0 3px rgba(255,255,255,0.25),
    0 0 0 4px rgba(255,214,102,0.12);
  opacity: 0.9;
}

.bulb-blink{
  animation: bulbBlink 0.35s infinite alternate;
}

@keyframes bulbBlink{
  from { filter: brightness(0.95); opacity: 0.75; }
  to   { filter: brightness(1.25); opacity: 1; box-shadow: 0 0 18px rgba(255,214,102,0.55); }
}

/* نتیجه */
.pop-enter-active { animation: pop-in 0.25s ease-out; }
.pop-leave-active { animation: pop-out 0.2s ease-in; }
@keyframes pop-in { from { opacity: 0; transform: translateY(6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes pop-out { to { opacity: 0; transform: translateY(-6px) scale(0.98); } }
</style>
