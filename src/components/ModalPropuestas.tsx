import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

interface Props {
    show: boolean
  onHide: () => void;
  onAceptar: (propuesta:any)=> void

}

interface Campo {
  clave: string;
  valor: number;
}

const ModalPropuesta: React.FC<Props> = ({onHide,show,onAceptar }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleAceptarClick = async () => {
  if (isSubmitting) return; // prevención
  setIsSubmitting(true);
  await onAceptar({ campos });
  setIsSubmitting(false);
};
  const [campos, setCampos] = useState<Campo[]>([]);

  const agregarCampo = () => {
    setCampos([...campos, { clave: '', valor: 0 }]);
  };

  const actualizarCampo = (index: number, campo: Partial<Campo>) => {
    const nuevosCampos = [...campos];
    nuevosCampos[index] = { ...nuevosCampos[index], ...campo };
    setCampos(nuevosCampos);
  };


  const total = campos.reduce((sum, campo) => sum + campo.valor, 0);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nueva propuesta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {campos.map((campo, index) => (
          <Row key={index} className="mb-2">
            <Col>
              <Form.Control
                type="text"
                placeholder="Clave"
                value={campo.clave}
                onChange={e => actualizarCampo(index, { clave: e.target.value })}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Valor"
                value={campo.valor}
                onChange={e => actualizarCampo(index, { valor: Number(e.target.value) })}
              />
            </Col>
          </Row>
        ))}
        <Button onClick={agregarCampo} className="mt-3">
          + Agregar campo
        </Button>
        <div className="mt-3 fw-bold">Total: ${total}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleAceptarClick} disabled={isSubmitting}>
  {isSubmitting ? "Enviando..." : "Aceptar"}
</Button> 
      </Modal.Footer>
    </Modal>
  );
};



export default ModalPropuesta;