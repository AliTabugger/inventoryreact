import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import backgroundImage from "./assets/background.jpg";
import logo from "./assets/logo.png";
import "./LoginPage.css";
import apiService from "./API/apiService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiService.login({ email, password });

      console.log(res.token);
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="login-overlay"></div>
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5} xl={4}>
            <Card className="shadow-lg motor-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img
                    src={logo}
                    alt="Motor Parts Logo"
                    className="motor-logo mb-3"
                  />
                  <h1 className="motor-title">PARTS INVENTORY</h1>
                  <div className="motor-divider"></div>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="motor-label">EMAIL</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="mechanic@garage.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="motor-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label className="motor-label">PASSWORD</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="motor-input"
                    />
                  </Form.Group>

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 motor-btn"
                  >
                    LOGIN
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
