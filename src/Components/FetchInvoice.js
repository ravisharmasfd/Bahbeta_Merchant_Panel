import axios from 'axios';
import React, { useEffect, useState } from 'react';

const FetchInvoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios.get('/api/invoices') // This request will be proxied to http://localhost:5000/api/invoices
      .then(response => {
        setInvoices(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the invoices!', error);
      });
  }, []);

  return (
    <div>
      <h1>Invoices</h1>
      <ul>
        {invoices.map(invoice => (
          <li key={invoice.id}>{invoice.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default FetchInvoices;
