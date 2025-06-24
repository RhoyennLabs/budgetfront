import  { useState, useEffect } from "react";
import ModalPropuestas from "./ModalPropuestas";
import ModalDetalleMes from "./ModalDetalleMes";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

type Campo = {
  clave: string;
  valor: number;
};

type Propuesta = {
  campos: Campo[];
};

type PropuestaDelServidor = {
  _id: string;
  campos: Campo[];
  mes: string;
  usuario: string;
  aprobadaporyeniffer: boolean;
  aprobadaporrodrigo: boolean;
};

const Propuestas = () => {
  const [modalOpen, setModalOpen] = useState<string | false>(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [propuestasPorMes, setPropuestasPorMes] = useState<PropuestaDelServidor[]>([]);

  const fetchPropuestas = async () => {
    try {
      const response = await axios.get("https://backendbudgetapp.onrender.com/propuestas");
      setPropuestasPorMes(response.data);
    } catch (error) {
      console.error("Error al obtener propuestas:", error);
    }
  };

  useEffect(() => {
    fetchPropuestas();
  }, []);

  const handleAgregarPropuesta = async (mes: string, propuesta: Propuesta) => {
    try {
      if(localStorage.getItem("usuario")=="test"){
        alert("los usuarios test no pueden agregar propuestas.")
        return
      }
      await axios.post(
        "https://backendbudgetapp.onrender.com/agregarPropuesta",
        {
          propuesta: {
            ...propuesta,
            mes,
            usuario: localStorage.getItem("usuario"),
            aprobadaporyeniffer:false,
            aprobadaporrodrigo:false
          }
        }
      );
      fetchPropuestas();
    } catch (error) {
      console.error("Error agregando propuesta", error);
      alert("Error agregando propuesta");
      return false;
    }
    alert("Propuesta agregada exitosamente");
    return true;
  };

  const getMeses = () => {
    const meses = [];
    const hoy = new Date();
    hoy.setDate(1);

    for (let i = 0; i < 12; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i);
      const key = `${fecha.getFullYear()}-${fecha.getMonth()}`;
      meses.push({
        label: `${monthNames[fecha.getMonth()]} ${fecha.getFullYear()}`,
        key,
        mes: fecha.getMonth(),
        anio: fecha.getFullYear()
      });
    }
    return meses;
  };

  return (
    <Container className="mt-4">
      <Row>
      {getMeses().map((mes) => {
  const propuestasDeEsteMes = propuestasPorMes.filter(p => p.mes === mes.key);
  const hayPropuestaAprobada = propuestasDeEsteMes.some(
    p => p.aprobadaporyeniffer && p.aprobadaporrodrigo
 );

  return (
    <Col key={mes.key} xs={12} md={6} lg={4} className="mb-4">
      <Card
        onClick={() => {
          setSelectedMonth(mes.key);
          setModalDetalleOpen(true);
        }}
        style={{ cursor: 'pointer' }}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Card.Title>{mes.label}</Card.Title>
              {!hayPropuestaAprobada && (
                <Card.Text className="text-muted">
                  {propuestasDeEsteMes.length} propuestas agregadas
                </Card.Text>
              )}
              
              
            </div>
            {!hayPropuestaAprobada && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(mes.key);
                }}
              >
                Agregar Propuesta
              </Button>
            )}

{hayPropuestaAprobada && (
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => {
                  setSelectedMonth(mes.key);
                  setModalDetalleOpen(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                Ver propuesta aprobada
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
})}
      
      </Row>

      {modalOpen && (
        <ModalPropuestas
          show={!!modalOpen}
          onHide={() => setModalOpen(false)}
          onAceptar={async (propuesta) => {
            await handleAgregarPropuesta(modalOpen, propuesta);
            setModalOpen(false);
          }}
        />
      )}

      {modalDetalleOpen && selectedMonth && (
        <ModalDetalleMes
          show={modalDetalleOpen}
          onClose={() => setModalDetalleOpen(false)}
          propuestas={propuestasPorMes.filter(p => p.mes === selectedMonth)}
          titulo={getMeses().find((m) => m.key === selectedMonth)?.label}
          onPropuestaAprobada={fetchPropuestas}
        />
      )}
    </Container>
  );
};

export default Propuestas;