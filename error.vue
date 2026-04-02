<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col">
    <!-- Top half: background image -->
    <div class="h-1/2 w-full overflow-hidden">
      <img
        src="~/assets/image/404_bg.webp"
        alt="404 background"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- Bottom half: text content -->
    <div class="h-1/2 w-full flex flex-col px-6 overflow-y-auto">
      <template v-if="error?.statusCode === 404">
        <h1 class="text-[3.375rem] mobile:text-[2.25rem] small-mobile:text-xl landscape-phone:text-lg font-bold text-gray-900 text-center pt-16 mobile:pt-12 small-mobile:pt-2 landscape-phone:pt-1">404 頁面不存在</h1>
        <div class="flex-1 flex flex-col items-center justify-center gap-6 small-mobile:gap-2 landscape-phone:gap-1">
          <p class="text-2xl mobile:text-xl small-mobile:text-base landscape-phone:text-sm font-bold text-gray-800 text-center">
            我們有個『喵』題......
          </p>
          <p class="text-base mobile:text-sm small-mobile:text-xs landscape-phone:text-xs text-gray-500 text-center leading-relaxed">
            看來你跟我一樣，都漂流到沒有罐罐的維度了。
          </p>
          <t-button theme="primary" class="mt-auto mb-4" @click="handleGoHome">回到首頁</t-button>
        </div>
      </template>
      <template v-else>
        <div class="flex-1 flex flex-col items-center justify-center gap-4 mb-2">
          <h1 class="text-6xl font-bold text-red-500">{{ error?.statusCode }}</h1>
          <p class="text-lg text-gray-600 text-center">{{ error?.message }}</p>
          <t-button theme="primary" class="pb-4" @click="handleGoHome">回到首頁</t-button>
        </div>
      </template>
    </div>

    <!-- Floating cat: covers entire screen -->
    <img
      v-if="error?.statusCode === 404"
      ref="catRef"
      src="~/assets/image/404_cat.webp"
      alt="floating cat"
      draggable="false"
      class="fixed select-none"
      :style="catStyle"
      @dragstart.prevent
      @mousedown="handleDragStart"
      @touchstart.prevent="handleTouchStart"
    >
  </div>
</template>

<script setup lang="ts">
import { useRafFn } from '@vueuse/core'
import type { NuxtError } from '#app'
import {
  BREAKPOINT_MOBILE,
  BREAKPOINT_TABLET,
  CAT_SIZE_MOBILE,
  CAT_SIZE_TABLET,
  CAT_SIZE_DESKTOP,
} from '~/config/error_page'

defineProps({
  error: {
    type: Object as () => NuxtError,
    default: null,
  },
})

const handleGoHome = () => clearError({ redirect: '/' })

const CAT_SIZE = computed(() => {
  const w = window.innerWidth
  if (w <= BREAKPOINT_MOBILE) return CAT_SIZE_MOBILE
  if (w <= BREAKPOINT_TABLET) return CAT_SIZE_TABLET
  return CAT_SIZE_DESKTOP
})
const ROTATION_SPEED = 0.4
const DRAG_ROTATION_SPEED = 2.5
const MAX_THROW_SPEED = 20
const VELOCITY_SAMPLES = 5

const catRef = ref<HTMLImageElement | null>(null)
const x = ref(200)
const y = ref(200)
const vx = ref(1.5)
const vy = ref(1.05)
const rotation = ref(0)
const isDragging = ref(false)

type PositionSample = { x: number; y: number; t: number }
const samples: PositionSample[] = []

const catStyle = computed(() => ({
  width: `${CAT_SIZE.value}px`,
  height: `${CAT_SIZE.value}px`,
  transform: `translate(${x.value}px, ${y.value}px) rotate(${rotation.value}deg)`,
  top: '0',
  left: '0',
  cursor: isDragging.value ? 'grabbing' : 'grab',
}))

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

useRafFn(() => {
  if (isDragging.value) return

  const maxX = window.innerWidth - CAT_SIZE.value
  const maxY = window.innerHeight - CAT_SIZE.value

  x.value += vx.value
  y.value += vy.value
  rotation.value += ROTATION_SPEED

  if (x.value <= 0) {
    x.value = 0
    vx.value = Math.abs(vx.value)
  } else if (x.value >= maxX) {
    x.value = maxX
    vx.value = -Math.abs(vx.value)
  }

  if (y.value <= 0) {
    y.value = 0
    vy.value = Math.abs(vy.value)
  } else if (y.value >= maxY) {
    y.value = maxY
    vy.value = -Math.abs(vy.value)
  }
})

const recordSample = (clientX: number, clientY: number) => {
  samples.push({ x: clientX, y: clientY, t: performance.now() })
  if (samples.length > VELOCITY_SAMPLES) samples.shift()
}

const computeThrowVelocity = () => {
  if (samples.length < 2) return { vx: 1.5, vy: 1.05 }

  const first = samples[0]
  const last = samples[samples.length - 1]
  const dt = (last.t - first.t) / 16 // normalize to ~60fps frames

  if (dt === 0) return { vx: 0, vy: 0 }

  return {
    vx: clamp((last.x - first.x) / dt, -MAX_THROW_SPEED, MAX_THROW_SPEED),
    vy: clamp((last.y - first.y) / dt, -MAX_THROW_SPEED, MAX_THROW_SPEED),
  }
}

let dragOffsetX = 0
let dragOffsetY = 0
const dragRafId = 0

const handleDragMove = (clientX: number, clientY: number) => {
  recordSample(clientX, clientY)
  x.value = clamp(clientX - dragOffsetX, 0, window.innerWidth - CAT_SIZE.value)
  y.value = clamp(clientY - dragOffsetY, 0, window.innerHeight - CAT_SIZE.value)
  rotation.value += DRAG_ROTATION_SPEED
}

const handleDragEnd = () => {
  isDragging.value = false
  cancelAnimationFrame(dragRafId)

  const thrown = computeThrowVelocity()
  vx.value = thrown.vx
  vy.value = thrown.vy
  samples.length = 0

  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
}

const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY)
const onMouseUp = () => handleDragEnd()
const onTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
}
const onTouchEnd = () => handleDragEnd()

const handleDragStart = (e: MouseEvent) => {
  isDragging.value = true
  dragOffsetX = e.clientX - x.value
  dragOffsetY = e.clientY - y.value
  samples.length = 0
  recordSample(e.clientX, e.clientY)

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  dragOffsetX = e.touches[0].clientX - x.value
  dragOffsetY = e.touches[0].clientY - y.value
  samples.length = 0
  recordSample(e.touches[0].clientX, e.touches[0].clientY)

  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('touchend', onTouchEnd)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
})
</script>
