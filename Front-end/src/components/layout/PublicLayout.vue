<template>
  <div class="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-between">
    <Navbar />
    
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Global Alert Modal -->
    <Modal :show="alertStore.isOpen" :title="alertStore.title" @close="alertStore.closeAlert" maxWidth="sm" :theme="alertStore.theme">
      <div class="flex flex-col gap-4 text-left">
        <p class="text-brand-slate text-sm font-body">
          {{ alertStore.message }}
        </p>
        <div class="flex gap-3 pt-2 justify-end">
          <Button variant="primary" class="px-6" @click="alertStore.closeAlert">OK</Button>
        </div>
      </div>
    </Modal>
  </div>
  <Footer />
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()
</script>

<style>
/* Page transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
