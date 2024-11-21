import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Sidebar from './Sidebar';
import InvoiceOverview from './InvoiceOverview';
import { Container, Row, Col } from 'react-bootstrap';
import '../css/Dashboard.css';
import '../i18n'; // Import i18n setup
import { CreateInvoiceApi } from '../services/api';
import Select from 'react-select';
import { countryOptions } from '../Data/country';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';


const CreateInvoice = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const draftData = location.state;
  console.log("🚀 ~ CreateInvoice ~ draftData:", draftData)
  const draftDataCountryCode = countryOptions.find(item=>{
    return item?.value == draftData?.country_code
  })
  console.log("🚀 ~ draftDataCountryCode ~ draftDataCountryCode:", draftDataCountryCode)
  console.log("🚀 ~ CreateInvoice ~ draftData:", draftData)
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [mobileNumber, setMobileNumber] = useState(draftData ? draftData.mobile_no:'');
  const [countryCode, setCountryCode] = useState(draftData ? draftDataCountryCode:countryOptions[0]); // Default to Bahrain

  const [email, setEmail] = useState(draftData ? draftData.email:"");
  const [name, setName] = useState(draftData ? draftData.name:'');
  const [amount, setAmount] = useState(draftData ? draftData.amount:'');
  const [remark, setRemark] = useState(draftData ? draftData.remark:'');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [sendVia, setSendVia] = useState({ sms: false, email: false, whatsapp: false });
  const handleCountryCodeChange = (selectedOption) => {
    setCountryCode(selectedOption);
  };
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const validateMobileNumber = (number) => {
    const regex = /^[0-9]{8,10}$/;
    if (!regex.test(number)) {
      setMobileError('Mobile number must be between 8 and 10 digits.');
      return false;
    } else {
      setMobileError('');
      return true;
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleMobileChange = (e) => {
    if (e.target.value.length > 10) return
    const number = e.target.value;
    setMobileNumber(number);
    validateMobileNumber(number);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    validateEmail(emailValue);
  };
  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    setName(nameValue);
  };
  const handleRemarkChange = (e) => {
    const remarkValue = e.target.value;
    setRemark(remarkValue);
  };
  const handleSendViaChange = (e) => {
    const { id, checked } = e.target;
    setSendVia(prev => ({ ...prev, [id]: checked }));
  };

  useEffect(() => {
    // Check if both mobile number and email are valid to enable the form submission button
    if (validateMobileNumber(mobileNumber) && validateEmail(email)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [mobileNumber, email]);

  const saveDraft = async () => {
    try {
      const body = {
        amount,
        mobile_no: mobileNumber,
        name,
        remark,
        email,
        sendAtSMS: sendVia.sms,
        sendAtMail: sendVia.email,
        sendAtWhatsapp: sendVia.whatsapp,
        saveAsDraft: true,
        country_code:countryCode.value
      }
      if(draftData){
        body.draftId =draftData._id
      }
      console.log("🚀 ~ saveDraft ~ body:", body)
      const response = await CreateInvoiceApi(body);
      console.log('Draft saved', response);
      navigate("/")
      alert("draft saved successfully")
      toast.success(t('draft saved successfully'), {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const sendInvoice = async () => {
    try {
      const body = {
        amount,
        mobile_no: mobileNumber,
        name,
        remark,
        email,
        sendAtSMS: sendVia.sms,
        sendAtMail: sendVia.email,
        sendAtWhatsapp: sendVia.whatsapp,
        saveAsDraft: false,
        country_code:countryCode.value,
        type:1
      }
      if(draftData){
        body.draftId =draftData._id
      }
      console.log("🚀 ~ sendInvoice g ~ body:", body)
      const response = await CreateInvoiceApi(body);
      navigate("/")
      alert("invoice create successfully")
      toast.success(t('invoice create successfully'), {
        position: 'top-right',
        autoClose: 3000,
      });
      console.log('Draft saved', response);
      
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      if (sendVia.sms || sendVia.email || sendVia.whatsapp) {
        sendInvoice();
      } else {
        saveDraft();
      }
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Header />
        <Container fluid>
          <InvoiceOverview />
          <Row>
            <Col>
              <div className="container mt-5">
                <div className="card bg-sh">
                  <div className="card-header bg-white">
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <h4>{t('Create Invoice')}</h4>
                      </div>
                      <div className="col-md-9 d-flex justify-content-end align-items-center">
                        <h6 className="mx-3">{t('Choose Language')}:</h6>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            id="english"
                            name="language"
                            className="form-check-input"
                            checked={language === 'en'}
                            onChange={() => handleLanguageChange('en')}
                          />
                          <label htmlFor="english" className="form-check-label">
                            English
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            id="arabic"
                            name="language"
                            className="form-check-input"
                            checked={language === 'ar'}
                            onChange={() => handleLanguageChange('ar')}
                          />
                          <label htmlFor="arabic" className="form-check-label">
                            Arabic
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-5">
                    <form onSubmit={handleSubmit}>
                      <div className="invoice-form p-4">
                        {/* Currency and Mobile Number */}
                        <div className="mb-3 row">
                          <div className="col-md-6">
                            <label className="form-label">
                              {t('Currency')} <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">BHD</span>
                              <input
                                type="number"
                                className="form-control form-input ammount"
                                placeholder={t('Enter Amount')}
                                required
                                onChange={(e) => setAmount(e.target.value)}
                                value={amount}
                                min={0}
                                step={2}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">
                              {t('Mobile Number')} <span className="text-danger">*</span>
                            </label>
                            <div className="input-group voice-option">
                              <Select
                                // className="form-select form-input"
                                options={countryOptions}
                                value={countryCode}
                                onChange={handleCountryCodeChange}
                                placeholder="Select country code"
                                isSearchable
                              />
                              <input
                                type="text"
                                className="form-control form-input"
                                placeholder={t('Enter Mobile Number')}
                                value={mobileNumber}
                                onChange={handleMobileChange}
                                required
                              />
                            </div>
                            {mobileError && <div className="text-danger">{mobileError}</div>}
                          </div>
                        </div>

                        {/* Email Field */}
                        <div className="mb-3 row">
                          <div className="col-md-6">
                            <label className="form-label">
                              {t('Email')} <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control form-input"
                              placeholder={t('Enter Email Address')}
                              value={email}
                              onChange={handleEmailChange}
                              required
                            />
                            {emailError && <div className="text-danger">{emailError}</div>}
                          </div>

                          {/* Customer Name */}
                          <div className="mb-3 col-md-6">
                            <label className="form-label">
                              {t('Customer Name')} <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              value={name}
                              className="form-control form-input"
                              placeholder={t('Enter Customer Name')}
                              onChange={handleNameChange}
                              required
                            />
                          </div>
                        </div>
                        {/* Remarks */}
                        <div className="mb-3">
                          <label className="form-label">
                            {t('Remarks')} <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className="form-control form-input"
                            rows="3"
                            value={remark}
                            placeholder={t('Write Purpose, Notes')}
                            onChange={(e) => { setRemark(e.target.value) }}
                            required
                          ></textarea>
                        </div>
                      </div>

                      {/* Send Invoice Via and Buttons */}
                      <div className="row mt-4">
                        <div className="col-md-6 d-flex align-items-center">
                          <label className="form-label mr-2">{t('Send Invoice Via')}:</label>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="sms"
                              checked={sendVia.sms}
                              onChange={handleSendViaChange}
                            />
                            <label className="form-check-label" htmlFor="sms">
                              {t('SMS')}
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="email"
                              checked={sendVia.email}
                              onChange={handleSendViaChange}
                            />
                            <label className="form-check-label" htmlFor="email">
                              {t('Email')}
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="whatsapp"
                              checked={sendVia.whatsapp}
                              onChange={handleSendViaChange}
                            />
                            <label className="form-check-label" htmlFor="whatsapp">
                              {t('WhatsApp')}
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6 text-end">
                          <button type="button" className="btn btn-light me-2" onClick={saveDraft}>
                            {t('Save Draft')}
                          </button>
                          <button type="submit" className="btn btn-light clr-blu" disabled={!isFormValid}>
                            {t('Send Invoice')}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateInvoice;
