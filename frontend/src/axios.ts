
import axios from 'axios';

// URL address API
const instance = axios.create({
  baseURL: 'http://localhost:8000/api/', // Laravel API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
