import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import {
  FiPackage,
  FiGrid,
  FiTruck,
  FiActivity,
  FiAlertTriangle,
} from "react-icons/fi";
import "./Dashboard.css";
import apiService from "./API/apiService";

const DashboardHome = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStats = async () => {
    try {
      const response = await apiService.dashboardStats();
      console.log(response);
      setDashboardStats(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-home text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <h2 className="dashboard-title">Inventory Overview</h2>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body className="text-center">
              <div className="card-icon-container">
                <FiPackage className="card-icon parts-icon" />
              </div>
              <Card.Title className="card-heading">Total Parts</Card.Title>
              <Card.Text className="card-value">
                {dashboardStats?.parts_count ?? 0}
              </Card.Text>
              <Card.Link href="/dashboard/parts" className="card-link">
                View All <FiGrid className="link-icon" />
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body className="text-center">
              <div className="card-icon-container">
                <FiGrid className="card-icon categories-icon" />
              </div>
              <Card.Title className="card-heading">Categories</Card.Title>
              <Card.Text className="card-value">
                {dashboardStats?.categories_count ?? 0}
              </Card.Text>
              <Card.Link href="/dashboard/categories" className="card-link">
                View All <FiGrid className="link-icon" />
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body className="text-center">
              <div className="card-icon-container">
                <FiTruck className="card-icon suppliers-icon" />
              </div>
              <Card.Title className="card-heading">Suppliers</Card.Title>
              <Card.Text className="card-value">
                {dashboardStats?.suppliers_count ?? 0}
              </Card.Text>
              <Card.Link href="/dashboard/suppliers" className="card-link">
                View All <FiGrid className="link-icon" />
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body className="text-center">
              <div className="card-icon-container">
                <FiActivity className="card-icon sales-icon" />
              </div>
              <Card.Title className="card-heading">Total Sales</Card.Title>
              <Card.Text className="card-value">
                ₱
                {dashboardStats?.total_sales?.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                }) ?? "0.00"}
              </Card.Text>
              <Card.Link href="/dashboard/sales" className="card-link">
                View All <FiGrid className="link-icon" />
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="dashboard-section mb-4">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <FiActivity className="section-icon me-2" />
            <Card.Title className="section-title mb-0">
              Recent Activity
            </Card.Title>
          </div>
          {/* Activity log component would go here */}
          <div className="activity-placeholder">
            Recent transactions and changes will appear here
          </div>
        </Card.Body>
      </Card>

      <Card className="dashboard-section">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <FiAlertTriangle className="section-icon me-2" />
            <Card.Title className="section-title mb-0">
              Low Stock Items
            </Card.Title>
          </div>
          {/* Low stock items component would go here */}
          <div className="activity-placeholder">
            Items needing restock will appear here
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DashboardHome;
