import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './page/HomeView.vue';
import AboutView from './page/AboutView.vue';
import LoginPage from './page/auth/LoginPage.vue';
import RegPage from './page/auth/RegPage.vue';
import HomeUser from './page/user/HomeUser.vue';
import ProfileUser from './page/user/ProfileUser.vue';
import OtpPage from './page/auth/OtpPage.vue';
import EditProfile from './page/user/EditProfile.vue';
import VerifyUser from './page/user/VerifyUser.vue';
import HomeAdmin from './page/admin/HomeAdmin.vue';
import UserAdmin from './page/admin/UserAdmin.vue';
import WalletUser from './page/user/WalletUser.vue';
import HistoryUser from './page/user/HistoryUser.vue';
import OrderAdmin from './page/admin/OrderAdmin.vue';
import axios from 'axios';
import GoldUser from './page/user/GoldUser.vue';
import RefUser from './page/user/RefUser.vue';
import SattingAdmin from './page/admin/SattingAdmin.vue';
import NotifAdmin from './page/admin/NotifAdmin.vue';
import NotifUser from './page/user/NotifUser.vue';
import SupportUser from './page/user/SupportUser.vue';
import SupportSend from './page/user/SupportSend.vue';
import SupportMessages from './page/user/SupportMessages.vue';
import SupportAdmin from './page/admin/SupportAdmin.vue';
import SupportMessagesAdmin from './page/admin/SupportMessagesAdmin.vue';
import WithdrawalUser from './page/user/WithdrawalUser.vue';
import CardUser from './page/user/CardUser.vue';
import CardAdmin from './page/admin/CardAdmin.vue';
import WithdrawalAdmin from './page/admin/withdrawalAdmin.vue';
import ProductsAdmin from './page/admin/ProductsAdmin.vue';
import AssetsUser from './page/user/AssetsUser.vue';
import ContactView from './page/ContactView.vue';
import PrivacyView from './page/PrivacyView.vue';
import FeesView from './page/FeesView.vue';
import DemoRtl from './page/DemoRtl.vue';
import SilverUser from './page/user/SilverUser.vue';
import WalletCrypto from './page/user/WalletCrypto.vue';
import LoanAdmin from './page/admin/LoanAdmin.vue';
import LoanUser from './page/user/LoanUser.vue';
import PledgeUser from './page/user/PledgeUser.vue';
import PledgeAdmin from './page/admin/PledgeAdmin.vue';
import LoanAdminTow from './page/admin/LoanAdminTow.vue';
import CharityUser from './page/user/CharityUser.vue';
import CharityAdmin from './page/admin/CharityAdmin.vue';
import TransferUser from './page/user/TransferUser.vue';
import FortuneWheel from './page/user/FortuneWheel.vue';
import TradingBot from './page/user/TradingBot.vue';
import TradingBotAdmin from './page/admin/TradingBotAdmin.vue';
import WalletView from './page/WalletView.vue';
import ApiSettingsAdmin from './page/admin/ApiSettingsAdmin.vue';
import ApiTest from './page/admin/ApiTest.vue';

const url = process.env.VUE_APP_API_URL;

