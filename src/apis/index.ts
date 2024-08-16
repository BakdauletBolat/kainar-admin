import axios from 'axios';

const axiosIns = axios.create({
baseURL: 'https://back-kaynar.kz',
timeout: 10000,
})


	export default axiosIns;
