import React from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.labmicrocba.com.br/microsys', //BaseUrl server
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json; charset=utf-8'
  },
})

api.interceptors.response.use(
  response => {
    // Do something with response data
    return response
  },
  error => {
    // Do something with response error
    // You can even test for a response code
    // and try a new request before rejecting the promise
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
