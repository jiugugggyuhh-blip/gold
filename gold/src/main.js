import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import './registerServiceWorker'
import '@fortawesome/fontawesome-free/css/all.css'
import './styles/app.css'

const app = createApp(App)
const url = process.env.VUE_APP_API_URL

axios.get(`${url}/admin/setting`, { timeout: 10000 })
  .then(res => {
    const data = res.data.data
    if (!data) return

    document.title = data.title


    const oldLink = document.querySelector("link[rel~='icon']")
    if (oldLink) oldLink.remove()


    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/png'
    link.href = data.favicon + '?v=' + new Date().getTime()
    document.head.appendChild(link)
  })
  .catch((err) => {
    console.warn('initial setting request failed:', err?.message || err)
  })

app.config.globalProperties.$swal = Swal
app.use(router)
app.mount('#app')



