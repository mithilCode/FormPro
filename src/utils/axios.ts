import axios from 'axios';

const { API_BASE } = process.env;

const axiosServices = axios.create({
	baseURL: API_BASE,
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 100000
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.response.use(
	response => response,
	error => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;
