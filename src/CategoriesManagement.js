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

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // <-- loading state

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true); // start loading
    try {
      const response = await apiService.categories();
      setCategories(response);
      setFilteredCategories(response);
    } catch (err) {
      setError("Failed to fetch categories");
    }
    setLoading(false); // end loading
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // start loading

    try {
      if (editingCategory) {
        // Update existing category
        await apiService.updateCategory(formData, editingCategory.id);
        setSuccess("Category updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        // Create new category
        await apiService.storeCategory(formData);
        setSuccess("Category created successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
      fetchCategories();
      setFormData({ name: "" });
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
    setLoading(false); // end loading
  };

  // Edit category
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowModal(true);
  };

  // Delete category
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setLoading(true); // start loading
      try {
        await apiService.deleteCategory(id);
        setSuccess("Category deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
        fetchCategories();
      } catch (err) {
        setError("Failed to delete category");
      }
      setLoading(false); // end loading
    }
  };

  // Reset form when modal closes
  const handleModalClose = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "" });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Categories Management</h2>
        <Button variant="danger" onClick={() => setShowModal(true)}>
          <FiPlus className="me-2" /> Add Category
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
            placeholder="Search categories by name"
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

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{new Date(category.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(category)}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  {searchTerm
                    ? "No matching categories found"
                    : "No categories available"}
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
            {editingCategory ? "Edit Category" : "Add New Category"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter category name"
                className="border-danger"
                disabled={loading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleModalClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="danger" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" />{" "}
                  {editingCategory ? "Updating..." : "Adding..."}
                </>
              ) : editingCategory ? (
                "Update Category"
              ) : (
                "Add Category"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesManagement;
