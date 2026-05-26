<template>
  <div class="flex min-h-screen bg-base text-white font-sans">
    <Sidebar />

    <div class="flex-1 flex flex-col mt-20 md:-mt-0">
      <header
        class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
               ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0"
      >
        <div class="flex items-center justify-between w-full md:w-auto gap-4">
          <h1 class="text-lg md:text-2xl font-extrabold text-white">مدیریت کاربران</h1>
          <span class="md:hidden text-xs text-white/50 font-mono">{{ filteredTotal }} کاربر</span>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <button @click="openCreateModal" class="mint-primary-btn flex items-center gap-2 whitespace-nowrap">
            <i class="fas fa-plus"></i>
            ثبت کاربر جدید
          </button>

          <div class="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 w-full md:w-auto">
            <i class="fas fa-search text-white/70"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو..."
              class="bg-transparent text-sm text-white placeholder:text-white/40
                     focus:outline-none focus:ring-0 transition w-full md:w-48"
            />
          </div>
        </div>
      </header>

      <main class="p-4 md:p-6 flex-1 overflow-auto">
        
        <div class="hidden md:block rounded-2xl glass shadow-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-white/10 text-sm">
              <thead class="bg-white/5">
                <tr>
                  <th class="th-cell">نام کاربری</th>
                  <th class="th-cell">نام</th>
                  <th class="th-cell">نام خانوادگی</th>
                  <th class="th-cell">تلفن</th>
                  <th class="th-cell">ایمیل</th>
                  <th class="th-cell">نقش</th>
                  <th class="th-cell">وضعیت حساب</th>
                  <th class="th-cell">وضعیت احراز</th>
                  <th class="th-cell">عکس کارت ملی</th>
                  <th class="th-cell">طلای کاربر</th>
                  <th class="th-cell">تومان کاربر</th>
                  <th class="th-cell">عملیات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <tr
                  v-for="user in filteredUsers"
                  :key="user._id"
                  class="hover:bg-white/5 transition-all duration-200"
                >
                  <td class="td-cell">{{ user.username }}</td>
                  <td class="td-cell">{{ user.fname }}</td>
                  <td class="td-cell">{{ user.lname }}</td>
                  <td class="td-cell">{{ user.phone }}</td>
                  <td class="td-cell">{{ user.email }}</td>
                  <td class="td-cell">{{ user.role }}</td>
                  <td class="td-cell">
                    <span class="status-pill" :class="user.isActive ? 'status-pill-active' : 'status-pill-inactive'">
                      <i class="fas" :class="user.isActive ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
                      {{ user.isActive ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </td>
                  <td class="td-cell">
                    <span class="status-pill" :class="user.isAuthentication ? 'status-pill-auth' : 'status-pill-unauth'">
                      <i class="fas" :class="user.isAuthentication ? 'fa-check-circle' : 'fa-times-circle'"></i>
                      {{ user.isAuthentication ? 'احراز شده' : 'احراز نشده' }}
                    </span>
                  </td>
                  <td class="td-cell">
                    <a v-if="user.imgcartmeli" :href="user.imgcartmeli" target="_blank" class="underline decoration-dotted text-[#b9f1cf] hover:brightness-110">نمایش</a>
                    <span v-else class="text-white/40 text-xs">ثبت نشده</span>
                  </td>
                  <td class="td-cell text-[#ffd700]">{{ user.gold }}</td>
                  <td class="td-cell text-[#b9f1cf]">{{ Number(user.toman).toLocaleString() }}</td>
                  <td class="px-4 py-3 relative">
                    <button @click="toggleDropdown(user._id)" class="px-3 py-1.5 text-sm rounded-lg bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95 transition">عملیات</button>
                    <div v-if="dropdownOpen === user._id" class="origin-top-right absolute left-4 mt-2 w-56 bg-[#0f1417]/95 ring-1 ring-white/10 rounded-2xl shadow-2xl z-20 backdrop-blur-xl animate-dropdown overflow-hidden">
                       <ul class="py-1 text-sm">
                        <li><button @click="openManageUser(user)" class="dropdown-item">مدیریت کامل</button></li>
                        <li><button @click="openBalanceModal(user)" class="dropdown-item">شارژ / کسر موجودی</button></li>
                        <li><button @click="confirmAuthenticate(user)" class="dropdown-item">تأیید احراز هویت</button></li>
                        <li><button @click="openRejectModal(user)" class="dropdown-item">رد احراز هویت</button></li>
                        <li>
                            <button @click="toggleActive(user._id, true)" class="dropdown-item" :class="user.isActive ? 'dropdown-danger' : 'dropdown-success'">
                                <i class="fas mr-1" :class="user.isActive ? 'fa-ban' : 'fa-check-circle'"></i>
                                {{ user.isActive ? 'غیرفعال کردن حساب' : 'فعال کردن حساب' }}
                            </button>
                        </li>
                        <li><button @click="deleteUser(user)" class="dropdown-item text-rose-300 hover:bg-rose-500/5">حذف کاربر</button></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="md:hidden space-y-4 pb-20">
          <div 
            v-for="user in filteredUsers" 
            :key="'mob-' + user._id" 
            class="glass p-4 rounded-2xl relative"
          >
            <div class="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
              <div>
                <div class="font-bold text-white text-base">{{ user.fname }} {{ user.lname }}</div>
                <div class="text-xs text-[#b9f1cf]/80 mt-1 font-mono">@{{ user.username }}</div>
              </div>
              <span class="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60">
                {{ user.role }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div class="flex flex-col gap-1">
                <span class="text-white/40 text-[10px]">موبایل</span>
                <span class="font-mono text-white/90">{{ user.phone }}</span>
              </div>
              <div class="flex flex-col gap-1">
                 <span class="text-white/40 text-[10px]">ایمیل</span>
                 <span class="font-mono text-white/50 truncate">{{ user.email }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mb-4">
                <div class="bg-black/20 rounded-xl p-2 border border-white/5 flex flex-col items-center justify-center">
                    <span class="text-[9px] text-white/40 mb-1">طلا (گرم)</span>
                    <span class="text-[#ffd700] font-bold text-sm">{{ user.gold }}</span>
                </div>
                <div class="bg-black/20 rounded-xl p-2 border border-white/5 flex flex-col items-center justify-center">
                    <span class="text-[9px] text-white/40 mb-1">تومان</span>
                    <span class="text-[#b9f1cf] font-bold text-sm">{{ Number(user.toman).toLocaleString() }}</span>
                </div>
             </div>

             <div class="flex justify-between items-center mb-4 gap-2">
                <span class="status-pill w-full justify-center" :class="user.isActive ? 'status-pill-active' : 'status-pill-inactive'">
                  {{ user.isActive ? 'فعال' : 'غیرفعال' }}
                </span>
                <span class="status-pill w-full justify-center" :class="user.isAuthentication ? 'status-pill-auth' : 'status-pill-unauth'">
                   {{ user.isAuthentication ? 'احراز شده' : 'ناقص' }}
                </span>
             </div>

             <button
                @click="toggleDropdown(user._id)"
                class="w-full py-2.5 text-sm font-bold rounded-xl bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95 transition flex items-center justify-center gap-2"
              >
                <i class="fas fa-cog"></i>
                مدیریت و عملیات
             </button>

             <div
                v-if="dropdownOpen === user._id"
                class="absolute left-0 right-0 bottom-16 mx-4 bg-[#0f1417] ring-1 ring-white/20 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,1)] z-30 animate-dropdown overflow-hidden"
              >
                <ul class="py-1 text-sm divide-y divide-white/5">
                   <li><button @click="openManageUser(user)" class="dropdown-item py-3">مدیریت کامل</button></li>
                   <li><button @click="openBalanceModal(user)" class="dropdown-item py-3">شارژ / کسر موجودی</button></li>
                   <li><button @click="confirmAuthenticate(user)" class="dropdown-item py-3">تأیید احراز هویت</button></li>
                   <li><button @click="openRejectModal(user)" class="dropdown-item py-3">رد احراز هویت</button></li>
                   <li>
                      <button @click="toggleActive(user._id, true)" class="dropdown-item py-3" :class="user.isActive ? 'dropdown-danger' : 'dropdown-success'">
                         {{ user.isActive ? 'غیرفعال کردن حساب' : 'فعال کردن حساب' }}
                      </button>
                   </li>
                   <li><button @click="deleteUser(user)" class="dropdown-item py-3 text-rose-300">حذف کاربر</button></li>
                </ul>
             </div>
          </div>
        </div>

        <div v-if="createModal" class="mint-modal-overlay z-[60]">
          <div class="mint-modal">
            <div class="mint-modal-header">
               <h2 class="mint-modal-title">ثبت کاربر / ادمین جدید</h2>
               <button class="mint-modal-close" @click="closeCreateModal">✕</button>
             </div>
             <div class="mint-modal-body">
               <div class="mint-grid">
                  <div class="mint-field"><label class="labelMint">نام کاربری (انگلیسی)</label><input v-model="newUser.username" class="mintInput" type="text" /></div>
                  <div class="mint-field"><label class="labelMint">رمز عبور</label><input v-model="newUser.password" class="mintInput" type="password" /></div>
               </div>
               <div class="mint-grid">
                  <div class="mint-field"><label class="labelMint">نام</label><input v-model="newUser.fname" class="mintInput" type="text" /></div>
                  <div class="mint-field"><label class="labelMint">نام خانوادگی</label><input v-model="newUser.lname" class="mintInput" type="text" /></div>
               </div>
               <div class="mint-grid">
                  <div class="mint-field"><label class="labelMint">موبایل</label><input v-model="newUser.phone" class="mintInput" type="text" /></div>
                  <div class="mint-field"><label class="labelMint">کد ملی</label><input v-model="newUser.codemeli" class="mintInput" type="text" /></div>
               </div>
               <div class="mint-grid">
                  <div class="mint-field"><label class="labelMint">ایمیل</label><input v-model="newUser.email" class="mintInput" type="email" /></div>
                  <div class="mint-field">
                    <label class="labelMint">نقش کاربری</label>
                    <select v-model="newUser.role" class="mintInput">
                        <option value="USER">کاربر عادی</option>
                        <option value="COWORKER">همکار</option>
                        <option value="ADMIN">ادمین کل</option>
                    </select>
                  </div>
               </div>
               <div class="mint-field"><label class="labelMint">آدرس</label><input v-model="newUser.address" class="mintInput" type="text" /></div>
             </div>
             <div class="mint-modal-footer">
               <button class="mint-secondary-btn" @click="closeCreateModal">انصراف</button>
               <button class="mint-primary-btn" @click="submitCreateUser">ایجاد کاربر</button>
             </div>
          </div>
        </div>

        <div v-if="manageModal && manageTarget" class="mint-modal-overlay z-[60]">
          <div class="mint-modal">
            <div class="mint-modal-header">
               <h2 class="mint-modal-title">
                 مدیریت کاربر <span class="mint-modal-subtitle">{{ manageTarget.username || 'کاربر' }}</span>
               </h2>
               <button class="mint-modal-close" @click="closeManageModal">✕</button>
             </div>
             <div class="mint-modal-body">
               <div class="mint-grid">
                  <div class="mint-field"><label class="labelMint">نام</label><input v-model="manageTarget.fname" class="mintInput" type="text" /></div>
                  <div class="mint-field"><label class="labelMint">نام خانوادگی</label><input v-model="manageTarget.lname" class="mintInput" type="text" /></div>
               </div>
               <div class="mint-grid">
                  <div class="mint-field"><label class="labelMint">موبایل</label><input v-model="manageTarget.phone" class="mintInput" type="text" /></div>
                  <div class="mint-field"><label class="labelMint">ایمیل</label><input v-model="manageTarget.email" class="mintInput" type="email" /></div>
               </div>
               <div class="mint-field">
                 <label class="labelMint">نقش</label>
                 <select v-model="manageTarget.role" class="mintInput">
                   <option value="USER">USER</option>
                   <option value="COWORKER">COWORKER</option>
                   <option value="ADMIN">ADMIN</option>
                 </select>
               </div>
               <div class="mint-grid mt-4">
                  <div class="mint-field">
                    <label class="labelMint">وضعیت حساب</label>
                    <div class="flex items-center justify-between gap-3">
                      <span class="status-pill" :class="manageTarget.isActive ? 'status-pill-active' : 'status-pill-inactive'">
                        <i class="fas" :class="manageTarget.isActive ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
                        {{ manageTarget.isActive ? 'فعال' : 'غیرفعال' }}
                      </span>
                      <button class="mint-toggle-btn" :class="manageTarget.isActive ? 'mint-toggle-danger' : 'mint-toggle-success'" @click="toggleActive(manageTarget._id)">
                         {{ manageTarget.isActive ? 'غیرفعال کردن' : 'فعال کردن' }}
                      </button>
                    </div>
                  </div>
                  <div class="mint-field">
                    <label class="labelMint">وضعیت احراز</label>
                    <div class="flex items-center justify-between gap-3">
                       <span class="status-pill" :class="manageTarget.isAuthentication ? 'status-pill-auth' : 'status-pill-unauth'">
                          {{ manageTarget.isAuthentication ? 'احراز شده' : 'احراز نشده' }}
                       </span>
                       <div class="flex gap-2">
                          <button class="mint-mini-btn mint-mini-success" @click="confirmAuthenticate(manageTarget, true)">تأیید</button>
                          <button class="mint-mini-btn mint-mini-danger" @click="openRejectModal(manageTarget, true)">رد</button>
                       </div>
                    </div>
                  </div>
               </div>
             </div>
             <div class="mint-modal-footer">
               <button class="mint-secondary-btn" @click="closeManageModal">بستن</button>
               <button class="mint-primary-btn" @click="submitManage">ذخیره تغییرات</button>
             </div>
          </div>
        </div>

        <div v-if="rejectModal" class="mint-modal-overlay z-[60]">
           <div class="mint-modal max-w-md">
             <div class="mint-modal-header">
               <h2 class="mint-modal-title">رد احراز هویت</h2>
               <button class="mint-modal-close" @click="closeRejectModal">✕</button>
             </div>
             <div class="mint-modal-body">
               <p class="text-xs text-white/60 mb-3">دلیل رد را وارد کنید:</p>
               <textarea v-model="rejectText" rows="5" class="mintTextarea" placeholder="..."></textarea>
             </div>
             <div class="mint-modal-footer">
               <button class="mint-secondary-btn" @click="closeRejectModal">انصراف</button>
               <button class="mint-danger-btn" @click="submitReject">ارسال و رد</button>
             </div>
           </div>
        </div>

        <div v-if="balanceModal" class="mint-modal-overlay z-[60]">
          <div class="mint-modal max-w-md">
            <div class="mint-modal-header">
               <h2 class="mint-modal-title">شارژ / کسر موجودی</h2>
               <button class="mint-modal-close" @click="closeBalanceModal">✕</button>
            </div>
            <div class="mint-modal-body">
               <div class="mint-field mb-3"><label class="labelMint">مقدار طلا (گرم)</label><input v-model.number="balanceData.gold" type="number" class="mintInput" /></div>
               <div class="mint-field"><label class="labelMint">مقدار تومان</label><input v-model.number="balanceData.toman" type="number" class="mintInput" /></div>
            </div>
            <div class="mint-modal-footer">
               <button class="mint-secondary-btn" @click="closeBalanceModal">انصراف</button>
               <button class="mint-primary-btn" @click="submitBalance">ثبت تغییرات</button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center text-xs text-white/60 pb-16 md:pb-0">
          <div>
            نمایش {{ filteredTotal === 0 ? 0 : (currentPage - 1) * perPage + 1 }} تا {{ Math.min(currentPage * perPage, filteredTotal) }} از {{ filteredTotal }}
          </div>
          <div class="flex gap-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="pageBtn w-20 justify-center">قبلی</button>
            <button @click="nextPage" :disabled="currentPage * perPage >= filteredTotal" class="pageBtn w-20 justify-center">بعدی</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Sidebar from '@/components/admin/SidebarAdmin.vue'

const url = process.env.VUE_APP_API_URL || ''

const users = ref([])
const dropdownOpen = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 12

const manageModal = ref(false)
const manageTarget = ref(null)

const rejectModal = ref(false)
const rejectText = ref('')
const rejectTarget = ref(null)

const balanceModal = ref(false)
const balanceTarget = ref(null)
const balanceData = ref({ gold: 0, toman: 0 })

const createModal = ref(false)
const newUser = ref({
    username: '',
    password: '',
    fname: '',
    lname: '',
    phone: '',
    codemeli: '',
    email: '',
    address: '',
    role: 'USER'
})

onMounted(fetchUsers)

async function fetchUsers() {
  try {
    const res = await axios.get(`${url}/admin/userlist`)
    users.value = res.data.users || []
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'خطا در بارگذاری کاربران', text: e.response?.data?.error || '' })
  }
}

const filteredAll = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter(u =>
    (u.username || '').toLowerCase().includes(q) ||
    (u.fname || '').toLowerCase().includes(q) ||
    (u.lname || '').toLowerCase().includes(q) ||
    (u.email || '').toLowerCase().includes(q) ||
    (u.phone || '').toLowerCase().includes(q)
  )
})

