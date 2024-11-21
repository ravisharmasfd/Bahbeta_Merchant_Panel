import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import InvoiceOverview from './InvoiceOverview';
import InvoiceTable from './invoiceTable';
import { Container, Row, Col } from 'react-bootstrap';
import '../css/Dashboard.css'; // Custom styles for layout

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Header />
        <Container fluid>
          <InvoiceOverview />
          <Row>
            <Col>
              <InvoiceTable />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
