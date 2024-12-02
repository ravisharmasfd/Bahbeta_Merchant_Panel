import React, { useState } from 'react';
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
import { useLocation, useNavigate, } from 'react-router-dom';
import Select from 'react-select';
import { CreateInvoiceApi } from '../services/api';

const RecurringInvoice = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const draftData = location.state;

  console.log("🚀 ~ CreateInvoice ~ draftData:", draftData)
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.language || 'en');
  const [includeVAT, setIncludeVAT] = useState(true);
  const draftDataCountryCode = countryOptions.find(item => {
    return item?.value == draftData?.country_code
  })
  console.log("🚀 ~ draftDataCountryCode ~ draftDataCountryCode:", draftDataCountryCode)
  const [countryCode, setCountryCode] = React.useState(draftData ? draftDataCountryCode : countryOptions[0]); // Default to Bahrain
  const handleCountryCodeChange = (selectedOption) => {
    setCountryCode(selectedOption);
  };
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };


  const addProduct = () => {
    formik.setFieldValue('products', [
      ...formik.values.products,
      { productDescription: '', unitCost: '', quantity: '' },
    ]);
  };

  const removeProduct = (index) => {
    const newProducts = formik.values.products.filter((_, i) => i !== index);
    formik.setFieldValue('products', newProducts);
  };

  const handleSendViaChange = (event) => {
    const { id, checked } = event.target;
    formik.setFieldValue(`sendVia.${id}`, checked);
  };

  const sendInvoice = async (values) => {
    try {
      const body = {
        amount: values.amount,
        frequencyUnit: values.frequencyUnit,
        repeat_every: values.repeatFrequency,
        invoice_start_date: values.startDate,
        mobile_no: values.mobileNumber,
        name: values.name,
        remark: values.remarks,
        email: values.email,
        sendAtSMS: values.sendViaSMS,
        sendAtMail: values.sendViaEmail,
        sendAtWhatsapp: values.sendViaWhatsApp,
        saveAsDraft: false,
        country_code: countryCode.value,
        type: 2
      }
      if (draftData) {
        body.draftId = draftData._id
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
      name: draftData ? draftData.name : "",
      mobileNumber: draftData ? draftData.mobileNumber : "",
      email: draftData ? draftData.email : "",
      includeVAT: draftData ? draftData.includeVAT : true,
      sendVia: {
        sms: draftData ? draftData.sendVia.sms : false,
        email: draftData ? draftData.sendVia.email : false,
        whatsapp: draftData ? draftData.sendVia.whatsapp : false,
      },
      saveAsDraft: false,
      countryCode: draftData ? draftData.countryCode : countryOptions[0].value,
      products: draftData?.products?.length > 0 
        ? draftData.products.map(product => ({
            productDescription: product.productDescription || '',
            unitCost: product.unitCost || '',
            quantity: product.quantity || '',
          }))
        : [
            {
              productDescription: '',
              unitCost: '',
              quantity: '',
            },
          ],
      overdue: draftData ? draftData.overdue : '',
      remarks: draftData ? draftData.remarks : '',
      amount: draftData ? draftData.amount : '',
      repeatFrequency: draftData ? draftData.repeatFrequency : 1,
      frequencyUnit:draftData ? draftData.frequencyUnit : '',
    }
,    
    validationSchema: Yup.object({
      name: Yup.string().required(t('Customer name is required.')),
      mobileNumber: Yup.string()
        .matches(/^\d{8,10}$/, t('Mobile number must be between 8 and 10 digits.'))
        .required(t('Mobile number is required.')),
      email: Yup.string().email(t('Invalid email address')).required(t('Email is required.')),
      products: Yup.array().of(
        Yup.object().shape({
          productDescription: Yup.string().required(t('Product description is required.')),
          unitCost: Yup.number().required(t('Unit cost is required.')),
          quantity: Yup.number().required(t('Quantity is required.')),
        })
      ),
      overdue: Yup.date().required(t('Overdue date is required.')),
      countryCode: Yup.object().required('Please select a country code'),
    }),
    onSubmit: (values) => {
      // value.
      let value=calculateTotalAmount()
      values.amount = formik.values.includeVAT ? parseFloat((value * 0.10).toFixed(2)) : 0; // Convert vatAmount back to a number
      console.log('Form Submitted:', values);
        if (values.sendVia.sms || values.sendVia.email || values.sendVia.whatsapp) {
          sendInvoice(values);
        } else {
          saveDraft(values);
        }
    },
  });
  const calculateTotalAmount = () => {
    const total = formik.values.products.reduce((acc, product) => {
      const unitCost = parseFloat(product.unitCost) || 0;
      const quantity = parseFloat(product.quantity) || 0;
      return acc + unitCost * quantity;
    }, 0);

    return total;
  };
  
  const totalAmount = calculateTotalAmount();
  // const formik = useFormik({
  //   initialValues: {
  //     mobileNumber: draftData ? draftData.mobile_no : "",
  //     email: draftData ? draftData.email : "",
  //     name: draftData ? draftData.name : "",
  //     startDate: draftData ? new Date(draftData.invoice_start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  //     repeatFrequency: draftData ? draftData.repeat_every : 1,
  //     frequencyUnit: draftData ? draftData.frequencyUnit : "",
  //     amount: draftData ? draftData.amount : "",
  //     remarks: draftData ? draftData.remark : "",
  //     sendViaSMS: false,
  //     sendViaEmail: false,
  //     sendViaWhatsApp: false,
  //   },
  //   validationSchema: Yup.object({
  //     mobileNumber: Yup.string()
  //       .matches(/^[0-9]{8,10}$/, t('Mobile number must be between 8 and 10 digits.')).trim()
  //       .required(t('Mobile number is required')),
  //     email: Yup.string().email(t('Please enter a valid email address')).trim().required(t('Email is required')),
  //     name: Yup.string().trim()
  //       .required(t('Name is required')),
  //     startDate: Yup.date().required(t('Invoice start date is required')),
  //     repeatFrequency: Yup.number().min(1).required(t('Repeat frequency is required')),
  //     frequencyUnit: Yup.string().required(t('Frequency unit is required')),
  //     amount: Yup.number().min(0).required(t('Amount is required')),
  //     remarks: Yup.string().required(t('Remarks are required')),
  //   }),
  //   onSubmit: (values) => {
  //     console.log("🚀 ~ RecurringInvoice ~ values:", values)
  //     sendInvoice(values)
  //     // Handle form submission logic here
  //   },
  // });
  const saveDraft = async () => {
    try {
      const values = formik.values
      console.log("🚀 ~ saveDraft ~ values:", values)
      const body = {
        amount: values.amount,
        frequencyUnit: values.frequencyUnit,
        repeat_every: values.repeatFrequency,
        invoice_start_date: values.startDate,
        mobile_no: values.mobileNumber,
        name: values.name,
        remark: values.remarks,
        email: values.email,
        sendAtSMS: values.sendViaSMS,
        sendAtMail: values.sendViaEmail,
        sendAtWhatsapp: values.sendViaWhatsApp,
        saveAsDraft: true,
        country_code: countryCode.value,
        type: 2
      }
      if (draftData) {
        body.draftId = draftData._id
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
          <div className="mb-3 col-md-6">
            <label className="form-label">
              {t('Customer Name')} <span className="text-danger">*</span>
            </label>
            <input
              name="name"
              type="text"
              className="form-control form-input"
              placeholder={t('Enter Customer Name')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-danger">{formik.errors.name}</div>
            ) : null}
          </div>

          {/* Mobile Number */}
          <div className="col-md-6">
            <label className="form-label">
              {t('Mobile Number')} <span className="text-danger">*</span>
            </label>
            <div className="input-group voice-option">
            <Select
          options={countryOptions}
          placeholder={t('Select country code')}
          isSearchable
          value={formik.values.countryCode}
          onChange={(selectedOption) => formik.setFieldValue('countryCode', selectedOption.value)}
          onBlur={() => formik.setFieldTouched('countryCode', true)}
        />
              <input
                name="mobileNumber"
                type="text"
                className="form-control form-input inputMobile"
                placeholder={t('Enter Mobile Number')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobileNumber}
              />
            </div>
            {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
              <div className="text-danger">{formik.errors.mobileNumber}</div>
            ) : null}
          </div>

          <div className="col-md-6 mb-3">
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
    <div className="col-md-6 mb-3">
      <label className="form-label">
        {t('Repeat Every')} <span className="text-danger">*</span>
      </label>
      <div className="d-flex">
      <input
  type="number"
  step="1"
  min="1"
  className="form-control me-2 width-number"
  name="repeatFrequency"
  value={formik.values.repeatFrequency}
  onChange={(e) => {
    const value = e.target.value;
    if (value === '' || parseInt(value) < 1) {
      formik.setFieldValue('repeatFrequency', 1);
    } else {
      formik.handleChange(e);
    }
  }}
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
          {/* Email */}
          <div className="col-md-6">
            <label className="form-label">
              {t('Email')} <span className="text-danger">*</span>
            </label>
            <input
              name="email"
              type="email"
              className="form-control form-input"
              placeholder={t('Enter Email')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-danger">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="col-md-6">
            <label className="form-label">
              {t('Overdue Date')} <span className="text-danger">*</span>
            </label>
            <input
              name="overdue"
              type="date"
              className="form-control form-input"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.overdue}
              min={new Date().toISOString().split('T')[0]}
            />
            {formik.touched.overdue && formik.errors.overdue ? (
              <div className="text-danger">{formik.errors.overdue}</div>
            ) : null}
          </div>
        </div>
          {/* Overdue Date */}
         

        {/* Products Section */}
        {formik.values.products.map((product, index) => (
          <div key={index} className="mb-4 row">
            {/* Product Description */}
            <div className="col-md-4">
              <label className="form-label">
                {t('Product Description')} <span className="text-danger">*</span>
              </label>
              <input
                name={`products[${index}].productDescription`}
                type="text"
                className="form-control form-input"
                placeholder={t('Enter Product Description')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.products[index].productDescription}
              />
              {formik.touched.products?.[index]?.productDescription &&
              formik.errors.products?.[index]?.productDescription ? (
                <div className="text-danger">
                  {formik.errors.products[index].productDescription}
                </div>
              ) : null}
            </div>

            {/* Unit Cost */}
            <div className="col-md-3">
              <label className="form-label">
                {t('Unit Cost')} <span className="text-danger">*</span>
              </label>
              <input
                name={`products[${index}].unitCost`}
                type="number"
                className="form-control form-input"
                placeholder={t('Enter Unit Cost')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.products[index].unitCost}
              />
              {formik.touched.products?.[index]?.unitCost &&
              formik.errors.products?.[index]?.unitCost ? (
                <div className="text-danger">{formik.errors.products[index].unitCost}</div>
              ) : null}
            </div>

            {/* Quantity */}
            <div className="col-md-3">
              <label className="form-label">
                {t('Quantity')} <span className="text-danger">*</span>
              </label>
              <input
                name={`products[${index}].quantity`}
                type="number"
                className="form-control form-input"
                placeholder={t('Enter Quantity')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.products[index].quantity}
              />
              {formik.touched.products?.[index]?.quantity &&
              formik.errors.products?.[index]?.quantity ? (
                <div className="text-danger">{formik.errors.products[index].quantity}</div>
              ) : null}
            </div>

            {/* Add / Delete Button */}
            <div className="col-md-2 d-flex align-items-end">
              {index === 0 ? (
                <button type="button" className="btn btn-primary" onClick={addProduct}>
                  {t('Add More')}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeProduct(index)}
                >
                  {t('Delete')}
                </button>
              )}
            </div>
          </div>
        ))}
   {/* VAT Options */}
   <div className="row align-items-center mb-3">
  {/* Do you want to include VAT? */}
  <div className="col-md-4">
    <label className="form-label">{t('Do you want to include VAT?')}</label>
    <div className="d-flex align-items-center">
      <div className="form-check me-3">
        <input
          type="radio"
          id="includeVATYes"
          name="includeVAT"
          className="form-check-input"
          checked={formik.values.includeVAT}
          onChange={() => formik.setFieldValue('includeVAT', true)}
        />
        <label className="form-check-label" htmlFor="includeVATYes">
          {t('Yes')}
        </label>
      </div>
      <div className="form-check">
        <input
          type="radio"
          id="includeVATNo"
          name="includeVAT"
          className="form-check-input"
          checked={!formik.values.includeVAT}
          onChange={() => formik.setFieldValue('includeVAT', false)}
        />
        <label className="form-check-label" htmlFor="includeVATNo">
          {t('No')}
        </label>
      </div>
    </div>
  </div>

  {/* VAT Amount */}
  {formik.values.includeVAT && (
        <div className="col-md-4">
          <label className="form-label">{t('VAT')}</label>
          <input
            type="text"
            value={10}
            readOnly
            className="form-control"
          />
        </div>
      )}


  {/* Total Amount */}
  <div className="col-md-4">
    <label className="form-label">{t('Total Amount')}</label>
    <input
      type="text"
      value={
        formik.values.includeVAT
          ? (totalAmount + (totalAmount * 10) / 100).toFixed(2)
          : totalAmount.toFixed(2)
      }
      readOnly
      className="form-control"
    />
  </div>