const filteredTotal = computed(() => filteredAll.value.length)

const filteredUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredAll.value.slice(start, start + perPage)
})

function toggleDropdown(id) {
  dropdownOpen.value = dropdownOpen.value === id ? null : id
}

function openCreateModal() {
    newUser.value = { username: '', password: '', fname: '', lname: '', phone: '', codemeli: '', email: '', address: '', role: 'USER' }
    createModal.value = true
}

function closeCreateModal() {
    createModal.value = false
}

async function submitCreateUser() {
    if(!newUser.value.username || !newUser.value.password || !newUser.value.phone) {
        Swal.fire({ icon: 'warning', title: 'هشدار', text: 'لطفا فیلدهای اصلی (نام کاربری، رمز، موبایل) را پر کنید' })
        return
    }
    try {
        await axios.post(`${url}/admin/user/create`, newUser.value)
        Swal.fire({ icon: 'success', title: 'موفق', text: 'کاربر/ادمین جدید با موفقیت ساخته شد' })
        createModal.value = false
        await fetchUsers()
    } catch (e) {
        Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.message || 'خطا در ایجاد کاربر' })
    }
}

function openManageUser(user) {
  manageTarget.value = { ...user }
  manageModal.value = true
  dropdownOpen.value = null
}

function closeManageModal() {
  manageModal.value = false
  manageTarget.value = null
}

