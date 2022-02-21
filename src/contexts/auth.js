import React, { useState, createContext, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataListUsers, setDataListUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [token, setToken] = useState('')
    const [master, setMaster] = useState(false);

    async function auth(email, password){

        setLoading(true);
        try {
            const credentials = {
              email: email,
              password: password,
            }
      
            const application = {
              applicationId: "82d2ddd0-593c-11ec-aac1-d1c56c82bf33" || "82d10910-593c-11ec-aac1-d1c56c82bf33"
            }
      
            delete api.defaults.headers.common.Authorization;
      
            const response = await api.post('/token/guest', application)
              .catch((err => {
                console.log(err.response);
              }))
      
            const tokenGuest = 'Bearer ' + response.data.accessToken;
      
            api.defaults.headers.common.Authorization = tokenGuest;
      
            const responseUser = await api.post('/token/login', credentials);
      
            const tokenLogin = responseUser.data.accessToken;
            setToken(tokenLogin);
            await localStorage.setItem('token', tokenLogin);
            api.defaults.headers.common.Authorization = 'Bearer ' + tokenLogin;
           const user = responseUser.data;
           storage(user);
           setUser(user);
           setLoading(false);
            if(user && user.master === true) {
              setMaster(true);
            }else if(user && user.master === false){
              setMaster(true);
            }else {
              setLoading(false);
              setErrorMessage('Usuário não permitido');
            }
          } catch (err) {
            console.log("OUTRO ERRO: " + err);
            setLoading(false);
          }
    }

    function storage(data){
        localStorage.setItem('@user', JSON.stringify(data));
    }

      //Logout do usuario
    async function signOut(){
      setUser(null);
      setMaster(false);
      localStorage.removeItem('@user');
      setUser(null);
    }

    useEffect(()=>{

      async function loadStorage(){
        const storageUser = await localStorage.getItem('@user');
        const token = await localStorage.getItem('token');

        if(storageUser && token){
          const storage = JSON.parse(storageUser);
          const tokenUser = token;
          setToken(tokenUser);
          setUser(storage);
          setLoading(false);
          setMaster(storage.master);

        }
        
        setLoading(false);
        return
      }
      
      loadStorage();
  
    }, [])


    return(
        <AuthContext.Provider value={{ signed: !!user, user, 
        loading, setLoading, auth, master, signOut, dataListUsers, setDataListUsers, token }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;