import React, { useState, useContext } from 'react';
import './search.css';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../services/api';
import { AuthContext } from '../../contexts/auth';

export default function Search({ setDataFungic, setDataBactery }) {
    const { token } = useContext(AuthContext);
    const [search, setSearch] = useState('');

    async function searchFunction(){

        try{
          
          if(setDataFungic){
            const response = await api.get(`/fungos/search?q=${search}`,{
              headers:{
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
              }
            });
        
            let result = response.data;
            setDataFungic(result.reverse());
          }else if(setDataBactery){
            const response = await api.get(`/bacterias/search?q=${search}`,{
              headers:{
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
              }
            });
        
            let result = response.data;
            setDataBactery(result.reverse());
          }
        }
        catch(error){
          alert('Erro na listagem de coleções fúngicas, verifique sua conexão com a internet.')
          console.log(error);
        }
    }


    return (
        <div id="divBusca">
            <input type="text" id="txtBusca" onChange={e => setSearch(e.target.value)} placeholder="Buscar..."/>
            <SearchIcon id="search" onClick={searchFunction} />  
        </div>
    )

}