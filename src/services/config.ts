import axios from 'axios';

// const URL_BASE = 'https://harmony-production-ff6ebeae2992.herokuapp.com/';
const URL_BASE = 'https://harmony-api-prod-4a08fe78d33b.herokuapp.com/';

const HarmonyApi = axios.create({
  baseURL: URL_BASE,
});

export default HarmonyApi;
