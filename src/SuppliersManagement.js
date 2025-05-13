import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import apiService from "./API/apiService";

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState({
    fetch: false,
    submit: false,
    delete: false,
  });

  // Fetch suppliers
  const fetchSuppliers = async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    setError("");
    try {
      const response = await apiService.suppliers();
      setSuppliers(response);
      setFilteredSuppliers(response);
    } catch (err) {
      setError("Failed to fetch suppliers");
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (supplier.contact_person &&
            supplier.contact_person
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (supplier.phone &&
            supplier.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (supplier.address &&
            supplier.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchTerm, suppliers]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading((prev) => ({ ...prev, submit: true }));

    try {
      if (editingSupplier) {
        // Update existing supplier
        await apiService.updateSupplier(formData, editingSupplier.id);
        setSuccess("Supplier updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        // Create new supplier
        await apiService.storeSupplier(formData);
        setSuccess("Supplier created successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
      fetchSuppliers();
      setFormData({
        name: "",
        contact_person: "",
        phone: "",
        address: "",
      });
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Edit supplier
  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });
    setShowModal(true);
  };

  // Delete supplier
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      setLoading((prev) => ({ ...prev, delete: id }));
      setError("");
      try {
        await apiService.deleteSupplier(id);
        setSuccess("Supplier deleted successfully");
        setTimeout(() => setSuccess(""), 3000);

        fetchSuppliers();
      } catch (err) {
        setError("Failed to delete supplier");
      } finally {
        setLoading((prev) => ({ ...prev, delete: false }));
      }
    }
  };

  // Reset form when modal closes
  const handleModalClose = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setFormData({
      name: "",
      contact_person: "",
      phone: "",
      address: "",
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Suppliers Management</h2>
        <Button variant="danger" onClick={() => setShowModal(true)}>
          <FiPlus className="me-2" /> Add Supplier
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <FiSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search suppliers by name, contact, phone or address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </Button>
          )}
        </InputGroup>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading.fetch ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2">Loading suppliers...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.id}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact_person || "-"}</td>
                  <td>{supplier.phone || "-"}</td>
                  <td>{supplier.address || "-"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(supplier)}
                      disabled={loading.delete}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(supplier.id)}
                      disabled={loading.delete}
                    >
                      {loading.delete === supplier.id ? (
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
                        <FiTrash2 />
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  {searchTerm
                    ? "No matching suppliers found"
                    : "No suppliers available"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleModalClose} variant="danger">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Supplier Name*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter supplier name"
                className="border-danger"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Person</Form.Label>
              <Form.Control
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                placeholder="Enter contact person"
                className="border-danger"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="border-danger"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="border-danger"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleModalClose}
              disabled={loading.submit}
            >
              Cancel
            </Button>
            <Button variant="danger" type="submit" disabled={loading.submit}>
              {loading.submit ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  {editingSupplier ? "Updating..." : "Adding..."}
                </>
              ) : editingSupplier ? (
                "Update Supplier"
              ) : (
                "Add Supplier"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default SuppliersManagement;
