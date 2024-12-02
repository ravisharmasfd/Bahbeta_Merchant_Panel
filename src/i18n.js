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
      "Write Purpose, Notes": "Write Purpose, Notes",
      "Email ":"Email",
      "Enter Email":"Enter Email",
      "Overdue Date":"Overdue Date",
      "Product Description":"Product Description",
      "Unit Cost":"Unit Cost",
      "Quantity":"Quantity",
      "Add More":"Add More",
      "Delete":"Delete",
      "Do you want to include VAT?":"Do you want to include VAT?",
      "Yes":"Yes",
      "No":"No",
      "VAT":"VAT",
      "Total Amount":"Total Amount",
      "Enter Product Description":"Enter Product Description",
      "Enter Unit Cost":"Enter Unit Cost",
      "Enter Quantity":"Enter Quantity",
      "Customer name is required.":  "Customer name is required.",
      "Mobile number is required.": "Mobile number is required.",
      "Mobile number must be between 8 and 10 digits.":"Mobile number must be between 8 and 10 digits.",
      "Email is required.":"Email is required.",
      "Product description is required.":"Product description is required.",
      "Unit cost is required.":"Unit cost is required.",
      "Quantity is required.": "Quantity is required.",
      "Overdue date is required.":"Overdue date is required."
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
      "Write Purpose, Notes": "اكتب الغرض أو الملاحظات",
      "Email ":"بريد إلكتروني",
      "Enter Email":"أدخل البريد الإلكتروني",
      "Overdue Date":"تاريخ الاستحقاق",
      "Product Description":"وصف المنتج",
      "Unit Cost":"تكلفة الوحدة",
      "Quantity":"كمية",
      "Add More":"أضف المزيد",
      "Delete":"يمسح",
      "Do you want to include VAT?":"هل تريد تضمين ضريبة القيمة المضافة؟",
      "Yes":"نعم",
      "No":"لا",
      "VAT":"ضريبة القيمة المضافة",
      "Total Amount":"المبلغ الإجمالي",
      "Enter Product Description":"أدخل وصف المنتج",
      "Enter Unit Cost":"أدخل تكلفة الوحدة",
      "Enter Quantity":"أدخل الكمية",
      "Customer name is required.":"اسم العميل مطلوب.",
      "Mobile number is required.":"رقم الجوال مطلوب.",
      "Mobile number must be between 8 and 10 digits.":"رقم الجوال يجب أن يكون بين 8 و 10 أرقام.",
      "Email is required.":"البريد الإلكتروني مطلوب.",
      "Product description is required.":"وصف المنتج مطلوب.",
      "Unit cost is required.":"تكلفة الوحدة مطلوبة.",
      "Quantity is required.":"الكمية مطلوبة.",
      "Overdue date is required.":"التاريخ المتأخر مطلوب."
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
    