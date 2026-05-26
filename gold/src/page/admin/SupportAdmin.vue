<template>
  <div class="flex min-h-screen bg-base text-white font-sans">
    <Sidebar />

    <div class="flex-1 flex flex-col mt-20 md:-mt-0">
      <!-- Header -->
      <header class=" mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
                 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4">
        <h1 class="text-lg md:text-2xl font-extrabold text-white">لیست تیکت‌ها</h1>
        <div class="hidden md:flex items-center gap-3">
          <div class="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <i class="fas fa-search text-white/60"></i>
            <input
              v-model="search"
              type="search"
              placeholder="جستجو..."
              class="bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0 transition w-32 md:w-auto"
            />
          </div>
          <select
            v-model.number="itemsPerPage"
            class="px-3 py-2 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#b9f1cf]/60"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </header>

      <!-- Main -->
      <main class="p-4 md:p-6 flex-1 overflow-auto">
        <div class="space-y-6">
          <div class="md:hidden flex gap-3">
            <div class="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 flex-1">
              <i class="fas fa-search text-white/60"></i>
              <input v-model="search" placeholder="جستجو..." class="bg-transparent flex-1 text-sm text-white placeholder:text-white/40 focus:outline-none" />
            </div>
            <select v-model.number="itemsPerPage" class="px-3 py-2 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-[#b9f1cf]/60">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>

          <div class="glass p-6 rounded-2xl ring-1 ring-white/10 shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white">تیکت‌ها</h2>
              <div class="text-sm text-white/70">تعداد: {{ filtered.length }}</div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-white/10 text-sm">
                <thead class="bg-white/5 text-white/60">
                  <tr>
                    <th class="px-4 py-3 text-right font-semibold">#</th>
                    <th class="px-4 py-3 text-right font-semibold">عنوان</th>
                    <th class="px-4 py-3 text-right font-semibold">دپارتمان</th>
                    <th class="px-4 py-3 text-right font-semibold">وضعیت</th>
                    <th class="px-4 py-3 text-right font-semibold">آخرین پیام</th>
                    <th class="px-4 py-3 text-right font-semibold">تاریخ</th>
                    <th class="px-4 py-3 text-right font-semibold">عملیات</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-white/10">
                  <tr v-for="(t, i) in paginated" :key="t._id" class="hover:bg-white/5 transition-colors">
                    <td class="px-4 py-3">{{ (currentPage-1)*itemsPerPage + i + 1 }}</td>
                    <td class="px-4 py-3 text-white/90 max-w-xs truncate">{{ t.title }}</td>
                    <td class="px-4 py-3 text-white/80">{{ mapCategory(t.category) }}</td>
                    <td class="px-4 py-3">
                      <span
                        :class="t.status === 'open'
                          ? 'bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-300/30'
                          : 'bg-white/5 text-white/60 ring-1 ring-white/10'"
                        class="px-2 py-1 rounded-full text-[11px] font-semibold"
                      >
                        {{ t.status === 'open' ? 'باز' : 'بسته' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-white/80 max-w-md truncate">{{ lastMessageText(t) }}</td>
                    <td class="px-4 py-3 text-white/60 whitespace-nowrap">{{ formatDate(t.lastdate || t.date) }}</td>
                    <td class="px-4 py-3 flex gap-2 justify-end">
                      <button
                        @click="goDetail(t._id)"
                        class="px-3 py-1.5 rounded-xl bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95 font-semibold transition"
                      >
                        نمایش
                      </button>
                      <button
                        @click="toggleStatus(t._id)"
                        :disabled="updating === t._id"
                        class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white font-semibold transition disabled:opacity-50"
                      >
                        {{ updating === t._id ? '...' : 'تغییر وضعیت' }}
                      </button>
                    </td>
                  </tr>

                  <tr v-if="filtered.length === 0">
                    <td colspan="7" class="p-6 text-center text-white/60">تیکتی یافت نشد.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-6 flex flex-col md:flex-row justify-between items-center gap-3">
              <div class="text-sm text-white/70">
                نمایش {{ (currentPage-1)*itemsPerPage + 1 }} تا {{ Math.min(currentPage*itemsPerPage, filtered.length) }} از {{ filtered.length }}
              </div>

              <div class="flex items-center gap-2">
                <button @click="changePage(currentPage-1)" :disabled="currentPage===1" class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 disabled:opacity-50">قبلی</button>
                <button
                  v-for="p in pagesToShow"
                  :key="p"
                  @click="changePage(p)"
                  :class="[
                    'px-3 py-1.5 rounded-xl ring-1 ring-white/10 transition',
                    currentPage===p ? 'bg-[#b9f1cf] text-[#0a1f14] font-bold' : 'bg-white/5 hover:bg-white/10 text-white'
                  ]"
                >
                  {{ p }}
                </button>
                <button @click="changePage(currentPage+1)" :disabled="currentPage===totalPages" class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 disabled:opacity-50">بعدی</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/admin/SidebarAdmin.vue'
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const url = process.env.VUE_APP_API_URL || ''
const router = useRouter()
const tickets = ref([])
const isLoading = ref(true)
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const updating = ref(null)

function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function mapCategory(c) {
  const map = { support: 'پشتیبانی', sales: 'فروش', technical: 'فنی', billing: 'مالی', orders: 'سفارشات' }
  return map[c] || c || '-'
}

function lastMessageText(t) {
  const arr = t.message || t.masssge || []
  if (!arr || !arr.length) return '-'
  return arr[arr.length - 1]?.text || '-'
}

async function load() {
  isLoading.value = true
  try {
    const res = await axios.get(`${url}/admin/ticket`)
    tickets.value = res.data?.data || []
  } catch {
    tickets.value = []
  } finally {
    isLoading.value = false
  }
}

function goDetail(id) {
  if (!id) return
  router.push({ path: `/admin/supportmsg/${id}` })
}

async function toggleStatus(id) {
  if (!id) return
  updating.value = id
  try {
    await axios.get(`${url}/admin/statustick/${id}`)
    await load()
  } catch {
    console.log("خطا")
  } finally {
    updating.value = null
  }
}

const filtered = computed(() => {
  const s = (search.value || '').trim().toLowerCase()
  if (!s) return tickets.value
  return tickets.value.filter(t => {
    const last = (t.message || t.masssge || []).map(m => m.text).join(' ')
    const combined = `${t.title || ''} ${t.category || ''} ${t.status || ''} ${t.uuid || ''} ${last} ${formatDate(t.date)}`.toLowerCase()
    return combined.includes(s)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / itemsPerPage.value)))
const paginated = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filtered.value.slice(start, start + itemsPerPage.value)
})

const pagesToShow = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  const delta = 2
  const pages = []
  const start = Math.max(1, cur - delta)
  const end = Math.min(total, cur + delta)
  for (let i = start; i <= end; i++) pages.push(i)
  if (pages[0] !== 1) pages.unshift(1)
  if (pages[pages.length - 1] !== total) pages.push(total)
  return pages
})

function changePage(p) {
  if (p < 1) p = 1
  if (p > totalPages.value) p = totalPages.value
  currentPage.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(load)
</script>

<style scoped>
.bg-base { background: #12181b; }
.glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
button:focus, input:focus, select:focus { outline: none; box-shadow: 0 0 0 3px rgba(185,241,207,0.25); }
</style>
