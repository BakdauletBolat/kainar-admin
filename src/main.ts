import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@app/router';
import {createPinia} from "pinia";


const app = createApp(App);

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

app.use(createPinia())
app.use(router);
app.mount('#app');