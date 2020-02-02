import axios from 'axios';

const api = axios.create({
    baseURL: 'https://www.sistemas.dftrans.df.gov.br'
});

export default api;