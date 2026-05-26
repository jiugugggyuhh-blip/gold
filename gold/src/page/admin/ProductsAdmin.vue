<template>
  <div class="flex h-screen bg-base text-white">
    <Sidebar />

    <div class="flex-1 flex flex-col pt-16 md:pt-0">
      <!-- Header -->
      <header class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
                 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4">
        <h1 class="text-xl font-extrabold">مدیریت محصولات</h1>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="flex-1 md:w-64 inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <i class="fas fa-search text-white/60"></i>
            <input
              v-model="search"
              placeholder="جستجو بر عنوان یا نوع..."
              class="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>

          <select v-model.number="itemsPerPage" class="px-3 py-2 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>

          <button @click="openModal()" class="px-3 py-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95 ring-1 ring-white/10">
            افزودن محصول
          </button>

          <button @click="fetchProducts" class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10">
            بروزرسانی
          </button>
        </div>
      </header>

      <main class="p-6 overflow-auto">
        <div class="glass rounded-2xl p-4">
          <div v-if="loading" class="py-10 text-center">
            <div class="mx-auto h-8 w-8 border-2 border-white/20 border-t-[#b9f1cf] rounded-full animate-spin"></div>
            <div class="mt-3 text-white/70 text-sm">در حال بارگذاری...</div>
          </div>

          <div v-else>
            <div class="overflow-x-auto">
              <table class="w-full text-right min-w-[720px] text-sm">
                <thead>
                  <tr class="bg-white/5 text-white/70">
                    <th class="p-3 font-semibold">#</th>
                    <th class="p-3 font-semibold">عنوان</th>
                    <th class="p-3 font-semibold">نوع</th>
                    <th class="p-3 font-semibold">وزن (گرم)</th>
                    <th class="p-3 font-semibold">وزن (سوت)</th>
                    <th class="p-3 font-semibold">وضعیت</th>
                    <th class="p-3 font-semibold">عملیات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                  <tr v-if="paginated.length === 0">
                    <td colspan="7" class="p-6 text-center text-white/60">محصولی یافت نشد.</td>
                  </tr>

                  <tr v-for="(p, idx) in paginated" :key="p._id" class="hover:bg-white/5 transition-colors">
                    <td class="p-3">{{ (currentPage-1)*itemsPerPage + idx + 1 }}</td>
                    <td class="p-3 text-white">{{ p.title }}</td>
                    <td class="p-3 text-white/80">{{ p.type || '-' }}</td>
                    <td class="p-3 text-white/80">{{ p.weightGram ?? '-' }}</td>
                    <td class="p-3 text-white/80">{{ p.weightSot ?? '-' }}</td>
                    <td class="p-3">
                      <span
                        :class="p.status
                          ? 'bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-300/30'
                          : 'bg-rose-400/20 text-rose-300 ring-1 ring-rose-300/30'"
                        class="px-2 py-1 rounded-full text-[11px] font-semibold"
                      >
                        {{ p.status ? 'فعال' : 'غیرفعال' }}
                      </span>
                    </td>
                    <td class="p-3">
                      <div class="flex flex-wrap gap-2">
                        <button @click="openModal(p)" class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10">ویرایش</button>
                        <button @click="confirmDelete(p._id)" class="px-3 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white">حذف</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div class="text-sm text-white/70">نمایش {{ paginated.length }} از {{ filtered.length }} مورد</div>

              <div class="flex items-center gap-2">
                <button :disabled="currentPage === 1" @click="prevPage" class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 disabled:opacity-50">قبلی</button>

                <div class="flex items-center gap-1">
                  <button
                    v-for="p in pages"
                    :key="p"
                    @click="goToPage(p)"
                    :class="['px-3 py-1.5 rounded-xl ring-1 ring-white/10',
                      p === currentPage ? 'bg-[#b9f1cf] text-[#0a1f14]' : 'bg-white/5 hover:bg-white/10 text-white']"
                  >
                    {{ p }}
                  </button>
                </div>

                <button :disabled="currentPage === totalPages" @click="nextPage" class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 disabled:opacity-50">بعدی</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <transition name="mg-fade">
        <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-md" @click="closeModal"></div>

          <div class="relative w-full max-w-2xl mx-4 glass rounded-2xl overflow-hidden">
            <div class="h-1.5 w-full" style="background: linear-gradient(90deg,#b9f1cf,rgba(185,241,207,.25));"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-extrabold">{{ editProduct ? 'ویرایش محصول' : 'افزودن محصول' }}</h2>
                <button @click="closeModal" class="h-9 w-9 grid place-items-center rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10">✕</button>
              </div>

              <form @submit.prevent="saveProduct" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block mb-1 text-xs text-white/70">عنوان</label>
                    <input v-model="form.title" required class="w-full p-2 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none" />
                  </div>
                  <div>
                    <label class="block mb-1 text-xs text-white/70">نوع</label>
                    <input v-model="form.type" class="w-full p-2 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none" />
                  </div>

                  <div>
                    <label class="block mb-1 text-xs text-white/70">وزن (گرم)</label>
                    <input v-model.number="form.weightGram" type="number" step="0.001" class="w-full p-2 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none" />
                  </div>
                  <div>
                    <label class="block mb-1 text-xs text-white/70">وزن (سوت)</label>
                    <input v-model.number="form.weightSot" type="number" class="w-full p-2 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none" />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block mb-1 text-xs text-white/70">توضیحات</label>
                    <textarea v-model="form.description" class="w-full p-2 rounded-xl bg-white/5 text-white ring-1 ring-white/10 focus:outline-none"></textarea>
                  </div>

                  <div class="flex items-center gap-3 md:col-span-2 flex-wrap">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="form.status" class="rounded" />
                      <span class="text-sm text-white/80">فعال</span>
                    </label>

                    <div class="flex-1">
                      <label class="block mb-1 text-xs text-white/70">تصویر (اختیاری)</label>
                      <input type="file" @change="handleFileUpload" accept="image/*" class="text-white/80"/>
                      <div v-if="previewUrl" class="mt-2">
                        <img :src="previewUrl" class="h-24 rounded-xl object-contain ring-1 ring-white/10 bg-white/5 p-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" @click="closeModal" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10">انصراف</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95">ذخیره</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import Sidebar from '@/components/admin/SidebarAdmin.vue'
