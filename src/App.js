import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Components/Dashboard';
import CreateInvoice from './Components/CreateInvoice';
import RecurringInvoice from './Components/RecurringInvoice';
import './css/Dashboard.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';  // Import the i18n configuration
import Login from './Pages/login';
import { ProfileApi } from './services/api';
import GuestRoute from './utils/GuestRoute';
import SecureRoute from './utils/SecureRoute';
import { UserContext } from './store/context';
import PaymentPage from './Components/payment';
import TransactionPage from './Components/Transaction';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  // const {user,setUser} = useContext(UserContext);
  const [user,setUser] = useState(null);
  const onLoadApp = async()=>{
    try {
      setLoading(true);
      const adminData = await ProfileApi()
      console.log("🚀 ~ onLoadApp ~ adminData:", adminData);   
      setUser(adminData) 
    } catch (error) {
      console.log("🚀 ~ onLoadApp ~ error:", error)
      setUser(null)
      localStorage.clear()
      
    }finally{
      setLoading(false)
      setAppLoaded(true)
    }
  }
  useEffect(()=>{onLoadApp()},[])
  return (
    <UserContext.Provider value={{user , setUser, appLoaded}}>
    <I18nextProvider i18n={i18n}>  {/* Wrap the app with I18nextProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SecureRoute><Dashboard /></SecureRoute>} />
          <Route path="/payment" element={<TransactionPage/>} />
          <Route path="/transaction" element={<PaymentPage/>} />

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="create-invoice" element={<SecureRoute><CreateInvoice /></SecureRoute>} />
          <Route path="recurring-invoice" element={<SecureRoute><RecurringInvoice /></SecureRoute>} />
        </Routes>
      </BrowserRouter>
    </I18nextProvider>
    </UserContext.Provider>
  );
};

export default App;
