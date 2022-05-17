import { createApp } from 'vue'
import App from './App.vue'
import './style.scss'
import 'v-calendar/dist/style.css'

createApp(App).mount('#app').$nextTick(window.removeLoading)

console.log('fs', window.fs)
console.log('ipcRenderer', window.ipcRenderer)