</div>

        {/* Remarks */}
        <div className="mb-3">
          <label className="form-label">{t('Remarks')}</label>
          <textarea
            name="remarks"
            className="form-control form-input"
            rows="3"
            onChange={formik.handleChange}
            value={formik.values.remarks}
          />
        </div>
        <div className="row mt-4">
        <div className="col-md-6 d-flex align-items-center">
          <label className="form-label mr-2">{t('Send Invoice Via')}:</label>

          {/* SMS Checkbox */}
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="sms"
              checked={formik.values.sendVia.sms}
              onChange={handleSendViaChange}
            />
            <label className="form-check-label" htmlFor="sms">
              {t('SMS')}
            </label>
          </div>

          {/* Email Checkbox */}
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="email"
              checked={formik.values.sendVia.email}
              onChange={handleSendViaChange}
            />
            <label className="form-check-label" htmlFor="email">
              {t('Email')}
            </label>
          </div>

          {/* WhatsApp Checkbox */}
          {/* <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="whatsapp"
              checked={formik.values.sendVia.whatsapp}
              onChange={handleSendViaChange}
            />
            <label className="form-check-label" htmlFor="whatsapp">
              {t('WhatsApp')}
            </label>
          </div> */}
        </div>
      </div>
        {/* Submit Button */}
        
        <div className="text-end">
        <button type="button" className="btn btn-light me-2" onClick={saveDraft}>
                            {t('Save Draft')}
                          </button>
          <button type="submit" className="btn btn-light clr-blu">
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






{/* <form onSubmit={formik.handleSubmit}>
<div className="invoice-form p-4">
  <div className="mb-3 row">

    <div className="col-md-6 mb-3">
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
    <div className="col-md-6 mb-3">
      <label className="form-label">
        {t('Mobile Number')} <span className="text-danger">*</span>
      </label>
      <div className="input-group">
        <Select
          options={countryOptions}
          value={countryCode}
          onChange={handleCountryCodeChange}
          placeholder="Select country code"
          isSearchable
        />
        <input
          style={{
            width: "60%"
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
    <div className="col-md-6 mb-3">
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
   

    <div className="col-md-6 mb-3">
      <label className="form-label">
        {t('Product Description')} <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        className="form-control"
        name="email"
        placeholder={t('Enter Product Description')}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        required
      />
      {formik.touched.email && formik.errors.email && (
        <div className="text-danger">{formik.errors.email}</div>
      )}
    </div>
    <div className="col-md-3 mb-3">
      <label className="form-label">
        {t('Unit Cost')} <span className="text-danger">*</span>
      </label>
      <input
        type="tel"
        className="form-control form-input"
        placeholder={t('Enter Unit Cost')}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        required
      />
      {formik.touched.email && formik.errors.email && (
        <div className="text-danger">{formik.errors.email}</div>
      )}
    </div>
    <div className="col-md-3 mb-3">
      <label className="form-label">
        {t('Quantity')} <span className="text-danger">*</span>
      </label>
      <input
        type="number"
        className="form-control form-input"
        placeholder={t('Enter Quantity')}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        required
      />
      {formik.touched.email && formik.errors.email && (
        <div className="text-danger">{formik.errors.email}</div>
      )}
    </div>
    <div className="col-md-3">
      <label className="form-label">
        {t('Currency')} <span className="text-danger">*</span>
      </label>
      <div className="input-group input-group-text">
        <span className="">BHD</span>
      </div>
    </div>
    <div className='col-md-3'>
      <label className="form-label">
        {t('Amount')} <span className="text-danger">*</span>
      </label>
      <input
        type="number"
        min={0}
        className="form-control"
        name="amount"
        value={formik.values.amount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={t('Enter Amount')}

        required
      />
    </div>
    <div className="col-md-6 mb-3">
      <label className="form-label">
        {t('VAT  ')} <span className="text-danger">*</span>
      </label>
      <input
        type="tel"
        className="form-control form-input"
        placeholder={t('Enter Vat Number')}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        required
      />
      {formik.touched.email && formik.errors.email && (
        <div className="text-danger">{formik.errors.email}</div>
      )}
    </div>
  

    

            <div className="col-md-6 mb-3">
      <label className="form-label">
        {t('Overdue  ')} <span className="text-danger">*</span>
      </label>
      <input
        type="date"
        className="form-control form-input"
        placeholder={t('Enter Amount')}
        value={formik.values.amount}
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
  <div className='row'>
    <div className="mb-3 col-md-6">
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
       
      </div>
    </div>

    <div className="col-md-6 text-end self-end">
      <button type="button" className="btn btn-light me-2" onClick={saveDraft}>
        {t('Save Draft')}
      </button>
      <button type="submit" className="btn btn-light clr-blu" >
        {t('Send Invoice')}
      </button>
    </div>
  </div>
</div>
</form> */}