async function submitManage() {
  try {
    await axios.put(`${url}/admin/user/update`, manageTarget.value)
    Swal.fire({ toast: true, icon: 'success', title: 'تغییرات ذخیره شد', timer: 2000, position: 'top-end', showConfirmButton: false })
    manageModal.value = false
    await fetchUsers()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.error || '' })
  }
}

async function toggleActive(id, fromList = false) {
  try {
    await axios.put(`${url}/admin/isactive/${id}`)
    Swal.fire({ toast: true, icon: 'success', title: 'وضعیت تغییر کرد', timer: 2000, position: 'top-end', showConfirmButton: false })
    if (manageTarget.value && manageTarget.value._id === id && !fromList) {
      manageTarget.value.isActive = !manageTarget.value.isActive
    }
    dropdownOpen.value = null
    await fetchUsers()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.error || '' })
  }
}

async function confirmAuthenticate(user, fromManage = false) {
  try {
    await axios.get(`${url}/admin/authentication/${user._id}`)
    Swal.fire({ toast: true, icon: 'success', title: 'احراز هویت تأیید شد', timer: 2000, position: 'top-end', showConfirmButton: false })
    if (fromManage && manageTarget.value && manageTarget.value._id === user._id) {
      manageTarget.value.isAuthentication = true
    }
    dropdownOpen.value = null
    await fetchUsers()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.error || '' })
  }
}

