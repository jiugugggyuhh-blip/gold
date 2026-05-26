<template>
  <div class="flex min-h-screen bg-base text-white font-sans">
    <Sidebar />

    <div class="flex-1 flex flex-col ">
      

      <main class=" flex-1 overflow-auto">
        <header class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
                 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 mb-3">
        <h1 class="text-lg md:text-2xl font-extrabold">تنظیمات سایت</h1>
      </header >
        <div class="mx-auto max-w-4xl">
          <form @submit.prevent="submit" class="glass p-6 rounded-2xl space-y-6 ring-1 ring-white/10">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-white/70 mb-2">عنوان سایت</label>
                <input v-model="form.title" type="text" class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60 placeholder:text-white/40" />
              </div>

              <div>
                <label class="block text-sm text-white/70 mb-2">زیرعنوان</label>
                <input v-model="form.subtitle" type="text" class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60 placeholder:text-white/40" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm text-white/70 mb-2">توضیحات</label>
                <textarea v-model="form.dec" rows="4" class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60 placeholder:text-white/40"></textarea>
              </div>

              <div>
                <label class="block text-sm text-white/70 mb-2">تلفن</label>
                <input v-model="form.phone" type="text" class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60" />
              </div>

              <div>
                <label class="block text-sm text-white/70 mb-2">آدرس</label>
                <input v-model="form.address" type="text" class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60" />
              </div>

              <div>
                <label class="block text-sm text-white/70 mb-2">درصد کارمزد خرید (مثلاً 1.5)</label>
                <input v-model.number="form.feebuy" type="number" step="0.01" class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60" />
              </div>

              <div>
                <label class="block text-sm text-white/70 mb-2">درصد کارمزد فروش (مثلاً 0.9)</label>
                <input v-model.number="form.feesell" type="number" step="0.01" class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm text-white/70 mb-2">هدیه (به اعضای هر دعوت به تومن)</label>
                <input v-model="form.gift" type="text" class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-white/70 mb-2">شماره کارت جهت واریز</label>
                <input v-model="form.cartNumber" type="text" class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm text-white/70 mb-2">وضعیت معامله</label>
                <select
                  class="w-full p-3 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent/60"
                  v-model="form.transactions"
                >
                  <option :value="true">روشن</option>
                  <option :value="false">خاموش</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm text-white/70 mb-2">آیکون سایت (Favicon)</label>
                <div class="flex items-center gap-4">
                  <div class="w-28 h-28 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
                    <img v-if="preview" :src="preview" alt="favicon" class="w-full h-full object-contain" />
                    <div v-else class="text-xs text-white/50 p-2 text-center">فاوآیکون فعلی</div>
                  </div>
                  <div class="flex-1">
                    <input name="favicon" ref="fileRef" @change="onFileChange" type="file" accept="image/*" class="block w-full text-sm text-white/80 file:bg-accent file:text-[#0a1f14] file:px-3 file:py-2 file:rounded-xl file:ring-1 file:ring-white/10 file:cursor-pointer" />
                    <p class="text-xs text-white/50 mt-2">اگر فایلی انتخاب نشود، آیکون فعلی باقی می‌ماند.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="text-sm text-white/70">آخرین بروزرسانی: <span class="font-semibold text-white">{{ updatedAtText }}</span></div>
              <div class="flex items-center gap-3">
                <button type="button" @click="reset" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10">ریست</button>
                <button
  :disabled="loading"
  type="submit"
  class="px-5 py-2 rounded-xl bg-[#6EE7B7] text-[#062E26] font-semibold hover:bg-[#5AD3A5] transition disabled:opacity-60"
