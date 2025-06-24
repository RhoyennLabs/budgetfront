import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ErrorMessage from './ErrorMessage';
import axios from "axios";


interface Props {
  onLoginSuccess: () => void;
}

const Login: React.FC<Props> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos petición
    const response = await fakeLogin(email, password);
    if (response) {
      localStorage.setItem('usuario', response.data.usuario);
      localStorage.setItem('token', response.data.token);
      onLoginSuccess();
    } else if (!response) {
      setError('Credenciales incorrectas');
    } else {
      setError('Error del servidor');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="input" value={email} onChange={e => setEmail(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="formBasicPassword" className="mt-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </Form.Group>

      {error && <ErrorMessage mensaje={error} />}

      <Button variant="primary" type="submit" className="mt-3">
        Iniciar sesión
      </Button>
    </Form>
  );
};

const fakeLogin = async (email: string, password: string) => {
    try {
      if(email=="test"){
        return {data:{usuario:"test",token:"test"}}
      }
        let response=await axios.post("https://backendbudgetapp.onrender.com/login", {
            loginUsername:email,loginPassword:password
        });
        if(response)return response
      } catch (error) {
        console.error("Error al obtener propuestas:", error);
        return false
      }
    
  };
  
  export default Login;
  