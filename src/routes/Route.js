import React, { useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import { Route, Redirect } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

export default function RouteWrapper({
    component: Component,
    isPrivate,
    ...rest
}){
    const { signed, loading } = useContext(AuthContext);

    if(loading){
        return(
            <ProgressBar />
        )
    }

    if(!signed && isPrivate){
        return <Redirect to='/' />
    }

    if(signed && !isPrivate){
        return <Redirect to='/home/' />
    }

    

    return(
        <Route 
            {...rest}
            render={ props => (
                <Component {...props} />
            )}
            />
    )
}