<template>
  <div class="flex min-h-screen bg-base text-white font-sans">
    <Sidebar />

    <div class="flex-1 flex flex-col mt-20 md:-mt-0 transition-all duration-300">
      
      <!-- Header -->
      <header class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="p-2.5 rounded-xl bg-[#b9f1cf]/10 text-[#b9f1cf] shadow-[0_0_15px_rgba(185,241,207,0.15)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg md:text-2xl font-extrabold text-white">طرح‌های وام</h1>
            <p class="text-xs text-white/50 mt-0.5">مدیریت بسته‌های تسهیلاتی</p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <button @click="openModal()" class="mint-primary-btn flex items-center gap-2 whitespace-nowrap">
            <i class="fas fa-plus"></i>
            طرح جدید
          </button>
          
          <div class="relative w-full md:w-48">
             <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
               <i class="fas fa-search text-white/30 text-xs"></i>
             </div>
             <input 
               v-model="searchQuery"
               type="text" 
               placeholder="جستجو..." 
               class="block w-full p-2.5 pr-9 text-xs rounded-xl bg-[#141a1d] border border-white/10 placeholder-white/40 text-white focus:ring-1 focus:ring-[#b9f1cf] focus:border-[#b9f1cf] outline-none transition" 
             />
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-4 md:p-6 flex-1 overflow-auto">
        <div v-if="loading" class="grid gap-4">
           <div v-for="i in 4" :key="i" class="h-20 rounded-2xl bg-[#141a1d] animate-pulse ring-1 ring-white/5"></div>
        </div>

        <div v-else>
          <div v-if="filteredPlans.length === 0" class="flex flex-col items-center justify-center py-20 bg-[#141a1d]/50 rounded-3xl border border-dashed border-white/10">
            <div class="text-4xl mb-2 opacity-50">📂</div>
            <p class="text-white/40 text-sm">هیچ طرح وامی یافت نشد.</p>
          </div>

          <div v-else>
            <!-- Desktop Table -->
            <div class="hidden md:block rounded-2xl bg-[#141a1d]/90 backdrop-blur-xl ring-1 ring-[#334D44]/40 shadow-xl overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-white/5">
                  <thead class="bg-white/5">
                    <tr>
                      <th class="px-6 py-4 text-right text-xs font-bold text-[#b9f1cf]">عنوان طرح</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">مبلغ وام</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">سود / بازپرداخت</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">محاسبات</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">وضعیت</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">عملیات</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr v-for="plan in filteredPlans" :key="plan._id" class="group hover:bg-white/[0.02] transition-colors">
                      <td class="px-6 py-4">
                        <div class="font-bold text-white text-sm">{{ plan.title }}</div>
                        <div class="text-[10px] text-white/40 mt-1 truncate max-w-[150px]">{{ plan.description || 'بدون توضیحات' }}</div>
                      </td>
                      
                      <td class="px-6 py-4 text-center">
                        <span class="text-lg font-mono font-bold text-white tracking-tight">{{ formatMoney(plan.amount) }}</span>
                        <span class="text-[10px] text-white/40 block">تومان</span>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <div class="flex flex-col items-center gap-1">
                           <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">{{ plan.interestRate }}% سود</span>
                           <span class="text-xs text-white/60">{{ plan.durationMonths }} ماهه</span>
                        </div>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <div class="text-[10px] text-white/50 space-y-1">
                           <div>قسط: <span class="text-white">{{ calculateMonthly(plan) }}</span></div>
                           <div>بازپرداخت: <span class="text-white">{{ calculateTotal(plan) }}</span></div>
                        </div>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <button 
                          @click="toggleActive(plan)"
                          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-1 ring-white/10"
                          :class="plan.isActive ? 'bg-[#b9f1cf]' : 'bg-white/5'"
                        >
                          <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ml-1 mr-1" :class="plan.isActive ? '-translate-x-5' : 'translate-x-0'"></span>
                        </button>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                          <button @click="openModal(plan)" class="p-2 rounded-lg bg-white/5 hover:bg-[#b9f1cf] hover:text-[#0a1f14] text-white/60 transition"><i class="fas fa-edit"></i></button>
                          <button @click="deletePlan(plan)" class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition"><i class="fas fa-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Mobile List -->
            <div class="md:hidden grid gap-3">
              <div v-for="plan in filteredPlans" :key="'mob-'+plan._id" class="rounded-2xl bg-[#141a1d] border border-white/5 p-4 relative overflow-hidden shadow-lg">
                <div class="absolute top-0 right-0 w-1 h-full" :class="plan.isActive ? 'bg-emerald-500' : 'bg-white/10'"></div>
                
                <div class="flex justify-between items-start mb-4 pl-2">
                   <div>
                      <div class="font-bold text-white text-base">{{ plan.title }}</div>
                      <div class="flex items-center gap-2 mt-1">
                         <span class="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">{{ plan.durationMonths }} ماهه</span>
                         <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{{ plan.interestRate }}% سود</span>
                      </div>
                   </div>
                   <button 
                      @click="toggleActive(plan)"
                      class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ring-1 ring-white/10"
                      :class="plan.isActive ? 'bg-[#b9f1cf]' : 'bg-white/5'"
                   >
                      <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ml-0.5 mr-0.5" :class="plan.isActive ? '-translate-x-4' : 'translate-x-0'"></span>
                   </button>
                </div>

                <div class="bg-black/20 rounded-xl p-3 border border-white/5 mb-3 flex justify-between items-center">
                   <span class="text-xs text-white/50">مبلغ وام</span>
                   <span class="text-lg font-bold text-[#b9f1cf] font-mono">{{ formatMoney(plan.amount) }} <span class="text-[10px] font-sans font-normal text-white/40">تومان</span></span>
                </div>

                <div class="flex gap-2 text-[10px] text-white/40 mb-4 justify-between px-1">
                   <span>قسط: <b class="text-white">{{ calculateMonthly(plan) }}</b></span>
                   <span>بازپرداخت: <b class="text-white">{{ calculateTotal(plan) }}</b></span>
                </div>

                <div class="flex gap-2 pt-3 border-t border-white/5">
                   <button @click="openModal(plan)" class="flex-1 py-2 rounded-lg bg-white/5 text-white/80 text-xs font-bold hover:bg-white/10 transition">ویرایش</button>
                   <button @click="deletePlan(plan)" class="flex-1 py-2 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition">حذف</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="mint-modal-overlay z-[60]">
        <div class="mint-modal max-w-lg">
          <div class="mint-modal-header">
             <h2 class="mint-modal-title">{{ isEdit ? 'ویرایش طرح' : 'ایجاد طرح جدید' }}</h2>
             <button class="mint-modal-close" @click="closeModal">✕</button>
          </div>
          
          <div class="mint-modal-body space-y-4">
             <div class="mint-field">
                <label class="labelMint">عنوان طرح</label>
                <input v-model="form.title" type="text" class="mintInput" placeholder="مثلاً: وام فوری خرید کالا" />
             </div>

             <div class="mint-grid">
                <div class="mint-field">
                   <label class="labelMint">مبلغ (تومان)</label>
                   <input v-model.number="form.amount" type="number" class="mintInput font-mono" placeholder="50000000" />
                </div>
                <div class="mint-field">
                   <label class="labelMint">سود (درصد)</label>
                   <input v-model.number="form.interestRate" type="number" class="mintInput font-mono" placeholder="18" />
                </div>
             </div>

             <div class="mint-field">
                <div class="flex justify-between mb-1">
                  <label class="labelMint">مدت بازپرداخت</label>
                  <span class="text-xs font-bold text-[#b9f1cf]">{{ form.durationMonths }} ماهه</span>
                </div>
                <input v-model.number="form.durationMonths" type="range" min="1" max="60" class="w-full accent-[#b9f1cf] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                <div class="flex justify-between text-[9px] text-white/30 mt-1 px-1"><span>1 ماه</span><span>60 ماه</span></div>
             </div>

             <div class="bg-[#b9f1cf]/5 rounded-xl p-3 border border-[#b9f1cf]/10 text-xs space-y-1">
                <div class="flex justify-between text-white/60"><span>قسط ماهانه:</span><span class="text-white font-mono">{{ calculateMonthly(form) }}</span></div>
                <div class="flex justify-between text-white/60"><span>کل بازپرداخت:</span><span class="text-white font-mono">{{ calculateTotal(form) }}</span></div>
             </div>

             <div class="mint-field">
                <label class="labelMint">توضیحات (اختیاری)</label>
                <textarea v-model="form.description" rows="3" class="mintTextarea" placeholder="شرایط و توضیحات تکمیلی..."></textarea>
             </div>
          </div>

          <div class="mint-modal-footer">
             <button class="mint-secondary-btn" @click="closeModal">انصراف</button>
             <button class="mint-primary-btn" @click="submitForm" :disabled="submitting">
                <span v-if="submitting" class="animate-spin h-3 w-3 border-2 border-[#0a1f14] border-t-transparent rounded-full ml-1"></span>
                {{ isEdit ? 'ذخیره تغییرات' : 'ایجاد طرح' }}
             </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Sidebar from '@/components/admin/SidebarAdmin.vue'

