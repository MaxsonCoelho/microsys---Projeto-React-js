import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import './profile.css';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import KeyIcon from '@mui/icons-material/Key';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { AuthContext } from '../../contexts/auth';
import VersionApp from '../../components/VersionApp';

export default function Profile(){
    let history = useHistory();
    const { token } = useContext(AuthContext);
    const [userData, setUserData] = useState('');
    const [editName, setEditName] = useState('');
    const [editMail, setEditMail] = useState('');
    const [editNameInput, setEditNameInput] = useState(false);
    const [editMailInput, setEditMailInput] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [typeInput, setTypeInput] = useState('password');
    const [typeInputNewPassword, setTypeInputNewPassword] = useState('password');
    const [typeInputConfirmPassword, setTypeInputConfirmPassword] = useState('password');
    const [areaPassword, setAreaPassword] = useState(false);


    function backHome(){
        history.push('/home/');
      }

    function transformNameInput(){
        setEditNameInput(true);    
    }

    function transformEmailInput(){
        setEditMailInput(true);    
    }

    function editNameCancel(){
        setEditNameInput(false);    
    }

    function editMailCancel(){
        setEditMailInput(false);    
    }

    async function handleEdit(){
        try{
            const body ={
              name: editName,
              email: editMail
            }

            api.defaults.headers.common.Authorization = 'Bearer ' + token;
            await api.patch(`/me`, body);

            if(editNameInput === true){
                setEditNameInput(false);
            }else {
                setEditMailInput(false);
            }

            getInfoProfile();
          }
          catch(error){
            alert('Erro ao tentar atualizar perfil, o email ultilizado já existe!')
            console.log(error);

          }
    }

    function transformPasswordInput(){
        setAreaPassword(true);
    }

    function transformCancelAreaPassword(){
        setAreaPassword(false);
    }

    async function handleNewPassword(){
        if(password === '' || newPassword === ''){
            alert('Preencha todos os campos para trocar de senha.');
            return
        }else if(confirmPassword !== newPassword){
            alert('Por favor insira a nova senha e a confirmação de senha iguais!');
            return
        }else if (confirmPassword.length < 6 || newPassword.length < 6){
            alert('Por favor insira uma senha com no mínimo 6 digitos !');
            return
        }

        try{
            const body ={
                password: password,
                newPassword: newPassword
              }
  
              api.defaults.headers.common.Authorization = 'Bearer ' + token;
              await api.patch(`/me/newPassword`, body);
              alert('Senha atualizada com sucesso!!!');
              setAreaPassword(false);
              setPassword('');
              setNewPassword('');
        }
        catch(error){
            alert('Erro ao tentar trocar senha, insira a sua senha corretamente!');
            console.log(`Erro ao requisitar atroca de senha "/me/newPassword" ${error}`);
        }
    }

    async function getInfoProfile(){
        try{
            const response = await api.get('/me', {
                headers:{
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
                }
            });
            const data = response.data;
            setUserData(data);
            setEditName(data.name);
            setEditMail(data.email);
        }
        catch(error){
            alert('Erro ao requisitar informações de perfil, verifique sua internet!')
            console.log(`Erro ao requisitar informações de perfil do servidor "/me" ${error}`);
        }
    }

    useEffect(()=> {
        getInfoProfile();
    }, [])

    return(
        <div className='containerProfile'>
            <div onClick={backHome}>
                <ArrowBackIosIcon id='arrow'/>
            </div>
            {!areaPassword ?
                <fieldset className='viewInfo'>
                <legend>Meu Perfil</legend>
                    
                    {editNameInput ?
                        <div className='areaInfo'>
                            <AssignmentIndIcon id='iconProfile'/>
                            <input value={editName} id='inputProfile' onChange={e=> setEditName(e.target.value)} type='text' alt='Mudar nome' />
                            <button onClick={handleEdit} id='buttonProfile'>Confirmar</button>
                            <button onClick={editNameCancel} id='buttonProfile'>Cancelar</button>
                        </div>
                    :
                        <div className='areaInfo'>
                            <AssignmentIndIcon id='iconProfile'/>
                            <label>{userData.name}</label>
                            <button onClick={transformNameInput} id='buttonProfile'>Editar</button>
                        </div>
                    }
                    {editMailInput ?
                        <div className='areaInfo'>
                            <EmailIcon id='iconProfile'/>
                            <input value={editMail} id='inputProfile' onChange={e=> setEditMail(e.target.value)} type='text' alt='Mudar e-mail' />
                            <button onClick={handleEdit} id='buttonProfile'>Confirmar</button>
                            <button onClick={editMailCancel} id='buttonProfile'>Cancelar</button>
                        </div>
                    :
                        <div className='areaInfo'>
                            <EmailIcon id='iconProfile'/>
                            <label>{userData.email}</label>
                            <button onClick={transformEmailInput} id='buttonProfile'>Editar</button>
                        </div>
                    }
                    <div className='areaInfo'>
                        <PersonIcon id='iconProfile'/>
                        <label>Usuário(a): {userData.type}</label>
                    </div>
                    <div className='areaInfo'>
                        <KeyIcon id='iconProfile'/>
                        <label><button onClick={transformPasswordInput} id='buttonAreaPassword'>Trocar de senha</button></label>
                    </div>
                </fieldset>
            :
                <fieldset className='viewInfo'>
                <legend>Troca de senha</legend>
                    <div className='areaInfo'>
                        <label>Senha:</label>
                        <input value={password} id='inputProfilePassword' onChange={e=> setPassword(e.target.value)} type={typeInput} alt='senha' />
                        <RemoveRedEyeIcon id='iconProfile' onClick={()=> typeInput === 'password' ? setTypeInput('text') : setTypeInput('password')}/>
                    </div>
                    <div className='areaInfo'>
                        <label>Nova senha:</label>
                        <input value={newPassword} id='inputProfilePassword' onChange={e=> setNewPassword(e.target.value)} type={typeInputNewPassword} alt='nova senha' />
                        <RemoveRedEyeIcon id='iconProfile' onClick={()=> typeInputNewPassword === 'password' ? setTypeInputNewPassword('text') : setTypeInputNewPassword('password')}/>
                    </div>
                    <div className='areaInfo'>
                        <label>Confirmar nova senha:</label>
                        <input value={confirmPassword} id='inputProfilePassword' onChange={e=> setConfirmPassword(e.target.value)} type={typeInputConfirmPassword} alt='confirmar senha' />
                        <RemoveRedEyeIcon id='iconProfile' onClick={()=> typeInputConfirmPassword === 'password' ? setTypeInputConfirmPassword('text') : setTypeInputConfirmPassword('password')}/>
                    </div>
                    <div className='areaInfo'>
                        <label><button onClick={handleNewPassword} id='buttonPassword'>Trocar de senha</button></label>
                        <label><button onClick={transformCancelAreaPassword} id='buttonPassword'>Cancelar</button></label>
                    </div>
                </fieldset>
            }
            <VersionApp />
        </div>
    )
}