<template>
  <div dir="rtl" class="min-h-screen bg-[#0d1117] pb-32 text-white">
    <!-- Header (Mobile Only) -->
    <header class="p-4 flex items-center justify-between sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5 lg:hidden">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <h1 class="text-sm font-bold">دعوت از دوستان</h1>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 py-6">
      <div v-if="loaded && user" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left Column: Invite Info & QR -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Hero Section -->
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div class="relative bg-[#161b22] rounded-[30px] p-8 border border-white/5 overflow-hidden">
               <div class="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-right">
                  <div class="w-24 h-24 bg-yellow-400/10 rounded-3xl flex items-center justify-center border border-yellow-400/20 shadow-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl font-black text-white">دوستانت رو دعوت کن، پاداش بگیر!</h2>
                    <p class="text-white/50 text-sm mt-2 leading-relaxed">
                      با معرفی مکسـی گلد به دوستان خود، در سود معاملات آن‌ها شریک شوید و پاداش‌های ویژه دریافت کنید.
                    </p>
                  </div>
               </div>
               
               <!-- Invite Link Box -->
               <div class="mt-8 p-4 rounded-2xl bg-[#0d1117]/50 border border-white/5 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-white/40">لینک اختصاصی شما</span>
                    <span class="text-[10px] text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded-lg">کد: {{ user.refcode }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <input 
                      type="text" 
                      :value="inviteLink" 
                      readonly 
                      class="flex-1 bg-transparent border-none focus:ring-0 text-sm font-mono text-white/80 ltr"
                    />
                    <button @click="copyLink" class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-xl text-xs transition-all active:scale-95 text-center">کپی</button>
                  </div>
               </div>
            </div>
          </div>

          <!-- Referral Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div class="bg-[#161b22] rounded-[24px] p-5 border border-white/5 text-center">
              <span class="text-white/40 text-[10px] block mb-2">تعداد دعوت‌ها</span>
              <span class="text-xl font-black">{{ user.invitation || 0 }}</span>
              <span class="text-[10px] text-white/20 block mt-1">نفر</span>
            </div>
            <div class="bg-[#161b22] rounded-[24px] p-5 border border-white/5 text-center">
              <span class="text-white/40 text-[10px] block mb-2">پاداش کل</span>
              <span class="text-xl font-black text-emerald-400">{{ formatMoney(user.gift || 0) }}</span>
              <span class="text-[10px] text-emerald-400/40 block mt-1">تومان</span>
            </div>
            <div class="bg-[#161b22] rounded-[24px] p-5 border border-white/5 text-center col-span-2 sm:col-span-1">
              <span class="text-white/40 text-[10px] block mb-2">کد معرف فعال</span>
              <span class="text-xl font-black text-yellow-500 ltr">{{ user.refcode || '—' }}</span>
              <span class="text-[10px] text-white/20 block mt-1">شناسه یکتا</span>
            </div>
          </div>

          <!-- Rules/How it works -->
          <div class="bg-[#161b22] rounded-[30px] p-6 border border-white/5">
             <h3 class="text-sm font-bold flex items-center gap-2 mb-6">
                <span class="w-1 h-4 bg-yellow-500 rounded-full"></span>
                قوانین و نحوه دریافت پاداش
             </h3>
             <div class="space-y-4">
                <div v-for="(rule, idx) in rules" :key="idx" class="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div class="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-500 shrink-0">
                      <span class="font-bold">{{ idx + 1 }}</span>
                   </div>
                   <p class="text-xs text-white/70 leading-6">{{ rule }}</p>
                </div>
             </div>
          </div>
        </div>

        <!-- Right Column: Share & QR -->
        <div class="lg:col-span-5 space-y-6">
           <!-- QR Code Card -->
           <div class="bg-[#161b22] rounded-[30px] p-8 border border-white/5 text-center">
              <h3 class="text-sm font-bold mb-6">اسکن کد برای ثبت‌نام سریع</h3>
              <div class="inline-block p-4 bg-white rounded-3xl shadow-2xl">
                 <img :src="qrSrc" alt="QR Code" class="w-48 h-48" />
              </div>
              <p class="text-[10px] text-white/40 mt-6 leading-relaxed">
                 دوستان شما می‌توانند با اسکن این کد مستقیماً به صفحه ثبت‌نام هدایت شده و کد معرف شما به صورت خودکار برای آن‌ها ثبت خواهد شد.
              </p>
           </div>

           <!-- Social Share Buttons -->
           <div class="bg-[#161b22] rounded-[30px] p-6 border border-white/5">
              <h3 class="text-sm font-bold mb-6">اشتراک‌گذاری در شبکه‌های اجتماعی</h3>
              <div class="grid grid-cols-2 gap-4">
                 <a :href="`https://wa.me/?text=${encodedShareText}`" target="_blank" class="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-emerald-400 group">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <i class="fa-brands fa-whatsapp text-xl"></i>
                    </div>
                    <span class="text-xs font-bold">واتس‌اپ</span>
                 </a>
                 <a :href="`https://t.me/share/url?url=${encodedInvite}&text=${encodedCaption}`" target="_blank" class="flex items-center gap-3 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-all text-sky-400 group">
                    <div class="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                       <i class="fa-brands fa-telegram text-xl"></i>
                    </div>
                    <span class="text-xs font-bold">تلگرام</span>
                 </a>
              </div>
              <button @click="nativeShare" class="w-full mt-4 flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                 </svg>
                 <span class="text-xs font-bold">سایر روش‌ها</span>
              </button>
           </div>
        </div>

      </div>

      <!-- Loading State -->
      <div v-else class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
        <p class="text-white/40 text-sm">در حال دریافت اطلاعات دعوت...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const url = process.env.VUE_APP_API_URL || '';
const user = ref(null);
const loaded = ref(false);

const rules = [
  'هر کاربری که با لینک شما ثبت‌نام کند، به عنوان زیرمجموعه شما ثبت می‌شود.',
  'در زمان انجام اولین معامله توسط دوست شما، هدیه نقدی به کیف پول شما واریز خواهد شد.',
  'علاوه بر هدیه نقدی، درصدی از کارمزد معاملات زیرمجموعه‌های شما به صورت مادام‌العمر به شما تعلق می‌گیرد.',
  'محدودیتی در تعداد افراد دعوت شده وجود ندارد.'
];

const inviteLink = computed(() => {
  const code = user.value?.refcode || '';
  const base = window.location?.origin || '';
  return `${base}/register?ref=${code}`;
});

const encodedInvite = computed(() => encodeURIComponent(inviteLink.value));
const caption = computed(() => 'ساده‌ترین راه برای سرمایه‌گذاری روی طلا! در مکسـی گلد ثبت‌نام کن و هدیه بگیر ✨');
const encodedCaption = computed(() => encodeURIComponent(caption.value));
const encodedShareText = computed(() => encodeURIComponent(`${caption.value}\n${inviteLink.value}`));
const qrSrc = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedInvite.value}`);

const loadProfile = async () => {
  try {
    const { data } = await axios.get(`${url}/user/profile`);
    user.value = data?.user || null;
  } catch (err) {
    console.error('Profile load error:', err);
  } finally {
    loaded.value = true;
  }
};

const formatMoney = (v) => new Intl.NumberFormat('fa-IR').format(Math.round(v));

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink.value).then(() => {
    Swal.fire({
      icon: 'success',
      title: 'کپی شد!',
      text: 'لینک اختصاصی شما با موفقیت کپی شد.',
      confirmButtonText: 'تایید',
      timer: 2000,
      timerProgressBar: true,
      background: '#161b22',
      color: '#fff'
    });
  });
};

const nativeShare = () => {
  if (navigator.share) {
    navigator.share({
      title: 'دعوت به مکسـی گلد',
      text: caption.value,
      url: inviteLink.value
    }).catch(() => {});
  } else {
    copyLink();
  }
};

onMounted(loadProfile);
</script>

<style scoped>
.ltr { direction: ltr; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.max-w-5xl > div > div {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
