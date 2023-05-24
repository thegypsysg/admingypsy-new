import axios from 'axios';

// Atur base URL API
axios.defaults.baseURL = 'https://admin1.the-gypsy.sg/api';

// Fungsi untuk mengatur header Authorization
export function setAuthHeader(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios;
