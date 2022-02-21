import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { AuthContext } from '../../contexts/auth';

export default function ProgressBar() {
    const { loading } = useContext(AuthContext);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
            if (oldProgress === 100) {
                return 0;
            }
            const diff = Math.random() * 10;
            return Math.min(oldProgress + diff, 100);
            });
        }, 3000);

        return () => {
            clearInterval(timer);
        };
    }, [loading]);

  return (
    <Box sx={{width: '100%'}}>
      <LinearProgress />
    </Box>
  );
}