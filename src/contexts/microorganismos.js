import React, { useState, createContext } from 'react';

export const MicroContext = createContext({});

function MicroProvider({children}){
    const [loading, setLoading] = useState(true);
    const [dataListMicro, setDataListMicro] = useState([]);
    const [activeDeletePhotos, setActiveDeletePhotos] = useState(false);
    
    return(
        <MicroContext.Provider value={{ loading, setLoading, 
        dataListMicro, setDataListMicro, activeDeletePhotos, setActiveDeletePhotos }}>
            {children}
        </MicroContext.Provider>
    )
}

export default MicroProvider;