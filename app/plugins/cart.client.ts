export default defineNuxtPlugin(() => {
  useCartStore().load()
})
