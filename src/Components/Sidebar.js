import React from 'react';
import { Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFileInvoice, FaUsers, FaChartPie, FaBox, FaDownload, FaHome, FaPlus } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column">
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/" className="sidebar-link">
          <FaHome className="me-2" /> Dashboard
        </Nav.Link>

        {/* Dropdown for Invoices in Sidebar */}
        <Dropdown drop="end">
          <Dropdown.Toggle as={Nav.Link} className="sidebar-link" variant="link">
            <FaFileInvoice className="me-2" /> Invoices
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/create-invoice">
            <FaPlus className="me-2"/>
              Create Invoice
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/recurring-invoice">
            <FaPlus className="me-2"/>
              Recurring Invoice
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Nav.Link as={Link} to="/items" className="sidebar-link">
          <FaBox className="me-2" /> Items
        </Nav.Link>
        <Nav.Link as={Link} to="/users" className="sidebar-link">
          <FaUsers className="me-2" /> Manage Users
        </Nav.Link>
        <Nav.Link as={Link} to="/reports" className="sidebar-link">
          <FaChartPie className="me-2" /> Reports
        </Nav.Link>
      </Nav>

      {/* Download App Section */}
      <div className="mt-auto p-3">
        <div
          className="download-app-section text-center"
          style={{
            backgroundColor: '#f0f8ff', // Light blue background
            borderRadius: '8px',        // Rounded corners
            padding: '15px',            // Padding for spacing
          }}
        >
          <FaDownload className="download-icon" size={30} />
          <p className="mt-2 mb-2" style={{ fontSize: '14px' }}>
            Download Bahbeta Mobile app to manage everything
          </p>
          <button className="btn btn-primary" style={{ borderRadius: '20px' }}>
            Download App
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
