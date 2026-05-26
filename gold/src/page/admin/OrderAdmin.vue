<template>
  <div class="flex min-h-screen bg-base text-white font-sans">
    <Sidebar />

    <div class="flex-1 flex flex-col mt-20 md:-mt-0">
      <!-- Header -->
      <header class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
                 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 flex items-center justify-between">
        <h1 class="text-lg md:text-2xl font-extrabold">سفارشات کاربران</h1>
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center gap-2 rounded-xl bg-white/5 px-2 py-1 ring-1 ring-white/10">
            <i class="fas fa-search text-white/70"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو..."
              class="bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0 transition w-32 md:w-auto"
            />
          </div>
        </div>
      </header>

      <main class="p-4 md:p-6 flex-1 overflow-auto">
        <!-- Desktop Table -->
        <div class="hidden md:block rounded-2xl glass shadow-lg ring-1 ring-white/10">
          <table class="min-w-full divide-y divide-white/10 text-sm">
            <thead class="bg-white/5">
              <tr>
                <th class="px-4 py-3 text-right text-xs font-semibold text-white/70">UID</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-white/70">کاربر (تلفن)</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-white/70">نوع</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-white/70">وزن</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-white/70">قیمت طلا</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-white/70">قیمت سفارش</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-white/70">کارمزد</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-white/70">تاریخ</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-white/70">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr
                v-for="order in filteredOrders"
                :key="getId(order)"
                class="hover:bg-white/5 transition-colors"
              >
                <td class="px-4 py-3 whitespace-nowrap">{{ order.uid }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {{ order.userid?.phone ?? (typeof order.userid === 'string' ? order.userid : '') }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">{{ order.typeorder }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ formatWeight(order.weight) }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ formatNumber(order.goldprice) }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ formatNumber(order.price) }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ formatNumber(order.fee, 3) }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(order) }}</td>
                <td class="px-4 py-3 whitespace-nowrap relative">
                  <button
                    @click="toggleDropdown(getId(order))"
                    class="px-3 py-1.5 text-sm rounded-xl transition focus:outline-none ring-1 ring-white/10 bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95"
                  >
                    عملیات
                  </button>

                  <div
                    v-if="dropdownOpen === getId(order)"
                    class="origin-top-right absolute left-4 mt-2 w-44 bg-card ring-1 ring-white/10 rounded-xl shadow-2xl z-20 animate-dropdown backdrop-blur-md"
                  >
                    <ul class="py-1">
                      <li>
                        <button
                          @click="viewOrder(order)"
                          class="block w-full text-right px-4 py-2 text-sm hover:bg-white/5 transition"
                        >
                          نمایش
                        </button>
                      </li>
                      <li>
                        <button
                          @click="deleteOrder(order)"
                          class="block w-full text-right px-4 py-2 text-sm text-rose-300 hover:bg-white/5 transition"
                        >
                          حذف
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <div
            v-for="order in filteredOrders"
            :key="getId(order)"
            class="bg-card ring-1 ring-white/10 rounded-2xl shadow-lg p-4"
          >
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <p class="text-sm font-semibold">UID: {{ order.uid }}</p>
                <p class="text-xs text-white/60">
                  نوع: {{ order.typeorder }} — وزن: {{ formatWeight(order.weight) }}
                </p>
                <p class="text-xs text-white/60">قیمت: {{ formatNumber(order.price) }}</p>
                <p class="text-xs text-white/60">کارمزد: {{ formatNumber(order.fee, 3) }}</p>
                <p class="text-xs text-white/60">تاریخ: {{ formatDate(order) }}</p>
              </div>
              <div class="relative">
                <button
                  @click="toggleDropdown(getId(order))"
                  class="px-3 py-1.5 text-sm rounded-xl transition focus:outline-none ring-1 ring-white/10 bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95"
                >
                  عملیات
                </button>
                <div
                  v-if="dropdownOpen === getId(order)"
                  class="origin-top-right absolute left-0 mt-2 w-40 bg-card ring-1 ring-white/10 rounded-xl shadow-2xl z-20 animate-dropdown backdrop-blur-md"
                >
                  <ul class="py-1">
                    <li>
                      <button
                        @click="viewOrder(order)"
                        class="block w-full text-right px-4 py-2 text-sm hover:bg-white/5 transition"
                      >
                        نمایش
                      </button>
                    </li>
                    <li>
                      <button
                        @click="deleteOrder(order)"
                        class="block w-full text-right px-4 py-2 text-sm text-rose-300 hover:bg-white/5 transition"
                      >
                        حذف
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Details Modal (teleported to body so it's never clipped) -->
        <Teleport to="body">
          <transition name="mg-fade">
            <div
              v-if="showModal"
              class="fixed inset-0 z-[9999] flex items-center justify-center"
              @keydown.esc="closeModal"
            >
              <!-- Backdrop -->
              <div
                class="absolute inset-0 bg-black/70 backdrop-blur-md"
                @click="closeModal"
                aria-hidden="true"
              ></div>

              <!-- Modal -->
              <div
                class="relative w-full max-w-3xl mx-4 rounded-2xl bg-[#12181b]/90 ring-1 ring-white/10 shadow-2xl"
                role="dialog"
                aria-modal="true"
              >
                <!-- Top accent bar -->
                <div class="h-1.5 w-full rounded-t-2xl" style="background: linear-gradient(90deg,#b9f1cf,rgba(185,241,207,0.2));"></div>

                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <h2 class="text-xl font-bold">📦 جزئیات سفارش</h2>
                    <button
                      @click="closeModal"
                      class="h-9 w-9 grid place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
                      aria-label="بستن"
                    >
                      ✕
                    </button>
                  </div>

                  <!-- User Info -->
                  <div class="mb-5 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                    <h3 class="font-semibold text-lg mb-3">👤 اطلاعات کاربر</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80">
                      <p><span class="text-white/60">نام کاربری:</span> {{ selectedOrder?.userid?.username }}</p>
                      <p><span class="text-white/60">نام:</span> {{ selectedOrder?.userid?.fname }}</p>
                      <p><span class="text-white/60">نام خانوادگی:</span> {{ selectedOrder?.userid?.lname }}</p>
                      <p><span class="text-white/60">شماره موبایل:</span> {{ selectedOrder?.userid?.phone }}</p>
                      <p><span class="text-white/60">ایمیل:</span> {{ selectedOrder?.userid?.email }}</p>
                      <p><span class="text-white/60">نقش:</span> {{ selectedOrder?.userid?.role }}</p>
                      <p><span class="text-white/60">وضعیت:</span> {{ selectedOrder?.userid?.status }}</p>
                      <p><span class="text-white/60">موجودی طلا:</span> {{ formatNumber(selectedOrder?.userid?.gold) }} گرم</p>
                      <p><span class="text-white/60">موجودی تومان:</span> {{ formatNumber(selectedOrder?.userid?.toman) }} تومان</p>
                    </div>
                  </div>

                  <!-- Order Info -->
                  <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                    <h3 class="font-semibold text-lg mb-3">📄 اطلاعات سفارش</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80">
                      <p><span class="text-white/60">UID سفارش:</span> {{ selectedOrder?.uid }}</p>
                      <p><span class="text-white/60">نوع سفارش:</span> {{ selectedOrder?.typeorder }}</p>
                      <p><span class="text-white/60">وزن:</span> {{ formatWeight(selectedOrder?.weight) }}</p>
                      <p><span class="text-white/60">قیمت طلا:</span> {{ formatNumber(selectedOrder?.goldprice) }}</p>
                      <p><span class="text-white/60">قیمت سفارش:</span> {{ formatNumber(selectedOrder?.price) }}</p>
                      <p><span class="text-white/60">کارمزد:</span> {{ formatNumber(selectedOrder?.fee, 3) }}</p>
                      <p><span class="text-white/60">تاریخ سفارش:</span> {{ formatDate(selectedOrder) }}</p>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="mt-6 flex justify-end gap-2">
                    <button
                      @click="closeModal"
                      class="px-4 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                    >
                      بستن
                    </button>
                    <button
                      @click="copySummary"
                      class="px-4 py-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95"
                    >
                      کپی خلاصه
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </Teleport>

        <!-- Pagination -->
        <div class="mt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="text-xs text-white/60">
            نمایش {{ (currentPage - 1) * perPage + 1 }} تا {{ Math.min(currentPage * perPage, totalFiltered) }} از {{ totalFiltered }} سفارش
          </div>
          <div class="flex gap-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 text-sm rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition disabled:opacity-50"
            >
              قبلی
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage * perPage >= totalFiltered"
              class="px-3 py-1.5 text-sm rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        </div>

        <div v-if="error" class="mt-4 p-4 rounded-xl text-sm bg-rose-400/10 text-rose-200 ring-1 ring-rose-300/30">
          {{ error }}
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Sidebar from '@/components/admin/SidebarAdmin.vue'

const url = process.env.VUE_APP_API_URL || ''
const orders = ref([])
const dropdownOpen = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 30
const error = ref(null)
const showModal = ref(false)
const selectedOrder = ref(null)

onMounted(fetchOrders)

// Prevent background scroll when modal is open & handle Escape
const escHandler = (e) => { if (e.key === 'Escape') closeModal() }
watch(showModal, (v) => {
  try { document.body.style.overflow = v ? 'hidden' : '' } catch {
     console.log("error");
  }
  if (v) window.addEventListener('keydown', escHandler)
  else window.removeEventListener('keydown', escHandler)
})
onBeforeUnmount(() => {
  try { document.body.style.overflow = '' } catch {
    console.log("error");
    
  }
  window.removeEventListener('keydown', escHandler)
})

async function fetchOrders () {
  try {
    error.value = null
    const res = await axios.get(`${url}/admin/order`)
    let list = []
    if (Array.isArray(res.data)) list = res.data
    else if (Array.isArray(res.data.data)) list = res.data.data
    else if (Array.isArray(res.data.orders)) list = res.data.orders
    else if (res.data && (res.data._id || res.data.uid)) list = [res.data]
    orders.value = list
  } catch (err) {
    console.error(err)
    error.value = 'خطا در بارگذاری سفارشات. لطفاً دوباره تلاش کنید.'
  }
}

const totalFiltered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const list = Array.isArray(orders.value) ? orders.value : []
  return list.filter(o => matchOrder(o, q)).length
})

const filteredOrders = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const list = Array.isArray(orders.value) ? orders.value : []
  const filtered = list.filter(o => matchOrder(o, q))
  const start = (currentPage.value - 1) * perPage
  return filtered.slice(start, start + perPage)
})

