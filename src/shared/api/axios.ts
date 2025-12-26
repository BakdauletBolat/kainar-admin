import axios from 'axios';
import {useUserStore as useAuthStore} from "@entities/user";
import {useRouter} from "vue-router";


const axiosIns = axios.create({
baseURL: 'https://back-kaynar.kz',
timeout: 10000,
})

axiosIns.interceptors.request.use((config)=>{
	const token = localStorage.getItem("auth-token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
})

axiosIns.interceptors.response.use(response=>{
	if (response.status == 500) {
		throw new Error(response.data)
	}
	return response;
}, error => {
	if (error.status === 403 || error.status === 401) {
		const authStore = useAuthStore()
		const router = useRouter()
		authStore.logout(router);
	}
	return Promise.reject(error)
})

export default axiosIns;
