<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { XIcon } from 'lucide-vue-next'
import { cn } from '../../lib/utils'

const props = defineProps<{
  open: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}>()

const emit = defineEmits(['close'])

const modalRef = ref<HTMLDivElement | null>(null)
const isOpen = ref(props.open)

watch(() => props.open, (newVal) => {
  isOpen.value = newVal
  if (newVal) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

const handleClose = () => {
  emit('close')
}

const handleClickOutside = (event: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
    handleClose()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  if (isOpen.value) {
    document.body.classList.add('overflow-hidden')
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  document.body.classList.remove('overflow-hidden')
})

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full'
}
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div 
          ref="modalRef" 
          :class="[
            'bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full overflow-hidden',
            sizeClasses[size || 'md']
          ]"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <div>
              <h2 v-if="title" class="text-lg font-semibold dark:text-white">{{ title }}</h2>
              <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400">
                {{ description }}
              </p>
            </div>
            <button 
              @click="handleClose" 
              class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close"
            >
              <XIcon class="h-5 w-5 dark:text-gray-400" />
            </button>
          </div>
          <div class="p-4 dark:text-gray-200">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="p-4 border-t dark:border-gray-700">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