const routes = [

  // page index
  { path: '/', component: HomeView, meta: { layout: 'page' } },
  { path: '/about', component: AboutView, meta: { layout: 'page' } },
  // admin area (only ADMIN)
  { path: '/admin', component: HomeAdmin, meta: { layout: 'admin' } },
  { path: '/admin/charity', component: CharityAdmin, meta: { layout: 'admin' } },
  { path: '/admin/users', component: UserAdmin, meta: { layout: 'admin' } },
  { path: '/admin/orders', component: OrderAdmin, meta: { layout: 'admin' } },
  { path: '/admin/settings', component: SattingAdmin, meta: { layout: 'admin' } },
  { path: '/admin/products', component: ProductsAdmin, meta: { layout: 'admin' } },
  { path: '/admin/support', component: SupportAdmin, meta: { layout: 'admin' } },
  { path: '/admin/supportmsg/:id', component: SupportMessagesAdmin, meta: { layout: 'admin' } },
  { path: '/admin/notif', component: NotifAdmin, meta: { layout: 'admin' } },
  { path: '/admin/withdrawal', component: WithdrawalAdmin, meta: { layout: 'admin' } },
  { path: '/admin/cards', component: CardAdmin, meta: { layout: 'admin' } },
  { path: '/admin/wallet/crypto', component: CardAdmin, meta: { layout: 'admin' } },
  { path: '/admin/walletorder', component: CardAdmin, meta: { layout: 'admin' } },
  { path: '/admin/deposit', component: CardAdmin, meta: { layout: 'admin' } },
  { path: '/admin/priceSetting', component: SattingAdmin, meta: { layout: 'admin' } },
  { path: '/admin/loan', component: LoanAdmin, meta: { layout: 'admin' } },
  { path: '/admin/pledge', component: PledgeAdmin, meta: { layout: 'admin' } },
  { path: '/admin/loan/request', component: LoanAdminTow, meta: { layout: 'admin' } },
  { path: '/admin/trading-bot', component: TradingBotAdmin, meta: { layout: 'admin' } },
  { path: '/admin/api-settings', component: ApiSettingsAdmin, meta: { layout: 'admin' } },
  { path: '/admin/api-test', component: ApiTest, meta: { layout: 'admin' } },
  { path: '/contact', component: ContactView, meta: { layout: 'page' } },
  { path: '/privacy', component: PrivacyView, meta: { layout: 'page' } },
  { path: '/fees', component: FeesView, meta: { layout: 'page' } },
  { path: '/demo', component: DemoRtl, meta: { layout: 'page' } },
  { path: '/blog', redirect: '/about' },
  { path: '/shop', redirect: { path: '/', hash: '#shop' } },
  { path: '/faq', redirect: { path: '/', hash: '#faq' } },
  { path: '/buy', redirect: '/register' },
  { path: '/sell', redirect: '/register' },
  { path: '/vault', redirect: '/about' },
  { path: '/terms', redirect: '/privacy' },
  { path: '/support', redirect: '/contact' },
  { path: '/wallet', component: WalletView, meta: { layout: 'page' } },

  // Auth 
  { path: '/login', component: LoginPage, meta: { layout: 'page' } },
  { path: '/register', component: RegPage, meta: { layout: 'page' } },
  { path: '/otp', component: OtpPage, meta: { layout: 'page' }, name: 'OtpPage' },

  // user area (only user)
  { path: '/user', component: HomeUser, meta: { layout: 'user' } },
  { path: '/user/profile', component: ProfileUser, meta: { layout: 'user' } },
  { path: '/user/editprofile', component: EditProfile, meta: { layout: 'user' } },
  { path: '/user/verify', component: VerifyUser, meta: { layout: 'user' } },
  { path: '/user/wallet', component: WalletUser, meta: { layout: 'user' } },
  { path: '/user/wallet/gold', component: () => import('./page/user/GoldDetail.vue'), meta: { layout: 'user' } },
  { path: '/user/wallet/silver', component: () => import('./page/user/SilverDetail.vue'), meta: { layout: 'user' } },
  { path: '/user/wallet/crypto', component: WalletCrypto , meta: { layout: 'user' } },
  { path: '/user/history', component: HistoryUser, meta: { layout: 'user' } },
  { path: '/user/gold', component: GoldUser, meta: { layout: 'user' } },
  { path: '/user/silver', component: SilverUser, meta: { layout: 'user' } },
  { path: '/user/ref', component: RefUser, meta: { layout: 'user' } },
  { path: '/user/notification', component: NotifUser, meta: { layout: 'user' } },
  { path: '/user/support', component: SupportUser, meta: { layout: 'user' } },
  { path: '/user/sendsupport', component: SupportSend, meta: { layout: 'user' } },
  { path: '/user/supportmessages', component: SupportMessages, meta: { layout: 'user' } },
  { path: '/user/withdrawal', component: WithdrawalUser, meta: { layout: 'user' } },
  { path: '/user/card', component: CardUser, meta: { layout: 'user' } },
  { path: '/user/deposit', redirect: '/user/card' },
  { path: '/user/assets', component: AssetsUser, meta: { layout: 'user' } },
  { path: '/user/game', component: FortuneWheel, meta: { layout: 'user' } },
  { path: '/user/loan', component: LoanUser, meta: { layout: 'user' } },
  { path: '/user/pledge', component: PledgeUser, meta: { layout: 'user' } },
  { path: '/user/charity', component: CharityUser, meta: { layout: 'user' } },
  { path: '/user/transfer', component: TransferUser, meta: { layout: 'user' } },
  { path: '/user/trading-bot', component: TradingBot, meta: { layout: 'user' } },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 16 };
    }

    return { top: 0 };
  },
});






// chack router

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const needUserLayout = to.meta.layout === 'user';

  if (needUserLayout && !token) {
    return next('/login');
  }

  next();
});


router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.layout === 'admin') {
    if (!token) {
      return next('/login');
    }

    try {
      const { data } = await axios.get(`${url}/user/profile`);

      if (data.user.role !== 'ADMIN' && data.user.role !== 'admin') {
        return next('/');
      }
    } catch (err) {
      console.log(err);
      return next('/login');
    }
  }

  next();
});


// app.use(router);
export default router;
