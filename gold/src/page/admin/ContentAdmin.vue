<template>
  <div class="flex min-h-screen bg-base text-white font-sans">
    <Sidebar />

    <div class="flex-1 flex flex-col">
      <main class="flex-1 overflow-auto">
        <header class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
                 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 mb-3">
          <h1 class="text-lg md:text-2xl font-extrabold">مدیریت محتوای سایت</h1>
          <p class="text-sm text-white/60 mt-1">متن‌های صفحه اصلی، مزایا و سوالات متداول را ویرایش کنید</p>
        </header>

        <div class="mx-4 md:mx-6 space-y-6 pb-10">

          <!-- بخش هیرو -->
          <section class="glass p-6 rounded-2xl ring-1 ring-white/10">
            <h2 class="text-base font-bold text-amber-300 mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              بخش اصلی (Hero)
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-white/70 mb-1">تگ بالایی (chip)</label>
                <input v-model="form.hero_chip" type="text" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-white/70 mb-1">عنوان اصلی</label>
                <input v-model="form.hero_title" type="text" class="input-field" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-white/70 mb-1">بخش طلایی عنوان</label>
                <input v-model="form.hero_title_highlight" type="text" class="input-field" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-white/70 mb-1">توضیحات</label>
                <textarea v-model="form.hero_desc" rows="3" class="input-field"></textarea>
              </div>
              <div>
                <label class="block text-sm text-white/70 mb-1">دکمه اصلی</label>
                <input v-model="form.hero_btn_primary" type="text" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-white/70 mb-1">دکمه ثانوی</label>
                <input v-model="form.hero_btn_secondary" type="text" class="input-field" />
              </div>
            </div>

            <!-- متریک‌ها -->
            <div class="mt-4">
              <label class="block text-sm text-white/70 mb-2">آمارهای نمایشی (۳ عدد)</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div v-for="(m, i) in form.metrics" :key="i" class="bg-white/5 rounded-xl p-3 ring-1 ring-white/10 space-y-2">
                  <input v-model="m.value" type="text" placeholder="مقدار (مثلاً: 24/7)" class="input-field text-sm" />
                  <input v-model="m.label" type="text" placeholder="توضیح" class="input-field text-sm" />
                </div>
              </div>
            </div>
          </section>

          <!-- بخش مزایا -->
          <section class="glass p-6 rounded-2xl ring-1 ring-white/10">
            <h2 class="text-base font-bold text-amber-300 mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              بخش مزایا (Features)
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm text-white/70 mb-1">تگ بخش مزایا</label>
                <input v-model="form.features_chip" type="text" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-white/70 mb-1">عنوان بخش مزایا</label>
                <input v-model="form.features_title" type="text" class="input-field" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="(f, i) in form.features" :key="i" class="bg-white/5 rounded-xl p-3 ring-1 ring-white/10 space-y-2">
                <div class="text-xs text-white/40 mb-1">ویژگی {{ i + 1 }}</div>
                <input v-model="f.title" type="text" placeholder="عنوان ویژگی" class="input-field text-sm" />
                <textarea v-model="f.text" rows="2" placeholder="توضیح" class="input-field text-sm"></textarea>
              </div>
            </div>
          </section>

          <!-- بخش فروشگاه -->
          <section class="glass p-6 rounded-2xl ring-1 ring-white/10">
            <h2 class="text-base font-bold text-amber-300 mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              بخش فروشگاه
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-white/70 mb-1">عنوان فروشگاه</label>
                <input v-model="form.shop_title" type="text" class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-white/70 mb-1">توضیح فروشگاه</label>
                <input v-model="form.shop_desc" type="text" class="input-field" />
              </div>
            </div>
          </section>

          <!-- سوالات متداول -->
          <section class="glass p-6 rounded-2xl ring-1 ring-white/10">
            <h2 class="text-base font-bold text-amber-300 mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              سوالات متداول (FAQ)
            </h2>
            <div class="mb-3">
              <label class="block text-sm text-white/70 mb-1">عنوان بخش FAQ</label>
              <input v-model="form.faq_title" type="text" class="input-field" />
            </div>
            <div class="space-y-3">
              <div v-for="(faq, i) in form.faqs" :key="i" class="bg-white/5 rounded-xl p-3 ring-1 ring-white/10">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-white/40">سوال {{ i + 1 }}</span>
                  <button @click="removeFaq(i)" class="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded-lg hover:bg-red-400/10 transition">حذف</button>
                </div>
                <input v-model="faq.question" type="text" placeholder="سوال" class="input-field text-sm mb-2" />
                <textarea v-model="faq.answer" rows="2" placeholder="جواب" class="input-field text-sm"></textarea>
              </div>
            </div>
            <button @click="addFaq" class="mt-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-sm transition">
              + افزودن سوال جدید
            </button>
          </section>

          <!-- دکمه ذخیره -->
          <div class="flex items-center justify-between gap-3 pb-4">
            <span v-if="saved" class="text-sm text-emerald-400">✓ تغییرات با موفقیت ذخیره شد</span>
            <div class="flex gap-3 mr-auto">
              <button @click="fetchContent" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition text-sm">بازگردانی</button>
              <button @click="save" :disabled="loading" class="px-6 py-2 rounded-xl bg-[#6EE7B7] text-[#062E26] font-semibold hover:bg-[#5AD3A5] transition disabled:opacity-60">
                {{ loading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Sidebar from '@/components/admin/SidebarAdmin.vue'

const url = process.env.VUE_APP_API_URL || ''
const loading = ref(false)
const saved = ref(false)

const defaultForm = {
  hero_chip: '',
  hero_title: '',
  hero_title_highlight: '',
  hero_desc: '',
  hero_btn_primary: '',
  hero_btn_secondary: '',
  metrics: [
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' }
  ],
  features_chip: '',
  features_title: '',
  features: [
    { title: '', text: '' },
    { title: '', text: '' },
    { title: '', text: '' },
    { title: '', text: '' }
  ],
  shop_title: '',
  shop_desc: '',
  faq_title: '',
  faqs: []
}

const form = reactive(JSON.parse(JSON.stringify(defaultForm)))

async function fetchContent() {
  try {
    const res = await axios.get(`${url}/admin/site-content`)
    if (res.data.success) {
      const d = res.data.data
      Object.assign(form, {
        hero_chip: d.hero_chip || '',
        hero_title: d.hero_title || '',
        hero_title_highlight: d.hero_title_highlight || '',
        hero_desc: d.hero_desc || '',
        hero_btn_primary: d.hero_btn_primary || '',
        hero_btn_secondary: d.hero_btn_secondary || '',
        metrics: d.metrics?.length ? d.metrics.map(m => ({ value: m.value || '', label: m.label || '' })) : defaultForm.metrics,
        features_chip: d.features_chip || '',
        features_title: d.features_title || '',
        features: d.features?.length ? d.features.map(f => ({ title: f.title || '', text: f.text || '' })) : defaultForm.features,
        shop_title: d.shop_title || '',
        shop_desc: d.shop_desc || '',
        faq_title: d.faq_title || '',
        faqs: d.faqs?.length ? d.faqs.map(f => ({ question: f.question || '', answer: f.answer || '' })) : []
      })
    }
  } catch (err) {
    console.error(err)
  }
}

function addFaq() {
  form.faqs.push({ question: '', answer: '' })
}

function removeFaq(i) {
  form.faqs.splice(i, 1)
}

async function save() {
  loading.value = true
  saved.value = false
  try {
    const res = await axios.put(`${url}/admin/site-content`, form)
    if (res.data.success) {
      saved.value = true
      setTimeout(() => { saved.value = false }, 4000)
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: res.data.message, showConfirmButton: false, timer: 2500 })
    }
  } catch (err) {
    const msg = err?.response?.data?.message || 'خطا در ذخیره سازی'
    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: msg, showConfirmButton: false, timer: 3000 })
  } finally {
    loading.value = false
  }
}

onMounted(fetchContent)
</script>

<style scoped>
.bg-base { background-color: #12181b; }
.glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.input-field {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border-radius: 0.75rem;
  background: rgba(255,255,255,0.05);
  color: white;
  outline: none;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
  transition: box-shadow 0.2s;
  font-size: 0.875rem;
}
.input-field:focus { box-shadow: 0 0 0 2px rgba(110,231,183,0.4); }
textarea.input-field { resize: vertical; }
</style>
