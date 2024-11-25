import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Badge, Dropdown, Button, Form, Nav, InputGroup } from 'react-bootstrap';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteInvoiceApi, GetInvoiceApi } from '../services/api';
import moment from 'moment';

const InvoiceTable = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('drafts');
  const [customerName, setCustomerName] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [invoiceData, setInvoiceData] = useState([]);
  const [total, setTotal] = useState({
    page: 0,
    total: 0,
    isNext: false,
    isPrevious: false,
  })
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const query = {
        page,
        limit,
        type: activeTab,
        status: filterStatus,

      }
      const response = await GetInvoiceApi(query)
      console.log("🚀 ~ fetchInvoices ~ response:", response)
      setInvoiceData(response.invoices);
      setTotal({ page: response.totalPages, isNext: response.isNext, isPrevious: response.isPrevious })
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {


    fetchInvoices();
  }, [activeTab,customerName,limit,page]);
  const deleteDraft=async(id)=>{
    try {
      const res = await DeleteInvoiceApi(id);
      await fetchInvoices()
    } catch (error) {
      
    }
  }
  const handleEdit=async(invoice)=>{
    if(invoice.type == 1){
      navigate("/create-invoice",{state:invoice})
    }
    else{
      navigate("/recurring-invoice",{state:invoice})
    }
  }
  const handleCopy = async (id) => {
    try {
      await navigator.clipboard.writeText(id); // Copy text to clipboard
      alert("copied successfully")
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="invoice-container">
      <div className="top-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Nav className="mr-3">
            <Nav.Link
              as={Link}
              to="#"
              className={`sidebar-link position-relative ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              Invoices
              {activeTab === 'invoices' && (
                <img src="../images/highlight.png" className="highlight-image" alt="highlight" />
              )}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="#"
              className={`sidebar-link ${activeTab === 'drafts' ? 'active' : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              Drafts
              {activeTab === 'drafts' && (
                <img src="../images/highlight.png" className="highlight-image" alt="highlight" />
              )}
            </Nav.Link>
          </Nav>
          <div className="col-md-6 d-flex justify-content-end align-items-center">
            <Link to="/create-invoice" className="me-2">
              <Button variant="primary">
                <FaPlus /> New Invoice
              </Button>
            </Link>
            <Link to="/recurring-invoice">
              <Button variant="primary">
                <FaPlus /> New Recurring Invoice
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="table-header mb-3 row">
        {activeTab != "drafts" ? <div className="col-md-8 d-flex align-items-center">
          <ul className="invoice-tabs nav">
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${filterStatus === 'All' ? 'active' : ''}`}
                onClick={() => setFilterStatus('All')}
              >
                All
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${filterStatus === 'Awaiting Payment' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Awaiting Payment')}
              >
                Awaiting Payment
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${filterStatus === 'Overdue' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Overdue')}
              >
                Overdue
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${filterStatus === 'Paid' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Paid')}
              >
                Paid
              </a>
            </li>
          </ul>
        </div> : <div className="col-md-8 d-flex align-items-center"></div>}

        <div className="col-md-4 d-flex justify-content-end align-items-center">
          <InputGroup style={{ width: '100%' }}>
            <InputGroup.Text id="search-icon" style={{ position: 'absolute', left: '10px', top: '12px', background: 'none', border: 'none', padding: '0', zIndex: '1' }}>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="search"
              value={customerName}
              placeholder="Search Invoice# or client name"
              style={{ border: 'none', borderRadius: '10px', boxShadow: 'none', paddingLeft: '40px', height: '38px', width: '100%' }}
              onChange={(e) => { setCustomerName(e.target.value) }}
            />
          </InputGroup>
        </div>
      </div>

      <div className="table-responsive">
        <Table hover className="invoice-table">
          <thead>
            <tr>
              {/* <th><input type="checkbox" /></th> */}
              <th>Invoice#</th>
              <th>Invoice Date</th>
              <th>Customer</th>
              <th>Mobile Number</th>
              {activeTab != "drafts" && <th>Status</th>}
              <th>Total Amount</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.map((invoice, index) => (
              <tr key={index}>
                {/* <td><input type="checkbox" /></td> */}
                <td><a href="#">{((page - 1) * limit) + index + 1}</a></td>
                <td>{moment(invoice.createdAt).format("DD MM YYYY")}</td>
                <td>{invoice.name}</td>
                <td>{invoice?.country_code + invoice?.mobile_no}</td>
                {activeTab != "drafts" && <td>
                  <Badge
                    pill
                    bg={invoice?.status == 2 ? 'success' : invoice?.status == 1 ? 'danger' : 'warning'}
                    className="invoice-status"
                  >
                    {invoice?.status == 2 ? "Complete":"Pending"}
                  </Badge>
                </td>}
                <td>{invoice?.amount}</td>
                <td>{invoice?.remark}</td>
                <td>
                  <div className='flex'>
                    <Dropdown.Item onClick={()=>{
handleCopy(invoice._id)
                    }}>
                      <img
                        src="../images/copy.png"
                        alt="Copy"
                        className="me-2"
                        style={{ width: '16px', height: '16px' }}
                      />
                    </Dropdown.Item>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="light" id="dropdown-basic" className="action-icon">
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {/* <Dropdown.Item href="#">View</Dropdown.Item> */}
                        <Dropdown.Item onClick={()=>{
                          handleEdit(invoice)
                        }} >Edit</Dropdown.Item>
                        {activeTab == "drafts" && <Dropdown.Item onClick={()=>{
                          deleteDraft(invoice?._id)
                        }} >Delete</Dropdown.Item>}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="pagination-container d-flex align-items-center justify-content-between mt-3">
        <div className="pagination-info d-flex align-items-center">
          <span className="me-2">Showing</span>
          <Form.Select onChange={(e)=>{
            setLimit(e.target.value)
          }} size="sm" className="entries-select">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Form.Select>
          <span className="ms-2">of {invoiceData?.length} entries</span>
        </div>
        <ul className="pagination mb-0">
          {page > 1 && <li className="page-item"
          onClick={()=>{
            setPage(page-1)
          }}
          ><a className="page-link" >Previous</a></li>}
          <li className="page-item" 
          ><a style={{
            color: "red"
          }} className="page-link" >{page}</a></li>
          {total.page >= page + 1 && <li className="page-item" onClick={() => {
            setPage(page + 1)
          }}><a  className="page-link" >{page + 1}</a></li>}
          {total.page >= page + 2 && <li 
          onClick={() => {
            setPage(page + 2)
          }} className="page-item"><a className="page-link" >{page + 2}</a></li>}
          {total.isNext && <li onClick={() => {
            setPage(page + 1)
          }} className="page-item"><a className="page-link" >Next</a></li>}
        </ul>
      </div>
    </div>
  );
};

export default InvoiceTable;
