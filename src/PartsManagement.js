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
} from "react-icons/fi";
import "./PartsManagement.css"; // Create this CSS file
import axios from "axios";
import apiService from "./API/apiService";

const PartsManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Fetch all necessary data
  const fetchData = async () => {
    try {
      const [partsRes, categoriesRes, suppliersRes] = await Promise.all([
        apiService.getParts(),
        apiService.categories(),
        apiService.suppliers(),
      ]);

      setParts(partsRes);
      setCategories(categoriesRes);
      setSuppliers(suppliersRes);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadImage = async (file) => {
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
      return null;
    }
  };

  const handleSave = async (partData) => {
    try {
      let imagePath = partData.image_path;

      if (partData.imageFile) {
        imagePath = await uploadImage(partData.imageFile);
        if (!imagePath) return;
      }

      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving part:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("This motor part will be deleted!");

    if (!confirm) {
      return;
    }
    try {
      await apiService.deletePart(id);
      fetchData(); // Refresh all data
    } catch (error) {
      console.error("Error deleting part:", error);
    }
  };

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="parts-management">
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
        >
          <FiPlus className="btn-icon" /> Add New Part
        </Button>
      </div>

      <div className="search-container">
        <InputGroup className="search-input-group">
          <Form.Control
            placeholder="Search parts by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="motor-input"
          />
          <Button variant="outline-secondary" className="search-btn motor-btn">
            <FiSearch />
          </Button>
        </InputGroup>
      </div>

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
                  bg={part.quantity > 20 ? "success" : "warning"}
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
                    Price: ${parseFloat(part.price).toFixed(2)}
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="part-footer">
                <Button
                  variant="outline-primary"
                  className="action-btn edit-btn motor-btn"
                  onClick={() => {
                    setEditingPart(part);
                    setShowModal(true);
                  }}
                >
                  <FiEdit2 className="btn-icon" /> Edit
                </Button>
                <Button
                  variant="outline-danger"
                  className="action-btn delete-btn motor-btn"
                  onClick={() => handleDelete(part.id)}
                >
                  <FiTrash2 className="btn-icon" /> Delete
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

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
      />
    </div>
  );
};

const PartEditModal = ({ show, onHide, part, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    supplier_id: null,
    quantity: 0,
    price: 0.0,
    image_path: null,
    date_acquired: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (part) {
      console.log(part);
      setFormData(() => ({
        name: part.name,
        category_id: part.category_id,
        supplier_id: part.supplier_id,
        quantity: part.quantity,
        price: part.price,
        image_path: part.image_path,
        date_acquired: part.date_acquired,
      }));

      setPreviewImage(part.image_url);
    }
  }, [part]);

  const getSuppliers = async () => {
    try {
      const response = await apiService.suppliers();
      console.log(response);
      setSuppliers(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await apiService.categories();
      console.log(response);
      setCategories(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSuppliers();
    getCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date_acquired: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    console.log(part);

    try {
      let response;
      if (!part.category_id) {
        response = await apiService.storePart(data);
      } else {
        response = await apiService.updatePart(data, part);
      }

      console.log(response);
      onSave(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} className="part-modal">
      <Modal.Header closeButton>
        <Modal.Title>{part?.id ? "Edit Part" : "Add New Part"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Part Name</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Supplier</Form.Label>
            <Form.Select
              name="supplier_id"
              value={formData.supplier_id || ""}
              onChange={handleChange}
            >
              <option value="">No Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date Acquired</Form.Label>
            <Form.Control
              type="date"
              name="date_acquired"
              value={formData.date_acquired || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Part Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ maxHeight: "200px" }}
              />
            ) : formData.image_path ? (
              <img
                src={`/storage/${formData.image_path}`}
                alt="Current"
                className="img-thumbnail mt-2"
                style={{ maxHeight: "200px" }}
              />
            ) : null}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PartsManagement;