function matchOrder (o, q) {
  if (!q) return true
  let userVal = ''
  if (o.userid && typeof o.userid === 'object') userVal = o.userid.phone ?? o.userid.username ?? ''
  else if (o.userid) userVal = String(o.userid)
  return String(o.uid || '').toLowerCase().includes(q) ||
    String(o.typeorder || '').toLowerCase().includes(q) ||
    String(userVal).toLowerCase().includes(q) ||
    String(o.price || '').toLowerCase().includes(q)
}

function getId (o) {
  if (!o) return null
  if (o._id && typeof o._id === 'object' && o._id.$oid) return o._id.$oid
  return o._id || o.id || null
}

function formatDate (obj) {
  if (!obj) return ''
  if (typeof obj === 'string' || typeof obj === 'number' || obj instanceof Date) {
    try { return new Date(obj).toLocaleString('fa-IR') } catch { return String(obj) }
  }
  const d = obj.createdAt?.$date || obj.createdAt || obj.updatedAt?.$date || obj.updatedAt || obj.time
  if (!d) return ''
  try { return new Date(d).toLocaleString('fa-IR') } catch { return String(d) }
}

function formatNumber (n, fractionDigits = 0) {
  if (n == null) return '-'
  const num = Number(n)
  if (Number.isNaN(num)) return n
  return num.toLocaleString('fa-IR', { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits })
}

