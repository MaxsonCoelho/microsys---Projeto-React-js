import React from 'react';
import axios from 'axios';

const prod = 'https://api.labmicrocba.com.br/microsys'
const dev = 'http://localhost:5002'

const api = axios.create({
  baseURL: prod, //BaseUrl server
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json; charset=utf-8'
  },
})

api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (
      error.request._hasError === true &&
      error.request._response.includes('connect')
    ) {
      React.Alert.alert(
        'Aviso',
        'Não foi possível conectar aos nossos servidores, sem conexão a internet',
        [ { text: 'OK' } ],
        { cancelable: false },
      )
    }
    if(error.response.status === 403 ){
    }

    if (error.response.status === 401) {
      const requestConfig = error.config
      return axios(requestConfig)
    }

    return Promise.reject(error)
  },
)

export default api;
