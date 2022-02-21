import React, { useState, createContext } from 'react';

export const MicroContext = createContext({});

function MicroProvider({children}){
    const [loading, setLoading] = useState(true);
    const [dataListMicro, setDataListMicro] = useState([]);
    
    return(
        <MicroContext.Provider value={{ loading, setLoading, 
        dataListMicro, setDataListMicro }}>
            {children}
        </MicroContext.Provider>
    )
}

export default MicroProvider;