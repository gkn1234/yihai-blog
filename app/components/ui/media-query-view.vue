<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'

const attrs = useAttrs()

const ssrWidth = useSSRWidth()

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth })
const isMobile = breakpoints.smaller('sm')

// 当前视图类型，用作 KeepAlive 的 key
const currentView = computed(() => isMobile.value ? 'mobile' : 'pc')

// 包装组件函数，为插槽内容创建可缓存的组件
function createViewComponent(slotFn: (() => any) | undefined, name: string) {
  if (!slotFn)
    return null

  return defineComponent({
    name,
    setup() {
      // 用一个 div 包裹插槽内容，确保有单一根元素
      return () => h('div', attrs, slotFn())
    },
  })
}

// 获取插槽
const slots = useSlots()

// 创建可缓存的视图组件
const PcView = computed(() =>
  createViewComponent(slots.default, 'DesktopView'),
)
const MobileView = computed(() =>
  createViewComponent(slots.mobile, 'MobileView'),
)

// 当前要渲染的组件
const CurrentView = computed(() => {
  if (isMobile.value) {
    return MobileView.value || PcView.value || null
  }
  else {
    return PcView.value || MobileView.value || null
  }
})
</script>

<template>
  <KeepAlive>
    <component
      :is="CurrentView"
      v-if="CurrentView"
      :key="currentView"
    />
  </KeepAlive>
</template>
