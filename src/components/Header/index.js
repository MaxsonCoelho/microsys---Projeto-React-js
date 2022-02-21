import React, { useState, useContext, useEffect } from 'react';
import './header.css';
import profile from '../../assets/perfil-pronto.png';
import { Link, useHistory } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Search from '../Search';
import { AuthContext } from '../../contexts/auth';


export default function Header({ title, visible, offSearch, setDataFungic, setDataBactery }) {

    let history = useHistory();
    const { signOut } = useContext(AuthContext);

    const [menuProfile, setMenuProfile] = useState(false);
    

    return (
        <div className="header">
            {visible && 
                <div onClick={()=> history.push("home")} className='areaBack'>
                    <ArrowBackIosIcon className='back'/>
                </div>}
            <h2>{title}</h2>
            {offSearch === true &&
                <Search setDataFungic={setDataFungic} setDataBactery={setDataBactery}/>
            }
            <div className="profile" onClick={()=> menuProfile ? setMenuProfile(false) : setMenuProfile(true)}>
                <span>usuário</span>
                <img src={profile} alt="profile" />
            </div>
            {menuProfile && 
                <nav className="menuNav">
                    <ul>
                    <Link to='/profile/' ><li>Meu Perfil</li></Link>
                        <li onClick={()=>signOut()}>Sair</li>
                    </ul>
                </nav>
            }
        </div>
    )

}