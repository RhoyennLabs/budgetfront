import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";

type Tarea = {
  _id: string;
  usuario: string;
  nombreTarea: string;
  estado: "iniciada" | "en proceso" | "terminada";
};

const estadosOrden = ["iniciada", "en proceso", "terminada"];

export const TodoList: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("");
  const [nombreTarea, setNombreTarea] = useState<string>("");

  useEffect(() => {
    fetchTareas();
  }, []);

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://backendbudgetapp.onrender.com/tareas");
      setTareas(response.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las tareas.");
    } finally {
      setLoading(false);
    }
  };

  const tareasPorEstado = (estado: string) =>
    tareas.filter((t) => t.estado === estado);

  const handleAddClick = (estado: string) => {
    setEstadoSeleccionado(estado);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreTarea.trim()) return;

    try {
      await axios.post("https://backendbudgetapp.onrender.com/publicarTarea", {
        nombreTarea,
        estado: estadoSeleccionado,
        usuario: localStorage.getItem("usuario") // <-- Aquí puedes usar el real si lo tienes
      });

      setShowModal(false);
      setNombreTarea("");
      fetchTareas(); // refresca la lista
    } catch (err) {
      console.error("Error al crear la tarea:", err);
    }
  };

  return (
    <Container className="mt-4">
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {estadosOrden.map((estado) => (
          <Col key={estado}>
            <h5 className="text-capitalize text-center">{estado}</h5>
            {tareasPorEstado(estado).map((tarea) => (
              <Card key={tarea._id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title>{tarea.nombreTarea}</Card.Title>
                  <Card.Text>
                    <strong>Usuario:</strong> {tarea.usuario}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
            <div className="d-grid">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddClick(estado)}
              >
                + Agregar tarea
              </Button>
            </div>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar tarea a "{estadoSeleccionado}"</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="nombreTarea">
              <Form.Label>Nombre de la tarea</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Comprar pan"
                value={nombreTarea}
                onChange={(e) => setNombreTarea(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};