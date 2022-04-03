import React, { useState, useEffect, useContext } from 'react';
import './collectionFungic.css';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import TableFungic from '../../components/TableFungic';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import api from '../../services/api';
import { AuthContext } from '../../contexts/auth';
import CircularIndeterminate from '../../components/CircularProgress';


export default function CollectionFungic() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('COLÔNIAS FÚNGICAS');
  const [visible, setVisible] = useState(true);
  const [offSearch, setOffSearch] = useState(true);
  const [dataFungic, setDataFungic] = React.useState([]);
  const [loading, setLoading] = useState(false);


  async function getFungic(){
    setLoading(true);
    try{
      const response = await api.get('/fungos',{
        headers:{
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });
  
      const result = response.data;
      setDataFungic(result.reverse());
      setLoading(false);
    }
    catch(error){
      setLoading(false);
      alert('Erro na listagem de coleções fúngicas, verifique sua conexão com a internet.')
      console.log(error);
    }
  }

  useEffect(()=> {
    getFungic();
  }, [])


  return (
    <div className="containerFungic">
      <Header title={title} visible={visible} offSearch={offSearch} setDataFungic={setDataFungic} />
      {!dataFungic &&
          <span>Não existem coleções fúngicas cadastradas no momento.</span> 
      }
      <div className='containerTable'>
      {loading ?
        <CircularIndeterminate />
        :
        <TableFungic dataFungic={dataFungic} getFungic={getFungic}/>
      }
      </div>
      <div className='areaButton'>
        <Link to='/adicao-fungica'>
          <Button id="btnAdd" variant="contained"> 
            <AddCircleIcon />
          </Button>
        </Link>
      </div>
    </div>
  )
}
 
