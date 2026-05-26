<template>
  <div dir="rtl" class="min-h-screen p-2 text-white crypto-shell">
    <div class="max-w-7xl mx-auto mb-6 glass-head p-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-extrabold">واریز ارز دیجیتال</h2>
        <p class="text-sm text-white/65 mt-1">انتخاب شبکه، ثبت TXID و ارسال رسید</p>
      </div>
      <router-link to="/user/wallet" class="head-chip">بازگشت به کیف پول تومانی</router-link>
    </div>

    <div class="max-w-7xl mx-auto glass-box p-6">
      <div class="mb-4">
        <label class="block text-xs font-bold text-white/80 mb-2">انتخاب ارز</label>
        <div class="select-shell">
          <select v-model="selectedId" @change="updateSelected" class="w-full bg-transparent text-white px-4 py-3 text-sm outline-none">
            <option disabled value="">انتخاب ارز...</option>
            <option v-for="c in cryptos" :key="c._id" :value="c._id">{{ c.item }} — {{ c.network }}</option>
          </select>
        </div>
      </div>

      <div v-if="selectedItem" class="mb-5">
        <div class="text-xs mb-2 text-white/65">آدرس واریز</div>
        <div class="glass-soft flex items-center justify-between px-4 py-3 text-sm rounded-xl">
          <span class="break-all">{{ selectedItem.address }}</span>
          <button @click="copy(selectedItem.address)" class="chip-btn">کپی</button>
        </div>
      </div>

      <div class="mb-5">
        <label class="block text-xs font-bold text-white/80 mb-2">TXID</label>
        <input v-model="form.link" placeholder="هش یا لینک تراکنش" class="wallet-input" />
      </div>

      <div class="mb-6">
        <label class="block text-xs font-bold text-white/80 mb-2">تصویر رسید</label>
        <label for="upload" class="uploader">
          <div class="text-sm">آپلود تصویر رسید</div>
        </label>
        <input id="upload" type="file" accept="image/*" class="hidden" @change="onFile" />

        <div v-if="filePreview" class="mt-3 flex items-center gap-3 rounded-xl glass-soft p-3">
          <img :src="filePreview" class="h-14 w-14 rounded-lg object-cover" />
          <button @click="clearFile" class="chip-btn">حذف</button>
        </div>
      </div>

      <button @click="submit" class="main-btn">ثبت درخواست واریز</button>
    </div>

    <div class="max-w-7xl mx-auto mt-6 mb-10">
      <h3 class="text-sm text-white/70 mb-3">واریزهای قبلی</h3>
      <div v-for="i in history" :key="i._id" class="rounded-xl glass-soft p-4 mb-3 text-sm">
        <div><b>ارز:</b> {{ i.item }}</div>
        <div><b>شبکه:</b> {{ i.network }}</div>
        <div><b>TXID:</b> {{ i.link }}</div>
        <a v-if="i.img" :href="API + i.img" target="_blank" class="text-amber-300 underline text-xs mt-2 block">مشاهده رسید</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { ref, onMounted } from "vue"

const API = process.env.VUE_APP_API_URL
const token = localStorage.getItem("token")
const cryptos = ref([])
const selectedId = ref("")
const selectedItem = ref(null)
const file = ref(null)
const filePreview = ref(null)
const form = ref({ item: "", network: "", link: "" })
const history = ref([])

async function loadCryptos() {
  const { data } = await axios.get(`${API}/admin/cryptosetting`)
  cryptos.value = data.data
}
function updateSelected() {
  selectedItem.value = cryptos.value.find(x => x._id === selectedId.value)
  form.value.item = selectedItem.value.item
  form.value.network = selectedItem.value.network
}
function copy(text) { navigator.clipboard.writeText(text) }
function onFile(e) { file.value = e.target.files[0]; if (file.value) filePreview.value = URL.createObjectURL(file.value) }
function clearFile() { file.value = null; filePreview.value = null }

async function submit() {
  const fd = new FormData()
  fd.append("item", form.value.item)
  fd.append("network", form.value.network)
  fd.append("link", form.value.link)
  if (file.value) fd.append("img", file.value)

  await axios.post(`${API}/user/wallet/crypto`, fd, { headers: { Authorization: `Bearer ${token}` } })
  form.value.link = ""
  clearFile()
  selectedId.value = ""
  selectedItem.value = null
  loadHistory()
}
async function loadHistory() {
  const { data } = await axios.get(`${API}/user/wallet/crypto`, { headers: { Authorization: `Bearer ${token}` } })
  history.value = data.items
}
onMounted(() => { loadCryptos(); loadHistory() })
</script>

<style scoped>
.glass-head,
.glass-box { border-radius: 18px; background: rgba(255,255,255,.03); border:1px solid rgba(255,206,88,.22); backdrop-filter: blur(14px); }
.glass-soft { background: rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.16); }
.head-chip { border-radius: 999px; padding: 8px 12px; font-size: 12px; background: rgba(255,206,88,.16); border:1px solid rgba(255,206,88,.33); color:#ffd47f; }
.select-shell { border-radius: 12px; background: rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.15); }
.wallet-input { width:100%; border-radius: 12px; background: rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.18); padding: 12px; color:white; }
.uploader { border-radius: 12px; border:1px dashed rgba(255,255,255,.25); background: rgba(255,255,255,.03); padding: 18px; display:flex; justify-content:center; cursor:pointer; }
.main-btn { width:100%; border-radius: 12px; padding: 12px; font-weight: 800; color:#2a1b02; background: linear-gradient(145deg, #ffd78d, #efb247); }
.chip-btn { border-radius: 10px; padding: 6px 10px; font-size: 11px; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); }
</style>
