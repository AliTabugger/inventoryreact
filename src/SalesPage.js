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

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    part_id: "",
    quantity_sold: "",
    price_per_unit: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch sales
  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await apiService.salesPerPart();
      console.log(response);
      setSales(response);
      setFilteredSales(response);
    } catch (err) {
      setError("Failed to fetch sales");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter((sale) =>
        sale.part_name
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredSales(filtered);
    }
  }, [searchTerm, sales]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (editingSale) {
        await apiService.updateSale(formData, editingSale.id);
        setSuccess("Sale updated successfully");
      } else {
        await apiService.storeSale(formData);
        setSuccess("Sale created successfully");
      }
      fetchSales();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  // Edit sale
  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      part_id: sale.part_id,
      quantity_sold: sale.quantity_sold,
      price_per_unit: sale.price_per_unit,
    });
    setShowModal(true);
  };

  // Delete sale
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      setLoading(true);
      try {
        await apiService.deleteSale(id);
        setSuccess("Sale deleted successfully");
        fetchSales();
      } catch (err) {
        setError("Failed to delete sale");
      }
      setLoading(false);
    }
  };

  // Reset form when modal closes
  const handleModalClose = () => {
    setShowModal(false);
    setEditingSale(null);
    setFormData({
      part_id: "",
      quantity_sold: "",
      price_per_unit: "",
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Sales</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <FiSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search sales by Part ID"
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
            <tr className="bg-gray-200">
              <th className="p-2 border">Motor part</th>
              <th className="p-2 border">Quantity Sold</th>
              <th className="p-2 border">Price Per Unit</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale, idx) => (
                <tr key={sale.id}>
                  <td>{sale.part_name}</td>
                  <td>{sale.quantity_sold}</td>
                  <td>₱{sale.price_per_unit}</td>
                  <td>
                    ₱{Number(sale.quantity_sold) * Number(sale.price_per_unit)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  {searchTerm
                    ? "No matching sales found"
                    : "No sales available"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SalesPage;