function formatWeight (w) {
  if (w == null) return '-'
  const n = Number(w)
  if (Number.isNaN(n)) return w
  return n.toFixed(3)
}

function toggleDropdown (id) { dropdownOpen.value = dropdownOpen.value === id ? null : id }

function viewOrder (order) {
  selectedOrder.value = order
  showModal.value = true
}

function closeModal () {
  showModal.value = false
  selectedOrder.value = null
  dropdownOpen.value = null
}

async function deleteOrder (order) {
  const id = getId(order)
  const confirm = await Swal.fire({
    title: 'آیا مطمئنی؟',
    text: 'این عملیات غیرقابل بازگشت است.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'حذف',
    cancelButtonText: 'انصراف'
  })
  if (!confirm.isConfirmed) { dropdownOpen.value = null; return }

  try {
    await axios.delete(`${url}/admin/order/delete/${id}`)
    orders.value = orders.value.filter(o => getId(o) !== id)
    Swal.fire({ icon: 'success', toast: true, position: 'top-end', title: 'سفارش حذف شد', showConfirmButton: false, timer: 2000 })
  } catch (err) {
    Swal.fire({ icon: 'error', toast: true, position: 'top-end', title: 'خطا در حذف سفارش', showConfirmButton: false, timer: 3000 })
  }
  dropdownOpen.value = null
}

function copySummary () {
  if (!selectedOrder.value) return
  const o = selectedOrder.value
  const lines = [
    `UID: ${o.uid ?? '-'}`,
    `نوع: ${o.typeorder ?? '-'}`,
    `وزن: ${formatWeight(o.weight)}`,
    `قیمت طلا: ${formatNumber(o.goldprice)}`,
    `قیمت سفارش: ${formatNumber(o.price)}`,
    `کارمزد: ${formatNumber(o.fee, 3)}`,
    `تاریخ: ${formatDate(o)}`,
    `کاربر: ${o?.userid?.username ?? o?.userid?.phone ?? '-'}`
  ]
  navigator.clipboard?.writeText(lines.join('\n')).catch(()=>{})
}

function prevPage () { if (currentPage.value > 1) currentPage.value-- }
function nextPage () { if (currentPage.value * perPage < totalFiltered.value) currentPage.value++ }
</script>

<style scoped>
/* Glass helpers (MintGlass) */
.glass { background-color: rgba(255,255,255,0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
.bg-base { background-color: #12181b; }
.bg-card { background-color: #1a2220; }

/* Animations */
@keyframes dropdown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
.animate-dropdown { animation: dropdown 0.18s ease-out; }

/* Modal transition */
.mg-fade-enter-active, .mg-fade-leave-active { transition: opacity .18s ease; }
.mg-fade-enter-from, .mg-fade-leave-to { opacity: 0; }

/* Table spacing */
table { border-collapse: separate; border-spacing: 0 0.5rem; }
thead th { padding-bottom: 0.75rem; }

/* Focus ring in MintGlass tone */
button:focus, input:focus { outline: none; box-shadow: 0 0 0 3px rgba(185, 241, 207, 0.25); }
</style>
