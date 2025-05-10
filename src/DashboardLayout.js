import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiSettings,
  FiLayers,
  FiTruck,
  FiLogOut,
  FiHome,
} from "react-icons/fi";
import "./Dashboard.css";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  // Check if current route matches the nav link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Container fluid className="dashboard-container ">
      <Row className="sidebar-sticky">
        <Col md={2} className="sidebar p-0 ">
          <div className="sidebar-header">
            <h3 className="brand-title">MOTOR PARTS PRO</h3>
            <div className="divider"></div>
          </div>
          <nav className="navigation-menu">
            <Link
              to="/dashboard"
              className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
            >
              <FiHome className="nav-icon" />
              <span className="nav-text">Dashboard</span>
            </Link>
            <Link
              to="/dashboard/parts"
              className={`nav-item ${isActive("/dashboard/parts") ? "active" : ""}`}
            >
              <FiSettings className="nav-icon" />
              <span className="nav-text">Manage Parts</span>
            </Link>
            <Link
              to="/dashboard/categories"
              className={`nav-item ${isActive("/dashboard/categories") ? "active" : ""}`}
            >
              <FiLayers className="nav-icon" />
              <span className="nav-text">Manage Categories</span>
            </Link>
            <Link
              to="/dashboard/suppliers"
              className={`nav-item ${isActive("/dashboard/suppliers") ? "active" : ""}`}
            >
              <FiTruck className="nav-icon" />
              <span className="nav-text">Manage Suppliers</span>
            </Link>
            <div className="nav-item logout-item" onClick={handleLogout}>
              <FiLogOut className="nav-icon" />
              <span className="nav-text">Logout</span>
            </div>
          </nav>
        </Col>
        <Col md={10} className="main-content">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
