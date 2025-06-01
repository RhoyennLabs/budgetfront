import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Propuestas from './components/Propuestas';
import MyNavbar from './components/Nav';


const App: React.FC = () => {
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAutenticado(true);
  }, []);

  return (
    
    <div className="container-fluid mt-5">
      <MyNavbar />
      {autenticado ? (
        <Propuestas />
      ) : (
        <Login onLoginSuccess={() => setAutenticado(true)} />
      )}
    </div>
  );
};

export default App;
