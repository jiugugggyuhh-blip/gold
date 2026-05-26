<!-- src/page/admin/NotifAdmin.vue -->
<template>
  <div class="flex min-h-screen bg-[#0f1417] text-white">
    <!-- Sidebar (MintGlass) -->
    <Sidebar />

    <!-- Main -->
    <div class="flex-1 flex flex-col mt-20 md:mt-0">
      <!-- Header -->
      <header
        class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
                 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4"
      >
        <div>
          <h1 class="text-lg md:text-2xl font-extrabold">اعلان‌ها</h1>
          <p class="text-xs md:text-sm text-white/60 mt-1">
            ساخت، مدیریت و حذف اعلان‌های سیستم   
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-2 rounded-xl bg-[#1e2623] px-3 py-1.5 text-xs ring-1 ring-[#334D44]/60"
            title="تعداد کل اعلان‌ها"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>تعداد: {{ totalCount }}</span>
          </span>
        </div>
      </header>

      <!-- Content -->
      <main class="p-4 md:p-6 flex-1 overflow-auto">
        <div class="max-w-7xl mx-auto space-y-6">
          <!-- Create / Filter Card -->
          <div
            class="rounded-2xl bg-gradient-to-b from-[#1a2220] to-[#12181b] ring-1 ring-[#334D44]/60 p-4 sm:p-6"
          >
            <!-- Create form -->
            <form @submit.prevent="createNotif" class="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div class="lg:col-span-4">
                <label class="block text-xs text-white/60 mb-1">عنوان اعلان</label>
                <input
                  v-model.trim="form.title"
                  placeholder="مثال: بروزرسانی سرویس پرداخت"
                  class="w-full rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-[#b9f1cf] px-3 py-2.5 text-sm placeholder:text-white/40"
                />
              </div>

              <div class="lg:col-span-6">
                <label class="block text-xs text-white/60 mb-1">متن اعلان</label>
                <input
                  v-model.trim="form.text"
                  placeholder="متن اعلان را کوتاه و واضح بنویسید…"
                  class="w-full rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-[#b9f1cf] px-3 py-2.5 text-sm placeholder:text-white/40"
                />
              </div>

              <div class="lg:col-span-2 flex items-end gap-2">
                <button
                  type="submit"
                  :disabled="loadingCreate || !canSubmit"
                  class="w-full rounded-xl px-4 py-2.5 bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95 disabled:opacity-60"
                >
                  {{ loadingCreate ? 'در حال افزودن…' : 'افزودن ' }}
                </button>
                <button
                  type="button"
                  @click="clearForm"
                  :disabled="loadingCreate"
                  class="rounded-xl px-4 py-2.5 bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] disabled:opacity-60"
                >
                  پاک‌سازی
                </button>
              </div>
            </form>

            <!-- Filters -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="relative md:col-span-2">
                <input
                  v-model.trim="search"
                  type="search"
                  placeholder="جستجو در عنوان، متن یا تاریخ…"
                  class="w-full rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-[#b9f1cf] px-10 py-2.5 text-sm placeholder:text-white/40"
                  @keyup.enter="goFirstPage"
                />
                <svg
                  class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/>
                </svg>
                <button
                  v-if="search"
                  @click="search=''"
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  aria-label="پاک کردن جستجو"
                >✕</button>
              </div>

              <div class="flex items-center justify-between md:justify-end gap-3">
                <label class="text-xs text-white/70">نمایش</label>
                <select
                  v-model.number="itemsPerPage"
                  class="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm focus:ring-2 focus:ring-[#b9f1cf]"
                  aria-label="تعداد در هر صفحه"
                >
                  <option :value="5">۵</option>
                  <option :value="10">۱۰</option>
                  <option :value="20">۲۰</option>
                  <option :value="50">۵۰</option>
                </select>
              </div>
            </div>
          </div>

          <!-- List Card -->
          <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 sm:p-5 backdrop-blur-md">
            <!-- Table Desktop -->
            <div class="hidden md:block overflow-x-auto rounded-xl ring-1 ring-white/10">
              <table class="min-w-full text-right">
                <thead class="bg-white/5 text-white">
                  <tr>
                    <th class="px-3 py-3 text-xs font-semibold">#</th>
                    <th class="px-3 py-3 text-xs font-semibold">عنوان</th>
                    <th class="px-3 py-3 text-xs font-semibold">متن</th>
                    <th class="px-3 py-3 text-xs font-semibold">تاریخ</th>
                    <th class="px-3 py-3 text-xs font-semibold">عملیات</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-white/10 text-white/90">
                  <!-- Loading skeleton rows -->
                  <template v-if="loadingList">
                    <tr v-for="i in 5" :key="'skel-'+i" class="bg-white/5">
                      <td class="px-3 py-3"><div class="h-4 w-8 bg-white/10 animate-pulse rounded"></div></td>
                      <td class="px-3 py-3"><div class="h-4 w-40 bg-white/10 animate-pulse rounded"></div></td>
                      <td class="px-3 py-3"><div class="h-4 w-80 bg-white/10 animate-pulse rounded"></div></td>
                      <td class="px-3 py-3"><div class="h-4 w-28 bg-white/10 animate-pulse rounded"></div></td>
                      <td class="px-3 py-3"><div class="h-8 w-20 bg-white/10 animate-pulse rounded"></div></td>
                    </tr>
                  </template>

                  <!-- Rows -->
                  <template v-else>
                    <tr
                      v-for="(n, i) in paginated"
                      :key="n._id"
                      class="hover:bg-white/5 transition"
                    >
                      <td class="px-3 py-3 text-xs text-white/70">{{ rowIndex(i) }}</td>
                      <td class="px-3 py-3 text-sm font-medium max-w-[18rem] truncate">{{ n.title }}</td>
                      <td class="px-3 py-3 text-sm text-white/80 max-w-[40rem] truncate">{{ n.text }}</td>
                      <td class="px-3 py-3 text-xs text-white/60 whitespace-nowrap">{{ formatDate(n.createdAt) }}</td>
                      <td class="px-3 py-3">
                        <div class="flex items-center gap-2">
                          <button
                            @click="preview(n)"
                            class="px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-xs hover:bg-white/10"
                          >
                            مشاهده
                          </button>
                          <button
                            @click="deleteNotif(n._id)"
                            :disabled="deletingId === n._id"
                            class="px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs hover:bg-red-500 disabled:opacity-60"
                          >
                            {{ deletingId === n._id ? 'حذف…' : 'حذف' }}
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="paginated.length===0">
                      <td colspan="5" class="px-3 py-10 text-center text-white/60">
                        اعلانی مطابق شرایط فعلی پیدا نشد.
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <!-- Mobile list -->
            <div class="md:hidden grid gap-3">
              <template v-if="loadingList">
                <div v-for="i in 5" :key="'skm-'+i" class="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                  <div class="h-4 w-40 bg-white/10 rounded animate-pulse"></div>
                  <div class="mt-2 h-4 w-3/4 bg-white/10 rounded animate-pulse"></div>
                  <div class="mt-2 h-3 w-20 bg-white/10 rounded animate-pulse"></div>
                </div>
              </template>

              <template v-else>
                <article
                  v-for="(n, i) in paginated"
                  :key="n._id"
                  class="rounded-xl ring-1 ring-white/10 bg-white/5 p-3"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <div class="font-semibold truncate">{{ n.title || '—' }}</div>
                      <div class="mt-1 text-xs text-white/60">{{ formatDate(n.createdAt) }}</div>
                    </div>
                    <span class="text-xs text-white/50">#{{ rowIndex(i) }}</span>
                  </div>

                  <div class="mt-2 text-xs text-white/80 line-clamp-2">
                    {{ n.text }}
                  </div>

                  <div class="mt-3 flex items-center justify-end gap-2">
                    <button
                      @click="preview(n)"
                      class="px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-[11px] hover:bg-white/10"
                    >
                      مشاهده
                    </button>
                    <button
                      @click="deleteNotif(n._id)"
                      :disabled="deletingId === n._id"
                      class="px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-[11px] hover:bg-red-500 disabled:opacity-60"
                    >
                      {{ deletingId === n._id ? 'حذف…' : 'حذف' }}
                    </button>
                  </div>
                </article>

                <div v-if="paginated.length===0" class="px-3 py-8 text-center text-white/60">
                  اعلانی مطابق شرایط فعلی پیدا نشد.
                </div>
              </template>
            </div>

            <!-- Pagination -->
            <div
              class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="text-xs text-white/60">
                نمایش
                <span class="text-white">{{ rangeStart }}</span>
                –
                <span class="text-white">{{ rangeEnd }}</span>
                از
                <span class="text-white">{{ filtered.length }}</span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40"
                >
                  قبلی
                </button>

                <button
                  v-for="p in pagesToShow"
                  :key="p"
                  @click="typeof p==='number' && changePage(p)"
                  :disabled="p==='...'"
                  :class="[
                    'px-3 py-1.5 rounded-lg',
                    currentPage === p
                      ? 'bg-[#b9f1cf] text-[#0a1f14] font-semibold'
                      : 'bg-[#1e2623] ring-1 ring-[#334D44]/60 text-white'
                  ]"
                >
                  {{ p }}
                </button>

                <button
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40"
                >
                  بعدی
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Preview Modal -->
    <transition name="modal-fade">
      <div
        v-if="previewOpen"
        class="fixed inset-0 z-50 grid place-items-center p-4"
      >
        <div class="absolute inset-0 bg-black/60" @click="closePreview"></div>
        <div
          class="relative w-full max-w-lg rounded-2xl bg-white p-6 text-right shadow-2xl"
        >
          <h3 class="text-xl font-bold text-gray-900">{{ previewItem?.title || '—' }}</h3>
          <p class="mt-2 text-gray-700 whitespace-pre-wrap">
            {{ previewItem?.text || '' }}
          </p>
          <div class="mt-4 flex items-center justify-between">
            <time class="text-sm text-gray-500">{{ formatDate(previewItem?.createdAt) }}</time>
            <button
              @click="closePreview"
              class="px-4 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import Sidebar from '@/components/admin/SidebarAdmin.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { ref, computed, onMounted, watch } from 'vue'