>
  {{ loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
</button>

              </div>
            </div>

          </form>
        </div>
          <BannerAdmin/>
          <SettingCrypto/>
      </main>

      
    </div>
  
  </div>
</template>

<script setup>
import Sidebar from '@/components/admin/SidebarAdmin.vue'

import axios from 'axios'
import { ref, reactive, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import BannerAdmin from '@/components/admin/BannerAdmin.vue'
import SettingCrypto from '@/components/admin/SettingCrypto.vue'
const url = process.env.VUE_APP_API_URL || ''
const loading = ref(false)
const item = ref(null)
const preview = ref('')
const fileRef = ref(null)
const form = reactive({ id: '', title: '', subtitle: '', dec: '', phone: '', address: '', feebuy: 0, feesell: 0, gift: '', transactions: ''  , cartNumber:''})

onMounted(() => fetchSetting())

async function fetchSetting() {
  try {
    if (!url) return
    const res = await axios.get(`${url}/admin/setting`)
    item.value = res.data.data
    if (item.value) {
      form.id = item.value._id || ''
      form.title = item.value.title || ''
      form.subtitle = item.value.subtitle || ''
      form.dec = item.value.dec || ''
      form.phone = item.value.phone || ''
      form.address = item.value.address || ''
      form.feebuy = item.value.feebuy || 0
      form.feesell = item.value.feesell || 0
      form.gift = item.value.gift || ''
      form.cartNumber = item.value.cartNumber || ''
      form.transactions = item.value.transactions
      preview.value = item.value.favicon ? (item.value.favicon.startsWith('/') ? item.value.favicon : item.value.favicon) : ''
    }
  } catch (err) {
    console.error(err)
  }
}

function onFileChange(e) {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  preview.value = URL.createObjectURL(f)
}

function reset() {
  if (!item.value) return
  form.title = item.value.title || ''
  form.subtitle = item.value.subtitle || ''
  form.dec = item.value.dec || ''
  form.phone = item.value.phone || ''
  form.address = item.value.address || ''
  form.feebuy = item.value.feebuy || 0
  form.feesell = item.value.feesell || 0
  form.gift = item.value.gift || ''
  form.cartNumber = item.value.cartNumber || ''
  form.transactions = item.value.transactions || ''
  preview.value = item.value.favicon ? (item.value.favicon.startsWith('/') ? item.value.favicon : item.value.favicon) : ''
  if (fileRef.value) fileRef.value.value = null
}

const updatedAtText = computed(() => {
  if (!item.value) return '—'
  const d = item.value.updatedAt || item.value.createdAt || null
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString('fa-IR')
  } catch (e) {
    return '—'
  }
})

async function submit() {
  try {
    if (!url) return
    loading.value = true
    const fd = new FormData()
    fd.append('id', form.id)
    fd.append('title', form.title)
    fd.append('subtitle', form.subtitle)
    fd.append('dec', form.dec)
    fd.append('phone', form.phone)
    fd.append('address', form.address)
    fd.append('feebuy', String(form.feebuy))
    fd.append('feesell', String(form.feesell))
    fd.append('gift', form.gift)
    fd.append('cartNumber', form.cartNumber)
    fd.append('transactions', form.transactions)
    const fileInput = fileRef.value || document.querySelector('input[name="favicon"]')
    const file = fileInput && fileInput.files && fileInput.files[0]
    if (file) fd.append('favicon', file)

    const res = await axios.post(`${url}/admin/settingupdate`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    loading.value = false
    if (res.data && res.data.data) {
      Swal.fire({ icon: 'success', text: res.data.data })
      fetchSetting()
    } else {
      Swal.fire({ icon: 'success', text: 'تنظیمات با موفقیت ذخیره شد' })
      fetchSetting()
    }
  } catch (err) {
    loading.value = false
    const msg = err.response?.data?.error || err.response?.data?.data || err.message || 'خطا در ذخیره سازی'
    Swal.fire({ icon: 'error', text: String(msg) })
  }
}
</script>

<style scoped>
/* MintGlass tokens */
.bg-base { background-color: #12181b; }
.bg-card { background-color: #1a2220; }
.glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
:root { --accent: #b9f1cf; }
/* aliases for utility usage in classes */
.focus\:ring-accent\/60:focus { box-shadow: 0 0 0 3px rgba(185,241,207,0.6); }
.focus\:ring-accent:focus { box-shadow: 0 0 0 3px rgba(185,241,207,1); }
.bg-accent { background-color: var(--accent); }

/* Focus ring consistency */
button:focus, input:focus, select:focus, textarea:focus { outline: none; box-shadow: 0 0 0 3px rgba(185,241,207,0.25); }
</style>
