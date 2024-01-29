import AxiosMockAdapter from 'axios-mock-adapter';

import axios from './axios';
// import axios from '@services/request';

// ==============================|| AXIOS - MOCK ADAPTER ||============================== //

const services = new AxiosMockAdapter(axios, { delayResponse: 0 });
export default services;
