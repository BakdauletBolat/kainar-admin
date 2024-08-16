import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routers';


const app = createApp(App);

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)


app.use(router);
app.mount('#app');