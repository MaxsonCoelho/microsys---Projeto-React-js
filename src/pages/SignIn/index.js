import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './signin.css';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../contexts/auth';
import { LinearProgress } from '@mui/material';
import VersionApp from '../../components/VersionApp';

export default function SignIn() {

  const { auth, loading, setLoading } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);


  async function signIn(){

    if (email.length === 0 && password.length === 0)
      return alert('Preencha os campos!')
    if (email.length === 0)
      return alert('Digite seu e-mail!')
    if (password.length === 0)
      return alert('Digite sua senha!')
    
    setLoading(true);
    await auth(email, password);
    setLoading(false);
    setErrorMessage('Usuário/senha incorretos');

  }

    return (
      <div className="container">
        <div className="signin">
          <div className="area-login">
            <h1>MICROSYS</h1>
            <img src={logo} alt="Sistema Logo" />
          </div>
          <div className="form">
            <input type="text" id='inputSignIn' placeholder="usuário" value={email} onChange={e=> setEmail(e.target.value)}/>
            <input type="password" id='inputSignIn' placeholder="*********" value={password} onChange={e=> setPassword(e.target.value)}/>
            <button onClick={signIn} className="btn-acess" type="submit" >
            {loading ? 
              <LinearProgress />
             :
              'Entrar'
            }
            </button>
          </div>
          {/* <Link to="/register">Esqueceu sua senha ?</Link> */}
        </div>
        <VersionApp />
      </div>
    );
  }
  