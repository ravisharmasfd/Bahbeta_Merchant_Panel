import React from 'react';
import { Form, Dropdown, Row, Col, Card } from 'react-bootstrap'; // Import necessary components from react-bootstrap
import { FaFileExport } from 'react-icons/fa'; // For icons

const InvoiceOverview = () => {
  return (
    <div className="invoice-overview mt-5">
      {/* Background container for the top half */}
      <div className="overview-background">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="header-title">Invoices Overview</h4>
          <div className="header-filters d-flex">
            <Form.Group className="me-3">
              <Form.Select aria-label="Sort By">
                <option value="this-month">Sort by: This Month</option>
                <option value="7-days">Last 7 Days</option>
                <option value="this-year">This Year</option>
              </Form.Select>
            </Form.Group>
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                <FaFileExport /> Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Export to PDF</Dropdown.Item>
                <Dropdown.Item href="#">Export to Excel</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="cards-container">
  <Row>
    <Col md={3} className="no-padding-left">
      <Card className="overview-card overdue">
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between">
            <h5>Overdue Invoices (13)</h5>
            <img src="../images/Frame.png" alt="Icon" />
          </div>
          <h3 className="amount">11,345.50 BHD</h3>
        </Card.Body>
      </Card>
    </Col>

    <Col md={3} className="padding-left">
      <Card className="overview-card awaiting">
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between">
            <h5>Awaiting Payment (5)</h5>
            <img src="../images/Frame.png" alt="Icon" />
          </div>
          <h3 className="amount">5,578.00 BHD</h3>
        </Card.Body>
      </Card>
    </Col>

    <Col md={3} className="padding-left">
      <Card className="overview-card draft">
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between">
            <h5>Draft Invoices (4)</h5>
            <img src="../images/Frame.png" alt="Icon" />
          </div>
          <h3 className="amount">978.37 BHD</h3>
        </Card.Body>
      </Card>
    </Col>

    <Col md={3} className="padding-left">
      <Card className="overview-card paid">
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between">
            <h5>Get Paid (33)</h5>
            <img src="../images/Frame.png" alt="Icon" />
          </div>
          <h3 className="amount">27,245.78 BHD</h3>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</div>
    </div>
  );
};

export default InvoiceOverview;
