import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'






const app = createApp(App)

app.config.globalProperties.$colorObj = [
  { name: '优',value:'#91cd77',icon:'d'},
  { name: '良', value: '#f0c854',icon:'c'} ,
  { name: '中', value: '#fc8251' ,icon:'b'},
  { name: '差', value: '#ff6f71',icon:'a'} 
]
app.use(ElementPlus).mount("#app");