const url = process.env.VUE_APP_API_URL || ''

/* ---------------------------- State ---------------------------- */
const form = ref({ title: '', text: '' })
const search = ref('')
const loadingCreate = ref(false)
const loadingList = ref(true)
const deletingId = ref(null)

const notifs = ref([])

const currentPage = ref(1)
const itemsPerPage = ref(10)

/* ---------------------------- Fetch ---------------------------- */
async function fetchNotifs () {
  loadingList.value = true
  try {
    const res = await axios.get(`${url}/admin/getnotif`)
    notifs.value = res.data?.data || []
  } catch (e) {
    notifs.value = []
  } finally {
    loadingList.value = false
  }
}

/* --------------------------- Helpers --------------------------- */
const canSubmit = computed(() => form.value.title.trim().length > 0 && form.value.text.trim().length > 0)
const totalCount = computed(() => notifs.value.length)

function formatDate (d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return '—'
  return dt.toLocaleString('fa-IR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}

function clearForm () {
  form.value.title = ''
  form.value.text = ''
}

async function createNotif () {
  if (!canSubmit.value) {
    Swal.fire({ icon: 'error', text: 'عنوان و متن اعلان را وارد کنید.' })
    return
  }
  loadingCreate.value = true
  try {
    const res = await axios.post(`${url}/admin/createnotif`, {
      title: form.value.title.trim(),
      text: form.value.text.trim()
    })
    Swal.fire({ icon: 'success', text: res.data?.data || 'اعلان ایجاد شد.' })
    clearForm()
    await fetchNotifs()
  } catch (err) {
    Swal.fire({ icon: 'error', text: err.response?.data?.error || 'خطا در ایجاد اعلان' })
  } finally {
    loadingCreate.value = false
  }
}

async function deleteNotif (id) {
  const ok = await Swal.fire({
    title: 'حذف اعلان',
    text: 'آیا از حذف این اعلان مطمئن هستید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'حذف',
    cancelButtonText: 'انصراف'
  })
  if (!ok.isConfirmed) return
  deletingId.value = id
  try {
    const res = await axios.delete(`${url}/admin/deletenotif/${id}`)
    Swal.fire({ icon: 'success', text: res.data?.data || 'اعلان حذف شد' })
    await fetchNotifs()
  } catch (err) {
    Swal.fire({ icon: 'error', text: err.response?.data?.error || 'خطا در حذف اعلان' })
  } finally {
    deletingId.value = null
  }
}

/* -------------------------- Filtering -------------------------- */
const filtered = computed(() => {
  const q = (search.value || '').trim().toLowerCase()
  if (!q) return notifs.value
  return notifs.value.filter(n => {
    const combined = `${n.title || ''} ${n.text || ''} ${formatDate(n.createdAt)}`
    return combined.toLowerCase().includes(q)
  })
})

/* -------------------------- Pagination ------------------------- */
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / itemsPerPage.value)))
const paginated = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filtered.value.slice(start, start + itemsPerPage.value)
})
const rangeStart = computed(() => filtered.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
const rangeEnd   = computed(() => Math.min(currentPage.value * itemsPerPage.value, filtered.value.length))

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

function changePage (p) {
  if (p < 1) p = 1
  if (p > totalPages.value) p = totalPages.value
  currentPage.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function goFirstPage () { currentPage.value = 1 }
function rowIndex (i) { return (currentPage.value - 1) * itemsPerPage.value + i + 1 }

watch([itemsPerPage, search], () => { currentPage.value = 1 })

/* --------------------------- Preview --------------------------- */
const previewOpen = ref(false)
const previewItem = ref(null)
function preview (n) {
  previewItem.value = n
  previewOpen.value = true
  document.body.style.overflow = 'hidden'
}
function closePreview () {
  previewOpen.value = false
  previewItem.value = null
  document.body.style.overflow = ''
}

/* --------------------------- Mount ----------------------------- */
onMounted(fetchNotifs)
</script>

<style scoped>
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.line-clamp-3{ display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

/* modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
