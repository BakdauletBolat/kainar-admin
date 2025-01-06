import axios from 'axios';

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
})

export default axiosIns;
