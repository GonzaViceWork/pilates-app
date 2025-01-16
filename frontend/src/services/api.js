import axios from 'axios';

const api = axios.create({
    baseURL: '/api/', // Esto utiliza el proxy configurado en package.json
});

export default api;