const url = process.env.VUE_APP_API_URL || ''
const plans = ref([])
const loading = ref(true)
const searchQuery = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const currentId = ref(null)

const form = ref({
  title: '',
  amount: '',
  interestRate: 18,
  durationMonths: 12,
  description: ''
})

onMounted(fetchPlans)

async function fetchPlans() {
  loading.value = true
  try {
    const res = await axios.get(`${url}/admin/loanplan`)
    plans.value = res.data.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredPlans = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if(!q) return plans.value
  return plans.value.filter(p => p.title.toLowerCase().includes(q))
})

function openModal(plan = null) {
  if (plan) {
    isEdit.value = true
    currentId.value = plan._id
    form.value = { ...plan }
  } else {
    isEdit.value = false
    currentId.value = null
    form.value = { title: '', amount: '', interestRate: 18, durationMonths: 12, description: '' }
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  if (!form.value.title || !form.value.amount) {
     Swal.fire({ icon: 'warning', text: 'لطفا عنوان و مبلغ را وارد کنید.' })
     return
  }
  submitting.value = true
  try {
    if (isEdit.value) {
      await axios.put(`${url}/admin/loanplan/${currentId.value}`, form.value)
      Swal.fire({ toast: true, icon: 'success', title: 'ویرایش شد', position: 'top-end', showConfirmButton: false, timer: 3000 })
    } else {
      await axios.post(`${url}/admin/loanplan`, form.value)
      Swal.fire({ toast: true, icon: 'success', title: 'ایجاد شد', position: 'top-end', showConfirmButton: false, timer: 3000 })
    }
    closeModal()
    fetchPlans()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.message || 'خطایی رخ داد' })
  } finally {
    submitting.value = false
  }
}

