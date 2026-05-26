<template>
  <div v-if="banners.length" class="relative w-full rounded-2xl overflow-hidden ring-1 ring-white/10">
    <div class="relative h-52 sm:h-72">
      <transition name="fade">
        <div
          v-if="currentBanner"
          :key="currentBanner._id"
          class="absolute inset-0"
        >
          <a v-if="currentBanner.href" :href="currentBanner.href" target="_blank">
            <img :src="currentBanner.img" class="w-full h-full object-cover" />
          </a>
          <img v-else :src="currentBanner.img" class="w-full h-full object-cover" />
        </div>
      </transition>

      <button
        @click="prevSlide"
        class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white px-3 py-1 rounded-full backdrop-blur-md text-xl"
      >
        › 
      </button>
      <button
        @click="nextSlide"
        class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white px-3 py-1 rounded-full backdrop-blur-md text-xl"
      >
         ‹
      </button>

      <div class="absolute bottom-3 w-full flex items-center justify-center gap-2">
        <span
          v-for="(b, i) in banners"
          :key="b._id"
          @click="goTo(i)"
          class="w-2.5 h-2.5 rounded-full cursor-pointer transition"
          :class="i === currentIndex ? 'bg-white' : 'bg-white/40'"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const url = process.env.VUE_APP_API_URL;

const banners = ref([]);
const currentIndex = ref(0);
let timer = null;

const currentBanner = computed(() => {
  if (!banners.value.length) return null;
  return banners.value[currentIndex.value];
});

async function fetchBanners() {
  try {
    const res = await axios.get(`${url}/admin/getbanner`);
    banners.value = res.data.data || [];
    
    // If no banners from API, use default banners
    if (banners.value.length === 0) {
      banners.value = [
        {
          _id: 'default-1',
          img: 'https://images.unsplash.com/photo-1610375951375-6a38d9b965c9?w=800&h=400&fit=crop',
          href: '/user/trading-bot'
        },
        {
          _id: 'default-2', 
          img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
          href: '/user/gold'
        },
        {
          _id: 'default-3',
          img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
          href: '/user/silver'
        }
      ];
    }
    
    if (banners.value.length > 1) startAuto();
  } catch (e) {
    console.error(e);
    // On error, use default banners
    banners.value = [
      {
        _id: 'default-1',
        img: 'https://images.unsplash.com/photo-1610375951375-6a38d9b965c9?w=800&h=400&fit=crop',
        href: '/user/trading-bot'
      },
      {
        _id: 'default-2', 
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        href: '/user/gold'
      },
      {
        _id: 'default-3',
        img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
        href: '/user/silver'
      }
    ];
    if (banners.value.length > 1) startAuto();
  }
}

function nextSlide() {
  if (!banners.value.length) return;
  currentIndex.value = (currentIndex.value + 1) % banners.value.length;
}

function prevSlide() {
  if (!banners.value.length) return;
  currentIndex.value =
    currentIndex.value === 0
      ? banners.value.length - 1
      : currentIndex.value - 1;
}

function goTo(i) {
  if (!banners.value.length) return;
  currentIndex.value = i;
}

function startAuto() {
  stopAuto();
  timer = setInterval(() => {
    nextSlide();
  }, 4000);
}

function stopAuto() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

onMounted(fetchBanners);
onBeforeUnmount(stopAuto);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
