import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import apiService from "../API/apiService";

const StockAdjustmentModal = ({ show, onHide, part, onAdjust }) => {
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiService.adjustStock({
        part_id: part.id,
        adjustment: adjustment,
        price: part.price,
        reason: reason,
      });

      onAdjust();

      setAdjustment(0);
      setReason("");
      onHide();
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncrement = () => {
    setAdjustment((prev) => parseInt(prev) + 1);
  };

  const handleDecrement = () => {
    setAdjustment((prev) => parseInt(prev) - 1);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Adjust Stock: {part?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Current Stock: <strong>{part?.quantity}</strong>
            </Form.Label>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adjustment</Form.Label>
            <InputGroup>
              <Button variant="outline-secondary" onClick={handleDecrement}>
                −
              </Button>
              <Form.Control
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                required
                className="text-center"
              />
              <Button variant="outline-secondary" onClick={handleIncrement}>
                +
              </Button>
            </InputGroup>
            <Form.Text muted>
              Use negative number to deduct, positive to add.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">-- Select Reason --</option>
              <option value="newstock">New stock received</option>
              <option value="damaged">Damaged item removed</option>
              <option value="correction">Correction</option>
              <option value="sold">Sold (manual adjustment)</option>
              <option value="Others">Others</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Adjustment
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StockAdjustmentModal;
