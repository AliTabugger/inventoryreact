import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../PartsManagement.css";
import apiService from "../API/apiService";

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
      onHide();
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

export default PartEditModal;
