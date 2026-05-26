<template>
  <div class="flex min-h-screen bg-base text-white mx-auto max-w-4xl">
    <div class="flex-1 mt-4">
      <header
        class="rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 mb-6"
      >
        <h1 class="text-2xl font-extrabold">مدیریت بنرها</h1>
      </header>

      <!-- ADD NEW BANNER FORM -->
      <div class="glass p-6 rounded-2xl ring-1 ring-white/10 mb-8">
        <h2 class="text-lg font-bold mb-4">افزودن بنر جدید</h2>

        <form
          @submit.prevent="submitBanner"
          enctype="multipart/form-data"
          class="space-y-4"
        >
          <div>
            <label class="text-sm text-white/70 mb-1 block">عنوان بنر</label>
            <input
              v-model="bannerForm.title"
              class="w-full p-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-accent/60"
            />
          </div>

          <div>
            <label class="text-sm text-white/70 mb-1 block">لینک بنر (href)</label>
            <input
              v-model="bannerForm.href"
              class="w-full p-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-accent/60"
            />
          </div>

          <div>
            <label class="text-sm text-white/70 mb-1 block">تصویر بنر</label>
            <input
              name="img"
              type="file"
              @change="onBannerImg"
              accept="image/*"
              class="block text-sm file:bg-accent file:text-[#0a1f14] file:px-3 file:py-2 file:rounded-xl file:ring-1 file:ring-white/10"
            />
          </div>

          <div
            v-if="preview"
            class="w-40 h-24 rounded-xl overflow-hidden ring-1 ring-white/20"
          >
            <img :src="preview" class="w-full h-full object-cover" />
          </div>

          <button
            :disabled="loading"
            type="submit"
            class="px-5 py-2 rounded-xl bg-[#6EE7B7] text-[#062E26] font-semibold hover:bg-[#5AD3A5] transition disabled:opacity-60"
          >
            {{ loading ? "در حال ذخیره…" : "ثبت بنر" }}
          </button>
        </form>
      </div>

      <!-- BANNER LIST -->
      <div class="glass p-6 rounded-2xl ring-1 ring-white/10">
        <h2 class="text-lg font-bold mb-4">لیست بنرها</h2>

        <div v-if="banners.length === 0" class="text-white/60 text-sm">
          هیچ بنری ثبت نشده است.
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-else>
          <div
            v-for="b in banners"
            :key="b._id"
            class="bg-[#1a2220] rounded-xl p-4 ring-1 ring-white/10 flex flex-col gap-3"
          >
            <img :src="b.img" class="w-full h-32 object-cover rounded-lg" />

            <div>
              <p class="font-bold">{{ b.title }}</p>
              <p class="text-xs text-white/60">{{ b.href }}</p>
            </div>

            <button
              @click="removeBanner(b._id)"
              class="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import Sidebar from '@/components/admin/SidebarAdmin.vue'
import axios from "axios";
import Swal from "sweetalert2";
import { ref, reactive, onMounted } from "vue";

const url = process.env.VUE_APP_API_URL;

const banners = ref([]);
const loading = ref(false);
const bannerForm = reactive({
  title: "",
  href: "",
});
const bannerFile = ref(null);
const preview = ref("");

// Fetch banners
async function fetchBanners() {
  const res = await axios.get(`${url}/admin/getbanner`);
  banners.value = res.data.data;
}

// Handle file
function onBannerImg(e) {
  const f = e.target.files?.[0];
  bannerFile.value = f;
  if (f) preview.value = URL.createObjectURL(f);
}

// Submit new banner
async function submitBanner() {
  try {
    loading.value = true;

    const fd = new FormData();
    fd.append("title", bannerForm.title);
    fd.append("href", bannerForm.href);
    if (bannerFile.value) fd.append("img", bannerFile.value);

    const res = await axios.post(`${url}/admin/addbaner`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    Swal.fire({ icon: "success", text: res.data.msg });

    bannerForm.title = "";
    bannerForm.href = "";
    preview.value = "";
    bannerFile.value = null;

    await fetchBanners();
  } catch (err) {
    Swal.fire({ icon: "error", text: "خطا در ثبت بنر" });
  } finally {
    loading.value = false;
  }
}

// Remove banner
async function removeBanner(id) {
  Swal.fire({
    icon: "warning",
    text: "بنر حذف شود؟",
    showCancelButton: true,
    confirmButtonText: "بله حذف کن",
    cancelButtonText: "انصراف",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await axios.delete(`${url}/admin/removebanner/${id}`);
      Swal.fire({ icon: "success", text: "بنر حذف شد" });
      await fetchBanners();
    }
  });
}

onMounted(fetchBanners);
</script>

<style scoped>
.bg-base {
  background-color: #12181b;
}
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
}
</style>
