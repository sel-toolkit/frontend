import { MessagePlugin } from 'tdesign-vue-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error) => {
    const message = error instanceof Error ? error.message : String(error)
    MessagePlugin.error(message)
  }

  window.addEventListener('unhandledrejection', (event) => {
    const message =
      event.reason instanceof Error ? event.reason.message : String(event.reason)
    MessagePlugin.error(message)
  })
})
