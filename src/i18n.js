// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      "Create Invoice": "Create Invoice",
      "Choose Language": "Choose Language",
      "Currency": "Currency",
      "Mobile Number": "Mobile Number",
      "Customer Name": "Customer Name",
      "Remarks": "Remarks",
      "Send Invoice Via": "Send Invoice Via",
      "SMS": "SMS",
      "Email": "Email",
      "WhatsApp": "WhatsApp",
      "Save Draft": "Save Draft",
      "Send Invoice": "Send Invoice",
      "Enter Amount": "Enter Amount",
      "Enter Mobile Number": "Enter Mobile Number",
      "Enter Customer Name": "Enter Customer Name",
      "Write Purpose, Notes": "Write Purpose, Notes"
    }
  },
  ar: {
    translation: {
      "Create Invoice": "إنشاء فاتورة",
      "Choose Language": "اختر اللغة",
      "Currency": "العملة",
      "Mobile Number": "رقم الهاتف المحمول",
      "Customer Name": "اسم الزبون",
      "Remarks": "ملاحظات",
      "Send Invoice Via": "إرسال الفاتورة عبر",
      "SMS": "رسالة نصية",
      "Email": "البريد الإلكتروني",
      "WhatsApp": "واتس اب",
      "Save Draft": "حفظ المسودة",
      "Send Invoice": "إرسال الفاتورة",
      "Enter Amount": "أدخل المبلغ",
      "Enter Mobile Number": "أدخل رقم الهاتف المحمول",
      "Enter Customer Name": "أدخل اسم الزبون",
      "Write Purpose, Notes": "اكتب الغرض أو الملاحظات"
    }
  }
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en', // fallback language if translation is missing
  interpolation: {
    escapeValue: false // React already handles escaping
  }
});

export default i18n;
    