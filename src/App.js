import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/auth';
import MicroProvider from './contexts/microorganismos';
import Routes from './routes';

function App() {
  return (
    <AuthProvider>
      <MicroProvider>
        <BrowserRouter>
          <Routes/>
        </BrowserRouter>
      </MicroProvider>
    </AuthProvider>
  );
}

export default App;
