import React, { useState, useEffect, useContext } from 'react'
import './gerencyUsers.css';
import Header from '../../components/Header';
import Button from '@mui/material/Button';
import api from '../../services/api';
import ProgressBar from '../../components/ProgressBar';
import { AuthContext } from '../../contexts/auth';
import TableUser from '../../components/TableUser';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VersionApp from '../../components/VersionApp';



export default function GerencyUsers() {
  const { setDataListUsers, token } = useContext(AuthContext);
  const [title, setTitle] = useState('GERÊNCIAMENTO DE USUÁRIOS');
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [master, setMaster] = useState(false);
  const [buttonMobileVisible, setButtonMobileVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = React.useState(false);
  const [offSearch, setOffSearch] = useState(false);

  const objInputs = {
    name: setName,
    email: setEmail,
    master: setMaster,
    active: setActive,
    id: setUserId
  }

  async function addUser(){
    
    if(!name || !email){
      alert('Preencha os campos corretamente!');
      return
    }
      
    setLoading(true);

    try{
      api.defaults.headers.common.Authorization = 'Bearer ' + token;
      await api.post('/users', {
        name: name,
        email: email,
        master: master,
      });

      setLoading(false);
      listUsers();
      setName('');
      setEmail('');
      setMaster(false);
      setActive(false);
      alert('Usuário cadastrado com sucesso!');
    }
    catch(error){
      alert('Erro ao adicionar usuário, verifique sua conexão com a internet.')
      console.log(error);
    }
  }

  async function editUser(){

    try{
      const body ={
        name: name,
        email: email,
        master: master
      }
      await api.patch(`/users/${userId}`, body,{
        headers:{
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });
  
        setLoading(false);
        listUsers();
        setName('');
        setEmail('');
        setMaster(false);
        setActive(false);
        setButtonMobileVisible(false);
        alert('Usuário atualizado com sucesso!');
        listUsers();
    }
    catch(error){
      alert('Erro de requizição ao tentar atualizar usuário, verifique sua internet!')
      console.log(error);
    }

  }

  async function removeUser(item){

    try{
      await api.delete(`/users/${item.id}`, {
        data: {foo: 'bar'},
        headers:{
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });
  
      setName('');
      setEmail('');
      setMaster(false);
      setActive(false);
      setButtonMobileVisible(false);
      alert('Usuário removido com sucesso!');
      listUsers();
    }
    catch(error){
      alert('Erro ao tentar excluir usuário, verifique sua conexão com a internet!');
      console.log(error);
    }
  }

  function selectMaster(){
    !master ? setMaster(true) : setMaster(false);
  }

  function selectActive(){
    !active ? setActive(true) : setActive(false);
  }

  function backEdit(){
    setButtonMobileVisible(false);
    setName('');
    setEmail('');
    setMaster(false);
    setActive(false);
    setUserId('');
  }

  async function listUsers(){
    setLoading(true);
    
    try{
      const response = await api.get('/users', {
        headers:{
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      })
  
      let res = [];
      res = response.data;
      
      const newArrayFilter = res.filter(function(user) {
        return user.type !== 'internal'
      });
  
      const reverseList = newArrayFilter.reverse();
      setDataListUsers(reverseList);
      setData(reverseList);
      setLoading(false);  
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(()=> {
    listUsers();
  }, [])

  return (
    <div className="containerUser">
      <Header title={title} visible={visible} offSearch={offSearch}/>
      <div className='areaFormularyAll' style={{ justifyContent: buttonMobileVisible ?  'center' : 'space-around'}}>
        {buttonMobileVisible &&
            <div onClick={backEdit}>
            <ArrowBackIosIcon id='arrow'/>
          </div>
        }
        <div className='areaFormularyAdd'>
          <div className='smallAreaUsers'>
            <span>Nome:</span>
            <input type="text" name="name" id="input" value={name} onChange={e=> setName(e.target.value)}/>
          </div>
          <div className='smallAreaUsers'>
            <span>E-mail:</span>
            <input type="text" name="email" id="input" value={email} onChange={e=> setEmail(e.target.value)}/>
          </div>
          <div className='smallAreaCheckBox'>
            <span>Administrador:</span>
            <input type="checkbox" value={master} checked={master} name="adm" onClick={selectMaster}/>
          </div>
          <div className='smallAreaCheckBox'>
            <span>Ativar</span>
            <input type="checkbox" value={active} checked={active} name="active" onClick={selectActive}/>
          </div>
          {loading ?
            <ProgressBar />
          :
            <>
              {!buttonMobileVisible ?
                <Button onClick={addUser} id="btnRegisterUse" variant="contained"> 
                  Cadastrar
                </Button>
              :
                <Button onClick={editUser} id="btnRegisterUse" variant="contained"> 
                  Atualizar
                </Button>
              }
            </>
          }
        </div>
        {!buttonMobileVisible &&
          <div className='areaFomularyLis'>
            <TableUser objInputs={objInputs} removeUser={removeUser}  setButtonMobileVisible={setButtonMobileVisible} />
          </div>
        }
      </div>
      <VersionApp />
    </div>
  )
}
 