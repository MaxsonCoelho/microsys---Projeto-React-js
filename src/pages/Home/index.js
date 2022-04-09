import React, { useState, useContext } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';
import VersionApp from '../../components/VersionApp';


export default function Home({isPrivate}) {

  const { user, master } = useContext(AuthContext);

  const [title, setTitle] = useState('GERÊNCIAMENTO MICROORGANISMOS');
  const [backVisible, setBackVisible] = useState(false);

  if(isPrivate){
    return(
      <div>
        <h1>Página privada, faça login</h1>
      </div>
    )
  }else {
    return (

      <div className="container">
        <Header title={title} backVisible={backVisible}/>
        <div className="groupButtons">
          <Link to='/colecao-bacteriana' >
            <button >
              COLEÇÃO BACTERIANA
            </button>
          </Link>
          <Link to='/colecao-fungica' >
            <button >
              COLEÇÃO FÚNGICA
            </button>
          </Link>
          <Link to='/report' >
            <button >
              RELATÓRIOS
            </button>
          </Link>
          {master === true &&
            <Link to='/gerenciamento-de-usuarios' >
              <button >
                GERÊNCIA DE USUÁRIOS
              </button>
            </Link>
          }
        </div>
        <VersionApp />
      </div>
    )
  }

}
 