function openRejectModal(user, fromManage = false) {
  rejectTarget.value = { ...user, fromManage }
  rejectText.value = ''
  rejectModal.value = true
  dropdownOpen.value = null
}

function closeRejectModal() {
  rejectModal.value = false
  rejectTarget.value = null
  rejectText.value = ''
}

async function submitReject() {
  if (!rejectTarget.value) return
  const text = (rejectText.value || '').trim()
  if (!text) { Swal.fire({ icon: 'warning', title: 'لطفاً دلیل رد را وارد کنید' }); return }
  try {
    await axios.post(`${url}/admin/isRejected`, { userId: rejectTarget.value._id, text })
    Swal.fire({ toast: true, icon: 'success', title: 'احراز هویت رد شد', timer: 2000, position: 'top-end', showConfirmButton: false })
    if (rejectTarget.value.fromManage && manageTarget.value && manageTarget.value._id === rejectTarget.value._id) {
      manageTarget.value.isAuthentication = false
    }
    rejectModal.value = false
    await fetchUsers()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.error || '' })
  }
}

function openBalanceModal(user) {
  balanceTarget.value = user
  balanceData.value = { gold: 0, toman: 0 }
  balanceModal.value = true
  dropdownOpen.value = null
}

function closeBalanceModal() {
  balanceModal.value = false
  balanceTarget.value = null
}