import axios from 'axios'
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL || ''

const products = ref([])
const loading = ref(false)
const search = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)

const showModal = ref(false)
const editProduct = ref(null)
const form = ref({
  title: '',
  type: '',
  weightGram: null,
  weightSot: null,
  status: true,
  description: '',
  img: null
})
const previewUrl = ref(null)

async function fetchProducts() {
  loading.value = true
  try {
    const res = await axios.get(`${url}/admin/product`)
    products.value = res.data?.data || []
    currentPage.value = 1
  } catch (err) {
    products.value = []
    console.error(err)
  } finally {
    loading.value = false
  }
}

function openModal(product = null) {
  if (product) {
    editProduct.value = product
    form.value = {
      title: product.title || '',
      type: product.type || '',
      weightGram: product.weightGram ?? null,
      weightSot: product.weightSot ?? null,
      status: !!product.status,
      description: product.description || '',
      img: null
    }
    previewUrl.value = product.img || null
  } else {
    editProduct.value = null
    form.value = { title: '', type: '', weightGram: null, weightSot: null, status: true, description: '', img: null }
    previewUrl.value = null
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  form.value.img = null
  previewUrl.value = null
}

function handleFileUpload(e) {
  const f = e.target.files?.[0] || null
  form.value.img = f
  previewUrl.value = f ? URL.createObjectURL(f) : null
}

async function saveProduct() {
  try {
    const fd = new FormData()
    fd.append('title', form.value.title)
    fd.append('type', form.value.type)
    if (form.value.weightGram !== null) fd.append('weightGram', String(form.value.weightGram))
    if (form.value.weightSot !== null) fd.append('weightSot', String(form.value.weightSot))
    fd.append('status', form.value.status ? 'true' : 'false')
    fd.append('description', form.value.description || '')
    if (form.value.img) fd.append('img', form.value.img)

    if (editProduct.value) {
      await axios.put(`${url}/admin/product/update/${editProduct.value._id}`, fd)
      await Swal.fire({ icon: 'success', title: 'ویرایش انجام شد', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false })
    } else {
      await axios.post(`${url}/admin/product/create`, fd)
      await Swal.fire({ icon: 'success', title: 'محصول افزوده شد', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false })
    }

    await fetchProducts()
    closeModal()
  } catch (err) {
    console.error(err)
    const msg = err.response?.data?.message || err.response?.data?.data || err.message || 'خطا'
    await Swal.fire({ icon: 'error', title: String(msg), toast: true, position: 'top-end', timer: 2500, showConfirmButton: false })
  }
}

async function confirmDelete(id) {
  const ok = await Swal.fire({
    title: 'حذف محصول',
    text: 'آیا از حذف محصول مطمئن هستید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'حذف',
    cancelButtonText: 'انصراف'
  })
  if (!ok.isConfirmed) return

  try {
    await axios.delete(`${url}/admin/product/delete/${id}`)
    await Swal.fire({ icon: 'success', title: 'حذف شد', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false })
    await fetchProducts()
  } catch (err) {
    console.error(err)
    await Swal.fire({ icon: 'error', title: 'خطا در حذف', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false })
  }
}

const filtered = computed(() => {
  const s = (search.value || '').trim().toLowerCase()
  if (!s) return products.value
  return products.value.filter(p => {
    return (p.title || '').toLowerCase().includes(s) || (p.type || '').toLowerCase().includes(s)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil((filtered.value.length || 1) / itemsPerPage.value)))
const pages = computed(() => {
  const t = totalPages.value
  const cur = currentPage.value
  const arr = []
  const start = Math.max(1, cur - 2)
  const end = Math.min(t, cur + 2)
  for (let i = start; i <= end; i++) arr.push(i)
  if (arr[0] !== 1) arr.unshift(1)
  if (arr[arr.length - 1] !== t) arr.push(t)
  return [...new Set(arr)]
})

const paginated = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filtered.value.slice(start, start + itemsPerPage.value)
})

function goToPage(n) {
  if (n < 1 || n > totalPages.value) return
  currentPage.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }

watch([search, itemsPerPage], () => { currentPage.value = 1 })
watch(showModal, (v) => { document.body.style.overflow = v ? 'hidden' : '' })

onMounted(fetchProducts)
</script>

<style scoped>
.bg-base { background:#12181b; }
.bg-card { background:#1a2220; }
.glass { background:rgba(255,255,255,0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border:1px solid rgba(255,255,255,0.1); }

/* Modal transition */
.mg-fade-enter-active, .mg-fade-leave-active { transition: opacity .18s ease; }
.mg-fade-enter-from, .mg-fade-leave-to { opacity: 0; }

/* Focus ring in MintGlass tone */
button:focus, input:focus, select:focus, textarea:focus { outline: none; box-shadow: 0 0 0 3px rgba(185,241,207,0.25); }
</style>
