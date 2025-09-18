import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import TrainingView from '../views/TrainingView.vue'
import VideosView from '../views/VideosView.vue'
import SupportView from '../views/SupportView.vue'
import ScanQRView from '../views/ScanQRView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/scan-qr',
    name: 'ScanQR',
    component: ScanQRView
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: ProductView,
    props: true
  },
  {
    path: '/training/:productId',
    name: 'Training',
    component: TrainingView,
    props: true
  },
  {
    path: '/videos/:programId',
    name: 'Videos',
    component: VideosView,
    props: true
  },
  {
    path: '/support',
    name: 'Support',
    component: SupportView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router