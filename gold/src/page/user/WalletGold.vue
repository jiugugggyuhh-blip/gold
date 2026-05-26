<template>
  <div dir="rtl" class="min-h-screen p-2 text-white">

    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-6 rounded-2xl bg-gradient-to-br 
      from-[#1a2220]/90 to-[#12181b]/90 ring-1 ring-[#334D44]/40 
      backdrop-blur-xl shadow-2xl p-5 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-extrabold ">واریز ارز دیجیتال</h2>
        <p class="text-sm text-emerald-200/70 mt-1">ارز مورد نظر را انتخاب کرده و رسید را ارسال کنید</p>
      </div>
    </div>

    <!-- Form -->
    <div class="max-w-7xl mx-auto rounded-2xl bg-gradient-to-br from-[#1a2220]/70 to-[#12181b]/70 
        ring-1 ring-emerald-400/20 backdrop-blur-xl p-6 shadow-2xl">

      <!-- Crypto Selector -->
      <div class="mb-4">
        <label class="block text-xs font-bold text-emerald-200/80 mb-2">ارز</label>

        <div class="relative rounded-xl bg-[#0e1713]/40 backdrop-blur-xl
             ring-1 ring-emerald-400/20 transition-all overflow-hidden
             focus-within:ring-2 focus-within:ring-emerald-400/60">
          <select
            v-model="selectedId"
            @change="updateSelected"
            class="w-full bg-transparent text-white px-4 py-3 text-sm outline-none"
          >
            <option disabled value="">انتخاب ارز…</option>
            <option v-for="c in cryptos" :key="c._id" :value="c._id">
              {{ c.item }} — {{ c.network }}
            </option>
          </select>
        </div>
      </div>

      <!-- Address -->
      <div v-if="selectedItem" class="mb-5">
        <div class="text-xs mb-2 text-emerald-200/70">آدرس واریز</div>

        <div class="flex items-center justify-between rounded-xl bg-[#0e1713]/40 backdrop-blur-xl
             ring-1 ring-emerald-400/20 px-4 py-3 text-sm">
          <span class="break-all">{{ selectedItem.address }}</span>

          <button
            @click="copy(selectedItem.address)"
            class="px-3 py-1 text-xs rounded-lg bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition">
            کپی
          </button>
        </div>
      </div>

      <!-- TXID -->
      <div class="mb-5">
        <label class="block text-xs font-bold text-emerald-200/80 mb-2">TXID</label>
        <input
          v-model="form.link"
          placeholder="هش یا لینک تراکنش…"
          class="w-full bg-[#0e1713]/40 backdrop-blur-xl rounded-xl px-4 py-3 text-sm
                 ring-1 ring-emerald-400/20 outline-none placeholder:text-white/30
                 focus:ring-2 focus:ring-emerald-400/60"
        />
      </div>

      <!-- Upload -->
      <div class="mb-6">
        <label class="block text-xs font-bold text-emerald-200/80 mb-2">تصویر رسید</label>

        <label
          for="upload"
          class="group flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400/30 bg-emerald-400/5 p-6 text-center cursor-pointer hover:bg-emerald-400/10 transition">
          <svg class="h-7 w-7 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div class="text-sm">آپلود تصویر رسید</div>
        </label>

        <input id="upload" type="file" accept="image/*" class="hidden" @change="onFile" />

        <div
          v-if="filePreview"
          class="mt-3 flex items-center gap-3 rounded-xl bg-white/5 ring-1 ring-emerald-400/20 p-3">
          <img :src="filePreview" class="h-14 w-14 rounded-lg object-cover ring-1 ring-emerald-400/20" />
          <button @click="clearFile" class="px-3 py-1 text-xs rounded-lg bg-red-500/70 hover:bg-red-500/90">
            حذف
          </button>
        </div>
      </div>

      <!-- Submit Btn -->
      <button
        @click="submit"
        class="w-full rounded-xl bg-emerald-300 text-[#052016] font-bold py-3 shadow-xl shadow-emerald-500/20 ring-1 ring-emerald-200 hover:brightness-95 transition">
        ثبت درخواست واریز
      </button>

    </div>

    <!-- History -->
    <div class="max-w-7xl mx-auto mt-6 mb-10">
      <h3 class="text-sm text-emerald-200/70 mb-3">واریزهای قبلی شما:</h3>

      <div
        v-for="i in history"
        :key="i._id"
        class="rounded-xl bg-[#1a2220]/60 backdrop-blur-xl ring-1 ring-emerald-400/20 p-4 mb-3 text-sm shadow-lg"
      >
        <div><b>ارز:</b> {{ i.item }}</div>
        <div><b>شبکه:</b> {{ i.network }}</div>
        <div><b>TXID:</b> {{ i.link }}</div>
        <a v-if="i.img" :href="API + i.img" target="_blank" class="text-emerald-300 underline text-xs mt-2 block">
          مشاهده رسید
        </a>
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

const form = ref({
  item: "",
  network: "",
  link: "",
})

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

function copy(text) {
  navigator.clipboard.writeText(text)
}

function onFile(e) {
  file.value = e.target.files[0]
  if (file.value) filePreview.value = URL.createObjectURL(file.value)
}

function clearFile() {
  file.value = null
  filePreview.value = null
}

async function submit() {
  const fd = new FormData()
  fd.append("item", form.value.item)
  fd.append("network", form.value.network)
  fd.append("link", form.value.link)
  if (file.value) fd.append("img", file.value)

  await axios.post(`${API}/user/wallet/crypto`, fd, {
    headers: { Authorization: `Bearer ${token}` },
  })

  form.value.link = ""
  clearFile()
  selectedId.value = ""
  selectedItem.value = null

  loadHistory()
}

async function loadHistory() {
  const { data } = await axios.get(`${API}/user/wallet/crypto`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  history.value = data.items
}

onMounted(() => {
  loadCryptos()
  loadHistory()
})
</script>

<style scoped></style>
