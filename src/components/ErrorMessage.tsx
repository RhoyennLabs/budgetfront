import React from 'react';
import Alert from 'react-bootstrap/Alert';

interface Props {
  mensaje: string;
}

const ErrorMessage: React.FC<Props> = ({ mensaje }) => {
  return <Alert variant="danger">{mensaje}</Alert>;
};

export default ErrorMessage;