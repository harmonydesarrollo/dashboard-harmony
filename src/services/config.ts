import axios from 'axios';

// const URL_BASE = process.env.API_URL_BASE;
const URL_BASE = 'https://dev-harmony-05492453a3dd.herokuapp.com/';

const HarmonyApi = axios.create({
  baseURL: URL_BASE,
});

export default HarmonyApi;
