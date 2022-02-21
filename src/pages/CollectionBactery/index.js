import React, { useState, useEffect, useContext } from 'react';
import './collectionBactery.css';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import TableBactery from '../../components/TableBactery';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import api from '../../services/api';
import { AuthContext } from '../../contexts/auth';
import VersionApp from '../../components/VersionApp';


export default function CollectionBactery() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('COLÔNIAS BACTERIANAS');
  const [visible, setVisible] = useState(true);
  const [offSearch, setOffSearch] = useState(true);
  const [dataBactery, setDataBactery] = React.useState([]);

  async function getBactery(){

    try{
      const response = await api.get('/bacterias',{
        headers:{
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });
  
      const result = response.data;
      setDataBactery(result.reverse());
    }
    catch(error){
      alert('Erro na listagem de coleções bacterianas, verifique sua conexão com a internet.')
      console.log(error);
    }
  }

  useEffect(()=> {
    getBactery();
  }, [])

  return (
    <div className="containerAll">
      <Header title={title} visible={visible} offSearch={offSearch} setDataBactery={setDataBactery}/>
      {!dataBactery &&
          <span>Não existem coleções bacterianas cadastradas no momento.</span> 
      }
      <div className='containerTableBactery'>
        <TableBactery dataBactery={dataBactery} getBactery={getBactery}/>
      </div>
      <div className='areaButton'>
        <Link to='/adicao-bacteriana'>
          <Button id="btnAdd" variant="contained"> 
            <AddCircleIcon />
          </Button>
        </Link>
      </div>
    </div>
  )
}
 