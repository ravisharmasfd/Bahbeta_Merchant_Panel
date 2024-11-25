import axios from "axios";

let token = localStorage.getItem("token")

const API_URL = "https://behbeta-backend.vercel.app/api/"
console.log(process.env.REACT_APP_BACKEND_URL)
// const API_URL = "http://localhost:8080/api/"


axios.defaults.baseURL = API_URL;
let authApi = axios.create({
      baseURL: API_URL,
      headers: {
        "x-access-token":token,
      },
    });


export const SignInApi = async(data)=>{
    try {
        const response = await axios.post("auth/login",data);
        localStorage.setItem(
          'token',
          response?.data?.token,
        );
        authApi = axios.create({
          baseURL: API_URL,
          headers: {
            "x-access-token": response?.data?.token,
          },
        });
        return response.data
    } catch (error) {
        throw (error)
    }
}
export const SignUpApi = async(data) => {
  try {
      const response = await axios.post("auth/register",data);
      console.log("🚀 ~ SignUpApi ~ response:", response)
      localStorage.setItem(
        'token',
        response?.data?.token,
      );
      authApi = axios.create({
        baseURL: API_URL,
        headers: {
          "x-access-token": response?.data?.token,
        },
      });
      return response.data
     
  } catch (error) {
      throw (error)
  }
}
export const CreateInvoiceApi = async(data) => {
    try {
        const response = await authApi.post("invoice",data);
        console.log("🚀 ~ CreateInvoice ~ response:", response)
        return response.data
       
    } catch (error) {
        throw (error)
    }
  }
  export const getInvoiceSessionId = async(id) => {
    try {
        const response = await axios.get("session/"+id);
        console.log("🚀 ~ getInvoiceSessionId ~ response:", response)
        return response.data
       
    } catch (error) {
        throw (error)
    }
  }
  export const conformOrder = async(id) => {
    try {
        const response = await axios.get("status/"+id);
        console.log("🚀 ~ getInvoiceSessionId ~ response:", response)
        return response.data
       
    } catch (error) {
        throw (error)
    }
  }

  export const GetInvoiceApi = async(query) => {
    try {
        const response = await authApi.get("invoice",{params:query});
        console.log("🚀 ~ CreateInvoice ~ response:", response)
        return response.data
       
    } catch (error) {
        throw (error)
    }
  }

  export const DeleteInvoiceApi = async(id) => {
    try {
        const response = await authApi.delete("invoice/"+id);
        console.log("🚀 ~ CreateInvoice ~ response:", response)
        return response.data
       
    } catch (error) {
        throw (error)
    }
  }
  export const ProfileApi = async()=>{
    try {
        const response = await authApi.get("profile/");
        return response.data
    } catch (error) {
        throw (error)
    }
}