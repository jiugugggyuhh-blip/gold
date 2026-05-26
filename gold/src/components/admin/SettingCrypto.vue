<template>
  <div class="min-h-screen p-2 text-white">
    
    <!-- Header -->
    <div class="max-w-4xl mx-auto mb-6 rounded-2xl bg-gradient-to-br 
      from-[#1a2220]/80 to-[#12181b]/80 backdrop-blur-2xl 
      ring-1 ring-[#334D44]/40 p-6 shadow-2xl flex items-center justify-between">

      <div>
        <h1 class="text-xl font-extrabold ">تنظیمات ارز دیجیتال</h1>
        <p class="text-sm text-emerald-200/70 mt-1">مدیریت شبکه‌ها و آدرس‌های واریز</p>
      </div>

      <button @click="showCreate = true"
        class="px-5 py-3 rounded-xl bg-emerald-300 text-[#052016] font-bold shadow-xl shadow-emerald-500/20 
        ring-1 ring-emerald-200 hover:brightness-95 transition-all">
        افزودن ارز جدید +
      </button>
    </div>

    <!-- List -->
    <div class="max-w-4xl mx-auto space-y-4">
      <div v-if="loading" class="text-center text-emerald-200 py-8">در حال بارگذاری…</div>

      <div
        v-for="c in items"
        :key="c._id"
        class="rounded-2xl p-5 bg-gradient-to-br from-[#1a2220]/60 to-[#12181b]/60 backdrop-blur-2xl
        ring-1 ring-emerald-400/20 shadow-xl shadow-emerald-500/10 flex items-center justify-between">

        <div>
          <div class="text-sm text-emerald-200/70">ارز</div>
          <div class="text-xl font-extrabold mb-1">{{ c.item }}</div>

          <div class="text-sm text-emerald-200/70">شبکه</div>
          <div class="font-semibold">{{ c.network }}</div>

          <div class="text-sm text-emerald-200/70 mt-2">آدرس</div>
          <div class="text-sm break-all">{{ c.address }}</div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="edit(c)"
            class="px-4 py-2 rounded-xl bg-emerald-300 text-[#052016] font-bold ring-1 ring-emerald-200 shadow-md">
            ویرایش
          </button>

          <button @click="remove(c._id)"
            class="px-4 py-2 rounded-xl bg-red-500/80 text-white font-bold ring-1 ring-red-300 shadow-md">
            حذف
          </button>
        </div>
      </div>
    </div>

    <!-- Modal (Create / Edit) -->
    <transition name="fade">
      <div
        v-if="showCreate || editData"
        class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-5 z-50">

        <div class="w-full max-w-md rounded-2xl bg-gradient-to-br 
          from-[#1a2220] to-[#12181b] p-6 ring-1 ring-emerald-400/20 shadow-2xl">

          <h2 class="text-lg font-bold mb-5 text-emerald-300">
            {{ editData ? 'ویرایش ارز' : 'افزودن ارز جدید' }}
          </h2>

      <form @submit.prevent="submit">

  <!-- item -->
  <div class="w-full mb-4">
    <label class="block text-xs font-bold text-emerald-200/80 mb-2">نام ارز</label>
    <div
      class="relative rounded-xl bg-[#0e1713]/40 backdrop-blur-xl
             ring-1 ring-emerald-400/20 transition-all overflow-hidden
             focus-within:ring-2 focus-within:ring-emerald-400/60
             focus-within:shadow-lg focus-within:shadow-emerald-500/20">
      <input
        v-model="form.item"
        placeholder="مثلاً USDT"
        class="w-full bg-transparent text-white px-4 py-3 text-sm placeholder:text-white/30 outline-none"
      />
    </div>
  </div>

  <!-- network -->
  <div class="w-full mb-4">
    <label class="block text-xs font-bold text-emerald-200/80 mb-2">شبکه</label>
    <div
      class="relative rounded-xl bg-[#0e1713]/40 backdrop-blur-xl
             ring-1 ring-emerald-400/20 transition-all overflow-hidden
             focus-within:ring-2 focus-within:ring-emerald-400/60
             focus-within:shadow-lg focus-within:shadow-emerald-500/20">
      <input
        v-model="form.network"
        placeholder="مثلاً TRC20"
        class="w-full bg-transparent text-white px-4 py-3 text-sm placeholder:text-white/30 outline-none"
      />
    </div>
  </div>

  <!-- address -->
  <div class="w-full mb-6">
    <label class="block text-xs font-bold text-emerald-200/80 mb-2">آدرس واریز</label>
    <div
      class="relative rounded-xl bg-[#0e1713]/40 backdrop-blur-xl
             ring-1 ring-emerald-400/20 transition-all overflow-hidden
             focus-within:ring-2 focus-within:ring-emerald-400/60
             focus-within:shadow-lg focus-within:shadow-emerald-500/20">
      <input
        v-model="form.address"
        placeholder="آدرس مقصد…"
        class="w-full bg-transparent text-white px-4 py-3 text-sm placeholder:text-white/30 outline-none"
      />
    </div>
  </div>

  <!-- buttons -->
  <div class="flex justify-between mt-4">
    <button
      class="rounded-xl bg-emerald-300 text-[#062017] font-bold py-3 px-6
             ring-1 ring-emerald-200 shadow-xl shadow-emerald-500/20
             hover:brightness-95 transition-all">
      {{ editData ? 'ذخیره تغییرات' : 'افزودن' }}
    </button>

    <button
      @click="close"
      type="button"
      class="px-4 py-2 rounded-xl bg-white/10 text-sm ring-1 ring-white/20
             hover:bg-white/20 transition">
      انصراف
    </button>
  </div>

</form>

        </div>

      </div>
    </transition>

  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const API = process.env.VUE_APP_API_URL;
const token = localStorage.getItem("token");

const items = ref([]);
const loading = ref(true);

const showCreate = ref(false);
const editData = ref(null);

const form = ref({
  item: "",
  network: "",
  address: "",
});

function resetForm() {
  form.value = { item: "", network: "", address: "" };
}

function close() {
  showCreate.value = false;
  editData.value = null;
  resetForm();
}

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get(`${API}/admin/cryptosetting`);
    items.value = data.data;
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}

async function submit() {
  try {
    if (editData.value) {
      await axios.put(`${API}/admin/cryptosetting/${editData.value._id}`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${API}/admin/cryptosetting`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    close();
    load();
  } catch (e) {
    console.error(e);
  }
}

function edit(item) {
  editData.value = item;
  form.value = { ...item };
}

async function remove(id) {
  if (!confirm("حذف شود؟")) return;

  try {
    await axios.delete(`${API}/admin/cryptosetting/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    load();
  } catch (e) {
    console.error(e);
  }
}

onMounted(load);
</script>

<style scoped>
.mint-input {
  @apply w-full rounded-xl bg-[#0e1713]/60 text-white px-4 py-3 ring-1 
  ring-emerald-400/20 backdrop-blur-xl text-sm placeholder:text-white/30 
  focus:ring-2 focus:ring-emerald-400/60 outline-none;
}

.mint-btn {
  @apply rounded-xl bg-emerald-300 text-[#062017] font-bold py-3 
  ring-1 ring-emerald-200 shadow-xl shadow-emerald-500/20 hover:brightness-95;
}

.fade-enter-active,
.fade-leave-active {
  transition: all .25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(.95);
}
</style>
