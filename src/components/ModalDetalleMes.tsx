import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import axios from "axios";

type Campo = {
  clave: string;
  valor: number;
};

type Propuesta = {
  _id: string;
  campos: Campo[];
  mes: string;
  usuario: string;
  aprobadaporyeniffer: boolean;
  aprobadaporrodrigo: boolean;
};

type Props = {
  show: boolean;
  onClose: () => void;
  propuestas: Propuesta[];
  titulo?: string;
  onPropuestaAprobada: () => void; // 👈 nueva prop
};

const ModalDetalleMes: React.FC<Props> = ({ show, onClose, propuestas, titulo, onPropuestaAprobada }) => {
  console.log(propuestas)
  const usuarioActual = localStorage.getItem("usuario")?.toLowerCase();

  const estaAprobada = (propuesta: Propuesta) =>
    propuesta.aprobadaporyeniffer && propuesta.aprobadaporrodrigo;


  const propuestaAprobada = propuestas.find(estaAprobada);
  const propuestasAMostrar = propuestaAprobada ? [propuestaAprobada] : propuestas;

  const calcularTotal = () => {
    return propuestasAMostrar.reduce((total, propuesta) => {
      return (
        total + propuesta.campos.reduce((suma, campo) => suma + campo.valor, 0)
      );
    }, 0);
  };

  const aprobarPropuesta = async (_id: string) => {
   
try {
  const usuario = localStorage.getItem("usuario")
  if(localStorage.getItem("usuario")=="test"){
    alert("los usuarios test no pueden aprobar propuestas.")
    return
  }
  const response = await axios.post("https://backendbudgetapp.onrender.com/aprobar", {
    _id,
    usuario
  })

  if (response.status === 200) {
    alert("Aprobaste correctamente la propuesta ✅");
    onPropuestaAprobada(); // 👈 refresca el estado desde el padre
  }
} catch (error) {
  console.error("Error al aprobar la propuesta:", error)
  alert("No se pudo aprobar la propuesta.")
}
  };

  const renderEstadoAprobacion = (propuesta: Propuesta) => {
    const aprobadaYeniffer = propuesta.aprobadaporyeniffer;
    const aprobadaRodrigo = propuesta.aprobadaporrodrigo;

    if (estaAprobada(propuesta)) return null;

    if (
      usuarioActual === "yeniffer" &&
      aprobadaYeniffer &&
      !aprobadaRodrigo
    ) {
      return <p className="text-success">Aprobada por ti</p>;
    }

    if (
      usuarioActual === "rodrigo" &&
      aprobadaRodrigo &&
      !aprobadaYeniffer
    ) {
      return <p className="text-success">Aprobada por ti</p>;
    }

    if (usuarioActual === "yeniffer" && aprobadaRodrigo) {
      return <p className="text-success">Aprobada por Rodrigo</p>;
    }

    if (usuarioActual === "rodrigo" && aprobadaYeniffer) {
      return <p className="text-success">Aprobada por Yeniffer</p>;
    }

    return <p style={{ color: "red" }}>No aprobada aún</p>;
  };

  const puedeAprobar = (propuesta: Propuesta) => {
    if (estaAprobada(propuesta)) return false;

    if (usuarioActual === "yeniffer" && !propuesta.aprobadaporyeniffer) return true;
    if (usuarioActual === "rodrigo" && !propuesta.aprobadaporrodrigo) return true;

    return false;
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo || "Detalle del Mes"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {propuestasAMostrar.length === 0 ? (
          <p className="text-muted">No hay propuestas para este mes.</p>
        ) : (
          <div className="mb-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {propuestasAMostrar.map((propuesta, index) => {
              return (
                <div key={index} className="mb-4">
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th colSpan={2}>Propuesto por: {propuesta.usuario}</th>
                      </tr>
                      <tr>
                        <th>Clave</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propuesta.campos.map((campo, i) => (
                        <tr key={i}>
                          <td>{campo.clave}</td>
                          <td>${campo.valor.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="text-end">
                    {renderEstadoAprobacion(propuesta)}

                    {puedeAprobar(propuesta) && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => aprobarPropuesta(propuesta._id)}
                      >
                        Aprobar propuesta
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-end mt-4">
          <strong>Total: ${calcularTotal().toLocaleString()}</strong>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetalleMes;