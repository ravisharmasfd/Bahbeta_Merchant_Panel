import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Sidebar from './Sidebar';
import InvoiceOverview from './InvoiceOverview';
import { Container, Row, Col } from 'react-bootstrap';
import '../css/Dashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../i18n'; // Import i18n setup
import { countryOptions } from '../Data/country';
import { useLocation, useNavigate,  } from 'react-router-dom';
import Select from 'react-select';
import { CreateInvoiceApi } from '../services/api';

const RecurringInvoice = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const draftData = location.state;

  console.log("🚀 ~ CreateInvoice ~ draftData:", draftData)
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.language || 'en');
  const draftDataCountryCode = countryOptions.find(item=>{
    return item?.value == draftData?.country_code
  })
  console.log("🚀 ~ draftDataCountryCode ~ draftDataCountryCode:", draftDataCountryCode)
  const [countryCode, setCountryCode] = React.useState(draftData ? draftDataCountryCode:countryOptions[0]); // Default to Bahrain
  const handleCountryCodeChange = (selectedOption) => {
    setCountryCode(selectedOption);
  };
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

 

  const sendInvoice = async (values) => {
    try {
      const body = {
        amount:values.amount,
        frequencyUnit:values.frequencyUnit,
        repeat_every:values.repeatFrequency,
        invoice_start_date:values.startDate,
        mobile_no: values.mobileNumber,
        name:values.name,
        remark:values.remarks,
        email:values.email,
        sendAtSMS: values.sendViaSMS,
        sendAtMail: values.sendViaEmail,
        sendAtWhatsapp: values.sendViaWhatsApp,
        saveAsDraft: false,
        country_code:countryCode.value,
        type:2
      }
      if(draftData){
        body.draftId =draftData._id
      }
      console.log("🚀 ~ sendInvoice g ~ body:", body)
      const response = await CreateInvoiceApi(body);
      toast.success(t('invoice create successfully'), {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate("/")
      
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }
  // Formik initial values and validation schema using Yup
  const formik = useFormik({
    initialValues: {
      mobileNumber:draftData? draftData.mobile_no :"",
      email: draftData? draftData.email :"",
      name:draftData? draftData.name :"",
      startDate: draftData? new Date(draftData.invoice_start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      repeatFrequency: draftData? draftData.repeat_every :1,
      frequencyUnit: draftData? draftData.frequencyUnit :"",
      amount: draftData? draftData.amount :"",
      remarks: draftData? draftData.remark :"",
      sendViaSMS: false,
      sendViaEmail: false,
      sendViaWhatsApp: false,
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string()
        .matches(/^[0-9]{8,10}$/, t('Mobile number must be between 8 and 10 digits.')).trim()
        .required(t('Mobile number is required')),
      email: Yup.string().email(t('Please enter a valid email address')).trim().required(t('Email is required')),
      name: Yup.string().trim()
        .required(t('Name is required')),
      startDate: Yup.date().required(t('Invoice start date is required')),
      repeatFrequency: Yup.number().min(1).required(t('Repeat frequency is required')),
      frequencyUnit: Yup.string().required(t('Frequency unit is required')),
      amount: Yup.number().min(0).required(t('Amount is required')),
      remarks: Yup.string().required(t('Remarks are required')),
    }),
    onSubmit: (values) => {
      console.log("🚀 ~ RecurringInvoice ~ values:", values)
      sendInvoice(values)
      // Handle form submission logic here
    },
  });
  const saveDraft = async () => {
    try {
      const values = formik.values
      console.log("🚀 ~ saveDraft ~ values:", values)
      const body = {
        amount:values.amount,
        frequencyUnit:values.frequencyUnit,
        repeat_every:values.repeatFrequency,
        invoice_start_date:values.startDate,
        mobile_no: values.mobileNumber,
        name:values.name,
        remark:values.remarks,
        email:values.email,
        sendAtSMS: values.sendViaSMS,
        sendAtMail: values.sendViaEmail,
        sendAtWhatsapp: values.sendViaWhatsApp,
        saveAsDraft: true,
        country_code:countryCode.value,
        type:2
      }
      if(draftData){
        body.draftId =draftData._id
      }
      const response = await CreateInvoiceApi(body);
      toast.success(t('draft saved successfully'), {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate("/")
    } catch (error) {
      console.error('Error saving draft:', error);
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
                      <div className="col-md-5">
                        <h4>{t('Create Recurring Invoice')}</h4>
                      </div>
                      <div className="col-md-7 d-flex justify-content-end align-items-center">
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
                            {t('English')}
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
                            {t('Arabic')}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-5">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="invoice-form p-4">
                        <div className="mb-3 row">
                          <div className="col-md-6">
                            <label className="form-label">
                              {t('Invoice Start Date')} <span className="text-danger">*</span>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              name="startDate"
                              value={formik.values.startDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              required
                            />
                            {formik.touched.startDate && formik.errors.startDate && (
                              <div className="text-danger">{formik.errors.startDate}</div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">
                              {t('Repeat Every')} <span className="text-danger">*</span>
                            </label>
                            <div className="d-flex">
                              <input
                                type="number"
                                step="1" min="1"
                                className="form-control me-2 width-number"
                                name="repeatFrequency"
                                value={formik.values.repeatFrequency}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                              />
                              <select
                                className="form-select"
                                name="frequencyUnit"
                                value={formik.values.frequencyUnit}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                              >
                                <option>{t('Select Frequency')}</option>
                                <option value="day">{t('Day')}</option>
                                <option value="week">{t('Week')}</option>
                                <option value="month">{t('Month')}</option>
                                <option value="year">{t('Year')}</option>
                              </select>
                            </div>
                            {formik.touched.frequencyUnit && formik.errors.frequencyUnit && (
                              <div className="text-danger">{formik.errors.frequencyUnit}</div>
                            )}
                          </div>
                          
                        </div>

                        <div className="mb-3 row">
                        <div className="col-md-6">
                            <label className="form-label">
                              {t('Currency')} <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">BHD</span>
                              <input
                                type="number"
                                min={0}
                                className="form-control"
                                name="amount"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t('Enter Amount')}
                                style={{
                                  width:"60%"
                                }}
                                required
                              />
                            </div>
                            {formik.touched.amount && formik.errors.amount && (
                              <div className="text-danger">{formik.errors.amount}</div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">
                              {t('Mobile Number')} <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                            <Select
                                // className="form-select form-input"
                                options={countryOptions}
                                value={countryCode}
                                onChange={handleCountryCodeChange}
                                placeholder="Select country code"
                                isSearchable
                              />
                              <input
                              style={{
                                width:"60%"
                              }}
                                type="text"
                                className="form-control form-input"
                                name="mobileNumber"
                                placeholder={t('Enter Mobile Number')}
                                value={formik.values.mobileNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                              />
                            </div>
                            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                              <div className="text-danger">{formik.errors.mobileNumber}</div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">
                              {t('Customer Name')} <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              placeholder={t('Enter Customer Name')}
                              value={formik.values.name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              required
                            />
                            {formik.touched.name && formik.errors.name && (
                              <div className="text-danger">{formik.errors.name}</div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">
                              {t('Email Address')} <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder={t('Enter Customer Email')}
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              required
                            />
                            {formik.touched.email && formik.errors.email && (
                              <div className="text-danger">{formik.errors.email}</div>
                            )}
                          </div>
                        </div>

                        <div className="mb-3 row">
                          

                          <div className="col-md-12">
                            <label className="form-label">
                              {t('Remarks')} <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="remarks"
                              placeholder={t('Enter Remarks')}
                              value={formik.values.remarks}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              required
                            />
                            {formik.touched.remarks && formik.errors.remarks && (
                              <div className="text-danger">{formik.errors.remarks}</div>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            {t('Send Invoice')} <span className="text-danger">*</span>
                          </label>
                          <div className="row">
                            <div className="col-md-4">
                              <input
                                type="checkbox"
                                className="form-check-input me-1"
                                id="sendViaSMS"
                                name="sendViaSMS"
                                checked={formik.values.sendViaSMS}
                                onChange={formik.handleChange}
                              />
                              <label htmlFor="sendViaSMS">{t('Send via SMS')}</label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="checkbox"
                                className="form-check-input me-1"
                                id="sendViaEmail"
                                name="sendViaEmail"
                                checked={formik.values.sendViaEmail}
                                onChange={formik.handleChange}
                              />
                              <label htmlFor="sendViaEmail">{t('Send via Email')}</label>
                            </div>
                            {/* <div className="col-md-4">
                              <input
                                type="checkbox"
                                className="form-check-input me-1"
                                id="sendViaWhatsApp"
                                name="sendViaWhatsApp"
                                checked={formik.values.sendViaWhatsApp}
                                onChange={formik.handleChange}
                              />
                              <label htmlFor="sendViaWhatsApp">{t('Send via WhatsApp')}</label>
                            </div> */}
                          </div>
                        </div>

                        <div className="col-md-6 text-end">
                          <button type="button" className="btn btn-light me-2" onClick={saveDraft}>
                            {t('Save Draft')}
                          </button>
                          <button type="submit" className="btn btn-light clr-blu" >
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

export default RecurringInvoice;
