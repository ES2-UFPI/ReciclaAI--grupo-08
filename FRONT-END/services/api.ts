import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8000
    headers: {
        'Content-Type': 'application/json',
    },
    // Opcional: tempo limite de 10 segundos
    timeout: 10000, 
});

export default api;