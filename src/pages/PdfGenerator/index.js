import React, { useState, useEffect, useContext } from 'react'
import './pdfGenerator.css';
import Header from '../../components/Header';
import Button from '@mui/material/Button';
import api from '../../services/api';
import ProgressBar from '../../components/ProgressBar';
import { AuthContext } from '../../contexts/auth';
import TableUser from '../../components/TableUser';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


export default function PdfGenerator() {
  const { setDataListUsers, token } = useContext(AuthContext);
  const [title, setTitle] = useState('GERÊNCIAMENTO DE USUÁRIOS');
  const [visible, setVisible] = useState(true);
  const [offSearch, setOffSearch] = useState(false);


  

  // async function listUsers(){
  //   setLoading(true);
    
  //   try{
  //     const response = await api.get('/users', {
  //       headers:{
  //         'Content-type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //         'Accept': '*/*'
  //       }
  //     })
  
  //     let res = [];
  //     res = response.data;
      
  //     const newArrayFilter = res.filter(function(user) {
  //       return user.type !== 'internal'
  //     });
  
  //     const reverseList = newArrayFilter.reverse();
  //     setDataListUsers(reverseList);
  //     setData(reverseList);
  //     setLoading(false);  
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // }

  // useEffect(()=> {
  //   listUsers();
  // }, [])

  return (
    <div className="containerUser">
      <Header title={title} visible={visible} offSearch={offSearch} />
      <div className='areaFormularyAll'>
        
        <div className='areaFormularyAdd'>
          <div className='smallAreaUsers'>
            <span>Nome:</span>
        
          </div>
          <div className='smallAreaUsers'>
            <span>E-mail:</span>
            
          </div>
          <div className='smallAreaCheckBox'>
            <span>Administrador:</span>
            
          </div>
          <div className='smallAreaCheckBox'>
            <span>Ativar</span>
            
          </div>
          

        </div>
        

      </div>
    </div>
  )
}
 