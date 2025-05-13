import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  InputGroup,
  Card,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiTag,
  FiHome,
  FiPlus,
  FiX,
  FiCheck,
  FiPlusCircle,
  FiEye,
  FiDollarSign,
} from "react-icons/fi";
import "./PartsManagement.css";
import axios from "axios";
import apiService from "./API/apiService";
import StockAdjustmentModal from "./modals/StockAdjustmentModal";
import PartEditModal from "./modals/PartEditModal";


const PartsManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [parts, setParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showStockModal, setShowStockModal] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [loading, setLoading] = useState({
    initial: true,
    saving: false,
    deleting: null,
    adjustingStock: false,
    uploadingImage: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchData = async () => {
    setLoading((prev) => ({ ...prev, initial: true }));
    setError(null);
    try {
      const [partsRes, categoriesRes, suppliersRes] = await Promise.all([
        apiService.getParts(),
        apiService.categories(),
        apiService.suppliers(),
      ]);

      setParts(partsRes);
      setCategories(categoriesRes);
      setSuppliers(suppliersRes);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load parts data. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, initial: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadImage = async (file) => {
    setLoading((prev) => ({ ...prev, uploadingImage: true }));
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/api/parts/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.path;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, uploadingImage: false }));
    }
  };

  const handleSave = async (partData) => {
    setLoading((prev) => ({ ...prev, saving: true }));
    setError(null);
    setSuccess(null);
    try {
      let imagePath = partData.image_path;

      if (partData.imageFile) {
        imagePath = await uploadImage(partData.imageFile);
        if (!imagePath) return;
      }

      if (editingPart && editingPart.id) {
        setSuccess("Part updated successfully");
      } else {
        setSuccess("Part added successfully");
      }

      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving part:", error);
      setError(error.response?.data?.message || "Failed to save part");
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("This motor part will be deleted!");
    if (!confirm) return;

    setLoading((prev) => ({ ...prev, deleting: id }));
    setError(null);
    setSuccess(null);
    try {
      await apiService.deletePart(id);
      setSuccess("Part deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting part:", error);
      setError("Failed to delete part");
    } finally {
      setLoading((prev) => ({ ...prev, deleting: null }));
    }
  };

  const handleStockAdjustment = async (partId, adjustment) => {
    setLoading((prev) => ({ ...prev, adjustingStock: true }));
    setError(null);
    try {
      setSuccess("Stock adjusted successfully");
      fetchData();
      setShowStockModal(null);
    } catch (error) {
      console.error("Error adjusting stock:", error);
      setError("Failed to adjust stock");
    } finally {
      setLoading((prev) => ({ ...prev, adjustingStock: false }));
    }
  };

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="parts-management">
      <StockAdjustmentModal
        show={showStockModal}
        onHide={() => setShowStockModal(null)}
        part={selectedPart}
        onAdjust={handleStockAdjustment}
        loading={loading.adjustingStock}
      />

      <div className="page-header">
        <h2>Manage Parts</h2>
        <Button
          variant="danger"
          className="add-part-btn motor-btn"
          onClick={() => {
            setEditingPart({
              name: "",
              category_id: "",
              supplier_id: null,
              quantity: 0,
              price: 0.0,
              date_acquired: null,
              image_path: null,
            });
            setShowModal(true);
          }}
          disabled={loading.initial}
        >
          <FiPlus className="btn-icon" /> Add New Part
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <div className="search-container">
        <InputGroup className="search-input-group">
          <Form.Control
            placeholder="Search parts by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="motor-input"
            disabled={loading.initial}
          />
          <Button
            variant="outline-secondary"
            className="search-btn motor-btn"
            disabled={loading.initial}
          >
            <FiSearch />
          </Button>
        </InputGroup>
      </div>

      {parts.length === 0 && loading.initial ? (
        <div className="text-center my-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" variant="danger" />
            <span className="ms-3">Loading parts...</span>
          </div>
          {/* <h4>No parts found</h4>
          <p>Click "Add New Part" to get started</p> */}
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="parts-grid">
          {filteredParts.map((part) => (
            <Col key={part.id} className="part-col">
              <Card className="part-card">
                <div className="part-image-container">
                  {part.image_path ? (
                    <Card.Img
                      variant="top"
                      src={`http://127.0.0.1:8000/storage/${part.image_path}`}
                      alt={part.name}
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                  <Badge
                    pill
                    className="stock-badge"
                    bg={
                      part.quantity > 30
                        ? "success"
                        : part.quantity > 0
                          ? "warning"
                          : "danger"
                    }
                  >
                    {part.quantity} in stock
                  </Badge>
                </div>
                <Card.Body className="part-body">
                  <Card.Title className="part-title">{part.name}</Card.Title>
                  <div className="part-details">
                    <div className="part-detail">
                      <FiTag className="detail-icon" />{" "}
                      {part.category?.name || "No Category"}
                    </div>
                    <div className="part-detail">
                      <FiHome className="detail-icon" />{" "}
                      {part.supplier?.name || "No Supplier"}
                    </div>
                    <div className="part-detail">
                      ₱{parseFloat(part.price).toFixed(2)}
                    </div>
                    <div className="d-flex">
                      <Button
                        variant={
                          part.quantity > 0
                            ? "outline-success"
                            : "outline-warning"
                        }
                        className="ms-auto action-btn stock-btn motor-btn"
                        onClick={() => {
                          setShowStockModal(part);
                          setSelectedPart(part);
                        }}
                        disabled={loading.deleting === part.id}
                      >
                        <FiPlusCircle className="btn-icon" /> Adjust Stock
                      </Button>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="part-footer">
                  <div className="d-flex justify-content-between">
                    <div>
                      {/* <Button
                        variant="outline-info"
                        className="action-btn view-btn motor-btn me-2"
                        // onClick={() => handleViewPart(part.id)}
                        disabled={loading.deleting === part.id}
                      >
                        <FiEye className="btn-icon" /> View
                      </Button> */}
                      <Button
                        variant="outline-primary"
                        className="action-btn edit-btn motor-btn me-2"
                        onClick={() => {
                          setEditingPart(part);
                          setShowModal(true);
                        }}
                        disabled={loading.deleting === part.id}
                      >
                        <FiEdit2 className="btn-icon" /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="action-btn delete-btn motor-btn"
                        onClick={() => handleDelete(part.id)}
                        disabled={loading.deleting}
                      >
                        {loading.deleting === part.id ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-1"
                            />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FiTrash2 className="btn-icon" /> Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <PartEditModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingPart(null);
        }}
        part={editingPart}
        onSave={handleSave}
        categories={categories}
        suppliers={suppliers}
        loading={loading.saving || loading.uploadingImage}
      />
    </div>
  );
};

export default PartsManagement;
