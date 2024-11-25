import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { conformOrder } from '../services/api';

const PaymentPage = () => {
  const navigate = useNavigate()

  const [sessionId, setSessionId] = useState(null);
  const [orderId,setOrderId] = useState(null);

  // Function to get query parameters
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  // Extract the sessionId from query parameters
  useEffect(() => {
    const sessionIdFromQuery = query.get('session');
    const orderIdFromQuery = query.get('orderId');
    console.log("🚀 ~ useEffect ~ sessionIdFromQuery:", sessionIdFromQuery)
    if(!orderIdFromQuery || !sessionIdFromQuery){
      alert("There is some error")
    }
    if (sessionIdFromQuery) {
      setSessionId(sessionIdFromQuery);
    }
    if(orderIdFromQuery){
      setOrderId(orderIdFromQuery)
    }
  }, [query]);

  useEffect(() => {
    if (!sessionId) return;

    // Load the Mastercard script
    const script = document.createElement('script');
    script.src = "https://afs.gateway.mastercard.com/static/checkout/checkout.min.js";
    script.async = true;
    script["data-error"] = "errorCallBack";
    script["data-complete"] ="completeCallback"
    window.errorCallBack = (error) => {
      console.log("🚀 ~ useEffect ~ window error:", error)
      alert(error?.["error.explanation"])
  }
  window.completeCallback = async(data) => {
    console.log("🚀 ~ useEffect ~ window data:", data)
    const response = await conformOrder(orderId)
    navigate(`/payment?sessionId=${orderId}`)
    window.close()
}
      
    document.body.appendChild(script);

    // Configure Mastercard Checkout once the script is loaded
    script.onload = () => {
      
      window.Checkout.configure({
        session: {
          id: sessionId,
        },

      });
      showEmbeddedPage()
    };
    return () => {
      document.body.removeChild(script);
    };
  }, [sessionId]);

  // Event handlers to show embedded or payment page
  const showEmbeddedPage = () => {
    if (window.Checkout) {
      window.Checkout.showEmbeddedPage('#embed-target');
    }
  };

  const showPaymentPage = () => {
    if (window.Checkout) {
      window.Checkout.showPaymentPage();
    }
  };

  return (
    <div>
      <div id="embed-target"></div>
      {/* <button onClick={showEmbeddedPage}>Pay with Embedded Page</button> */}
      {/* <button onClick={showPaymentPage}>Pay with Payment Page</button> */}
    </div>
  );
};

export default PaymentPage;
