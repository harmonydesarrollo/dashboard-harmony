import axios from 'axios';

// const URL_BASE = process.env.API_URL_BASE;
const URL_BASE = 'https://harmony-dev-mob-58cd4e713b6a.herokuapp.com/';

const HarmonyApi = axios.create({
  baseURL: URL_BASE,
});

export default HarmonyApi;