async function submitBalance() {
  if (!balanceTarget.value) return
  try {
    await axios.put(`${url}/admin/user/balance`, { userId: balanceTarget.value._id, gold: balanceData.value.gold, toman: balanceData.value.toman })
    Swal.fire({ toast: true, icon: 'success', title: 'موجودی بروزرسانی شد', timer: 2000, position: 'top-end', showConfirmButton: false })
    balanceModal.value = false
    await fetchUsers()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.error || '' })
  }
}

function deleteUser(user) {
  Swal.fire({
    title: 'حذف کاربر؟', text: `آیا از حذف "${user.username || ''}" مطمئن هستید؟`, icon: 'warning', showCancelButton: true, confirmButtonText: 'حذف', cancelButtonText: 'انصراف',
  }).then(async r => {
    if (!r.isConfirmed) { dropdownOpen.value = null; return }
    try {
      await axios.get(`${url}/admin/deleteuser/${user._id}`)
      Swal.fire({ toast: true, icon: 'success', title: 'کاربر حذف شد', timer: 2000, position: 'top-end', showConfirmButton: false })
      await fetchUsers()
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'خطا در حذف', text: e.response?.data?.error || '' })
    } finally { dropdownOpen.value = null }
  })
}

function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function nextPage() { if (currentPage.value * perPage < filteredTotal.value) currentPage.value++ }
</script>

