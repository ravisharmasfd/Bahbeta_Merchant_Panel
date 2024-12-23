import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import InvoiceOverview from './InvoiceOverview';
import InvoiceTable from './invoiceTable';
import { Container, Row, Col } from 'react-bootstrap';
import '../css/Dashboard.css'; // Custom styles for layout

const Report = () => {
  return (
    <div className="d-flex">
      
        <Sidebar></Sidebar>
      <div className="main-content flex-grow-1">
        <Container fluid>
          <InvoiceOverview type="report"/>
          <Row>
            <Col>
              <InvoiceTable isReport={true}/>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Report;