async function toggleActive(plan) {
  try {
    await axios.put(`${url}/admin/loanplan/active/${plan._id}`)
    plan.isActive = !plan.isActive
    Swal.fire({ toast: true, icon: 'success', title: 'وضعیت تغییر کرد', position: 'top-end', showConfirmButton: false, timer: 2000 })
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'خطا', text: 'تغییر وضعیت انجام نشد' })
  }
}

function deletePlan(plan) {
  Swal.fire({
    title: 'حذف طرح', text: `آیا از حذف "${plan.title}" مطمئن هستید؟`, icon: 'warning', showCancelButton: true, confirmButtonText: 'حذف', cancelButtonText: 'انصراف'
  }).then(async r => {
    if (r.isConfirmed) {
      try {
        await axios.delete(`${url}/admin/loanplan/${plan._id}`)
        Swal.fire({ toast: true, icon: 'success', title: 'حذف شد' })
        fetchPlans()
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'خطا', text: 'حذف انجام نشد' })
      }
    }
  })
}

// Helpers
function formatMoney(n) { return Number(n || 0).toLocaleString('fa-IR') }
function calculateMonthly(data) {
  const amount = Number(data.amount) || 0
  const rate = Number(data.interestRate) || 0
  const months = Number(data.durationMonths) || 1
  const profit = amount * (rate / 100)
  const total = amount + profit
  return formatMoney(Math.round(total / months)) + ' تومان'
}
function calculateTotal(data) {
  const amount = Number(data.amount) || 0
  const rate = Number(data.interestRate) || 0
  const profit = amount * (rate / 100)
  return formatMoney(amount + profit) + ' تومان'
}
</script>

<style scoped>
.mint-modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px); }
.mint-modal { width: 100%; border-radius: 1.2rem; overflow: hidden; background-color: #0f1417; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.8); display: flex; flex-direction: column; animation: scaleIn 0.2s ease-out; }
.mint-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); background: #141a1e; }
.mint-modal-title { font-size: 1rem; font-weight: 800; color: #fff; }
.mint-modal-close { font-size: 1.2rem; color: rgba(255,255,255,0.5); cursor: pointer; }
.mint-modal-body { padding: 1.2rem; max-height: 70vh; overflow-y: auto; }
.mint-modal-footer { padding: 1rem; border-top: 1px solid rgba(255,255,255,0.05); background: #141a1e; display: flex; justify-content: flex-end; gap: 0.5rem; }
.mint-field { margin-bottom: 0.8rem; }
.labelMint { display: block; font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-bottom: 0.3rem; }
.mintInput { width: 100%; padding: 0.6rem 0.8rem; background: #1a2220; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; color: white; outline: none; transition: all 0.2s; font-size: 0.85rem; }
.mintInput:focus { border-color: #b9f1cf; box-shadow: 0 0 0 2px rgba(185, 241, 207, 0.1); }
.mintTextarea { width: 100%; padding: 0.6rem 0.8rem; background: #1a2220; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; color: white; outline: none; transition: all 0.2s; font-size: 0.85rem; resize: vertical; }
.mintTextarea:focus { border-color: #b9f1cf; }
.mint-primary-btn { padding: 0.5rem 1rem; background: #b9f1cf; color: #0a1f14; border-radius: 0.75rem; font-weight: bold; font-size: 0.85rem; transition: filter 0.2s; }
.mint-primary-btn:hover { filter: brightness(1.1); }
.mint-secondary-btn { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); border-radius: 0.75rem; font-size: 0.85rem; transition: background 0.2s; }
.mint-secondary-btn:hover { background: rgba(255,255,255,0.1); }
.mint-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>