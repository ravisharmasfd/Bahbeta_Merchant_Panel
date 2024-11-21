import React, { useEffect, useState } from "react";
import "../App.css"; // Optional: For moving styles to a CSS file
import { useLocation, useNavigate } from "react-router-dom";
import { getInvoiceSessionId } from "../services/api";

const TransactionPage = () => {
    const [sessionId, setSessionId] = useState(null);

    // Function to get query parameters
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const sessionIdFromQuery = query.get('sessionId');
    console.log("🚀 ~ TransactionPage ~ sessionIdFromQuery:", sessionIdFromQuery)
    const [InvoiceData , setInvoiceData] = useState(null);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate()
    const fetchSession = async ()=>{
        try {
            setLoading(true)
        if (!sessionIdFromQuery) {
          navigate("/")
          setLoading(false)
          return
        }
        const data = await getInvoiceSessionId(sessionIdFromQuery)
        console.log("🚀 ~ fetchSession ~ res:", data?.season?.session?.id)
        setInvoiceData(data.data);
        setSessionId(data?.season?.session?.id)
                
        } catch (error) {
            console.log("🚀 ~ fetchSession ~ error:", error?.response?.data?.message)
            
        }
        finally{
            setLoading(false)
        }
    }
    const handlePayment = async()=>{
        if(sessionId){
            navigate("/transaction?session="+sessionId)
        }else{
            alert("There some error while payment")
        }
    }
    // Extract the sessionId from query parameters
      useEffect(() => {
        fetchSession()
      }, [sessionIdFromQuery]);
    return (
        <div className="model">
            <div className="heade-model">
                <div className="logo">
                    <h1>bb</h1>
                </div>
                <h4 className="m-3">Bahbeta</h4>
                <div className="d-flex images">
                    <div className="mx-2">
                        <img style={{
                            mixBlendMode: "multiply"
                        }} src="fb.jpeg" alt="Facebook" width="25px" />
                    </div>
                    <div className="mx-2">
                        <img style={{
                            mixBlendMode: "multiply"
                        }} src="x.jpeg" alt="Twitter" width="25px" />
                    </div>
                    <div className="mx-2">
                        <img style={{
                            mixBlendMode: "multiply"
                        }} src="linkdin.jpeg" alt="LinkedIn" width="25px" />
                    </div>
                    <div className="mx-2">
                        <img style={{
                            mixBlendMode: "multiply"
                        }} src="insta.jpeg" alt="Instagram" width="25px" />
                    </div>
                </div>
            </div>
            <div className="text-center my-3">
                <h1>
                    100.000 <span style={{ fontSize: "20px", color: "#aad7f7" }}>BHD</span>
                </h1>
                <h6>Total amount to be paid</h6>
            </div>
            <div className="tableview">
                <div className="d-flex justify-content-between">
                    <p>Invoice No. :</p>
                    <p>#876946573</p>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                    <p>Remarks :</p>
                    <p>Flowers Order Purchased</p>
                </div>
            </div>
            <div className="checkboxDiv">
                <div className="d-flex">
                    <input type="checkbox" id="terms" name="terms" value="agree" />
                    <p className="self-center">I agree to BehBeta Terms and Conditions</p>
                </div>
            </div>
            <hr />
            <h6>Select payment method</h6>
            <div  onClick={handlePayment} style={{
                display:"flex",
                flexDirection:'row',
                alignItems:"center",
            
            }}>
                <img style={{
                    marginRight:"10px",
                            mixBlendMode: "multiply"
                        }} src="https://afs.gateway.mastercard.com/asset/managed/resource/portals/b23d15e8-042c-3d6b-9b94-52f30ea80c41" width="25px"></img>
                <h6>AFS</h6>
            </div>

        </div>
    );
};

export default TransactionPage;