<style scoped>
.bg-base { background-color: #12181b; }
.glass { background-image: linear-gradient(to bottom, rgba(26, 34, 32, 0.9), rgba(18, 24, 27, 0.9)); backdrop-filter: blur(18px); border-radius: 1rem; border: 1px solid rgba(51, 77, 68, 0.6); }
.th-cell { padding: 0.75rem 1rem; text-align: right; font-size: 0.7rem; font-weight: 600; color: rgba(255, 255, 255, 0.7); }
.td-cell { padding: 0.75rem 1rem; white-space: nowrap; font-size: 0.8rem; }
.status-pill { display: inline-flex; align-items: center; gap: 0.25rem; border-radius: 999px; padding: 0.2rem 0.55rem; font-size: 0.7rem; font-weight: 600; }
.status-pill-active { background-color: rgba(34, 197, 94, 0.12); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.45); }
.status-pill-inactive { background-color: rgba(248, 113, 113, 0.12); color: #fecaca; border: 1px solid rgba(248, 113, 113, 0.45); }
.status-pill-auth { background-color: rgba(34, 197, 94, 0.12); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.45); }
.status-pill-unauth { background-color: rgba(248, 113, 113, 0.12); color: #fecaca; border: 1px solid rgba(248, 113, 113, 0.45); }
.dropdown-item { width: 100%; text-align: right; padding: 0.45rem 1rem; background: transparent; border: none; color: rgba(255, 255, 255, 0.85); cursor: pointer; font-size: 0.8rem; }
.dropdown-item:hover { background-color: rgba(255, 255, 255, 0.04); }
.dropdown-success { color: #6ee7b7; }
.dropdown-danger { color: #fecaca; }
@keyframes dropdown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
.animate-dropdown { animation: dropdown 0.18s ease-out; }
.mintInput { width: 100%; padding: 0.6rem 0.8rem; border-radius: 0.9rem; border: 1px solid rgba(148, 163, 184, 0.45); background-color: rgba(15, 20, 23, 0.9); color: #ffffff; font-size: 0.82rem; outline: none; transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; }
.mintInput::placeholder { color: rgba(255, 255, 255, 0.35); }
.mintInput:focus { border-color: rgba(185, 241, 207, 0.8); box-shadow: 0 0 0 1px rgba(185, 241, 207, 0.5); background-color: rgba(15, 20, 23, 0.95); }
.labelMint { display: block; margin-bottom: 0.25rem; font-size: 0.72rem; color: rgba(255, 255, 255, 0.78); }
.pageBtn { padding: 0.35rem 0.9rem; font-size: 0.78rem; border-radius: 0.8rem; background-color: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.12); color: #ffffff; cursor: pointer; transition: background-color 0.15s ease, opacity 0.15s ease; }
.pageBtn:hover:not(:disabled) { background-color: rgba(255, 255, 255, 0.08); }
.pageBtn:disabled { opacity: 0.45; cursor: default; }
.mint-modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(18px); }
.mint-modal { width: 100%; max-width: 32rem; border-radius: 1.4rem; overflow: hidden; background-color: rgba(13, 17, 23, 0.98); border: 1px solid rgba(148, 163, 184, 0.35); box-shadow: 0 0 40px rgba(0, 0, 0, 0.8); display: flex; flex-direction: column; animation: scaleIn 0.18s ease-out; }
.mint-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.3); background: radial-gradient(circle at top left, rgba(185, 241, 207, 0.12), transparent), radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.1), transparent); }
.mint-modal-title { font-size: 0.98rem; font-weight: 800; color: #ffffff; display: flex; flex-direction: column; gap: 0.1rem; }
.mint-modal-subtitle { font-size: 0.7rem; font-weight: 400; color: rgba(226, 232, 240, 0.72); }
.mint-modal-close { border: none; background: transparent; color: rgba(226, 232, 240, 0.8); font-size: 1.2rem; cursor: pointer; padding: 0.1rem 0.25rem; }
.mint-modal-close:hover { color: #ffffff; }
.mint-modal-body { padding: 1.1rem 1.1rem 0.75rem; max-height: 70vh; overflow-y: auto; }
.mint-modal-footer { padding: 0.8rem 1.1rem 1rem; display: flex; justify-content: flex-end; gap: 0.5rem; border-top: 1px solid rgba(148, 163, 184, 0.25); background-color: rgba(15, 23, 42, 0.9); }
.mint-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.75rem; }
.mint-field { display: flex; flex-direction: column; }
.mint-toggle-btn { padding: 0.4rem 0.8rem; border-radius: 999px; border: none; font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; color: #0b1120; }
.mint-toggle-success { background-color: #6ee7b7; }
.mint-toggle-danger { background-color: #fb7185; }
.mint-mini-btn { border-radius: 999px; padding: 0.25rem 0.7rem; font-size: 0.7rem; font-weight: 600; border: none; cursor: pointer; }
.mint-mini-success { background-color: rgba(16, 185, 129, 0.16); color: #6ee7b7; border: 1px solid rgba(45, 212, 191, 0.6); }
.mint-mini-danger { background-color: rgba(248, 113, 113, 0.18); color: #fecaca; border: 1px solid rgba(248, 113, 113, 0.6); }
.mint-mini-outline { background-color: transparent; color: #e5e7eb; border: 1px solid rgba(148, 163, 184, 0.8); }
.mint-pill-box { display: flex; align-items: center; justify-content: space-between; padding: 0.45rem 0.7rem; border-radius: 0.9rem; background-color: rgba(15, 23, 42, 0.85); border: 1px solid rgba(148, 163, 184, 0.5); font-size: 0.78rem; }
.mint-primary-btn { padding: 0.45rem 1.2rem; border-radius: 0.9rem; border: none; background-color: #b9f1cf; color: #022c22; font-size: 0.8rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25); }
.mint-primary-btn:hover { filter: brightness(1.05); }
.mint-secondary-btn { padding: 0.45rem 1.2rem; border-radius: 0.9rem; border: 1px solid rgba(148, 163, 184, 0.7); background-color: rgba(15, 23, 42, 0.9); color: rgba(226, 232, 240, 0.9); font-size: 0.8rem; font-weight: 500; cursor: pointer; }
.mint-secondary-btn:hover { background-color: rgba(30, 41, 59, 0.9); }
.mint-danger-btn { padding: 0.45rem 1.2rem; border-radius: 0.9rem; border: none; background-color: #fb7185; color: #f9fafb; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.mint-danger-btn:hover { filter: brightness(1.04); }
.mintTextarea { width: 100%; border-radius: 1rem; border: 1px solid rgba(148, 163, 184, 0.5); background-color: rgba(15, 23, 42, 0.95); padding: 0.7rem 0.9rem; color: #ffffff; font-size: 0.8rem; resize: vertical; outline: none; }
.mintTextarea::placeholder { color: rgba(148, 163, 184, 0.7); }
.mintTextarea:focus { border-color: rgba(185, 241, 207, 0.8); box-shadow: 0 0 0 1px rgba(185, 241, 207, 0.4); }
@keyframes scaleIn { from { opacity: 0; transform: translateY(8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media (max-width: 768px) { .mint-grid { grid-template-columns: minmax(0, 1fr); } }
</style>