import React, { useState, useEffect, useContext } from 'react';
import './report.css';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import TableBactery from '../../components/TableBactery';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import api from '../../services/api';
import { AuthContext } from '../../contexts/auth';
import CircularIndeterminate from '../../components/CircularProgress';
import { MicroContext } from '../../contexts/microorganismos';


export default function Report() {
  const { token } = useContext(AuthContext);
  const { setActiveDeletePhotos } = useContext(MicroContext);
  const [title, setTitle] = useState('RELATÓRIOS');
  const [visible, setVisible] = useState(true);
  const [offSearch, setOffSearch] = useState(false);
  const [dataBactery, setDataBactery] = React.useState([]);
  const [loading, setLoading] = useState(false);

  async function getBactery(){
    setLoading(true);
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
      setLoading(false);
    }
    catch(error){
      setLoading(false);
      alert('Erro na listagem de coleções bacterianas, verifique sua conexão com a internet.')
      console.log(error);
    }
  }

  useEffect(()=> {
    setActiveDeletePhotos(true);
    getBactery();
  }, [])

  return (
    <div className="containerAll">
      <Header title={title} visible={visible} offSearch={offSearch} setDataBactery={setDataBactery}/>
      <div className='containerTableBactery'>
        
      {loading ?
        <CircularIndeterminate />
        :
        <TableBactery dataBactery={dataBactery} getBactery={getBactery}/>
      }
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
 