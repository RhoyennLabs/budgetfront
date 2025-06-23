import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Propuestas from './components/Propuestas';
import MyNavbar from './components/Nav';
import { TodoList } from './components/TodoList';
import { Button, ButtonGroup } from 'react-bootstrap';

const App: React.FC = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [feature, setFeature] = useState<'propuestas' | 'todolist' | 'otra'>('propuestas');

  function cambiarFeature(nuevaFeature: 'propuestas' | 'todolist' | 'otra') {
    setFeature(nuevaFeature);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAutenticado(true);
  }, []);

  return (
    <div className="container-fluid mt-5">
      <MyNavbar />

      {autenticado && (
        <div className="d-flex justify-content-center mt-3">
          <ButtonGroup style={{ width: '80%', height: '60px' }}>
            <Button
              variant={feature === 'propuestas' ? 'primary' : 'outline-primary'}
              style={{
                flex: 1,
                borderRight: '1px solid #ccc',
                borderRadius: 0,
              }}
              onClick={() => cambiarFeature('propuestas')}
            >
              Propuestas
            </Button>
            <Button
              variant={feature === 'todolist' ? 'primary' : 'outline-primary'}
              style={{
                flex: 1,
                borderRight: '1px solid #ccc',
                borderRadius: 0,
              }}
              onClick={() => cambiarFeature('todolist')}
              >
              TodoList
            </Button>
            <Button
              variant={feature === 'otra' ? 'primary' : 'outline-primary'}
              style={{
                flex: 1,
                borderRadius: 0,
              }}
              onClick={() => cambiarFeature('otra')}
            >
              Otra
            </Button>
          </ButtonGroup>
        </div>
      )}

      {autenticado ? (
        <>
          {feature === 'propuestas' && <Propuestas />}
          {feature === 'todolist' && <TodoList />}
          {/* Puedes agregar lógica para 'otra' si quieres */}
        </>
      ) : (
        <Login onLoginSuccess={() => setAutenticado(true)} />
      )}
    </div>
  );
};

export default App;