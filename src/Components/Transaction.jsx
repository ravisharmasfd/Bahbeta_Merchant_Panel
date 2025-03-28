import React, { useEffect, useState } from "react";
import "../App.css"; // Optional: For moving styles to a CSS file
import { useLocation, useNavigate } from "react-router-dom";
import { conformOrder, getInvoiceSessionId } from "../services/api";
import { Oval } from "react-loader-spinner";

const TransactionPage = () => {
    const [sessionId, setSessionId] = useState(null);
    const [paymentEnable, setPaymentEnable] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)
    const [error, setError] = useState(null)
    // Function to get query parameters
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const sessionIdFromQuery = query.get('sessionId');
    console.log("🚀 ~ TransactionPage ~ sessionIdFromQuery:", sessionIdFromQuery)
    const [InvoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const fetchSession = async () => {
        try {
            setLoading(true)
            if (!sessionIdFromQuery) {
                navigate("/")
                setLoading(false)
                return
            }
            const data = await getInvoiceSessionId(sessionIdFromQuery)
            console.log("🚀 ~ fetchSession ~ res:", data?.data)
            setInvoiceData(data.data);
            setSessionId(data?.season?.session?.id)

        } catch (error) {
            console.log("🚀 ~ fetchSession ~ error:", error)

            setError(error?.response?.data?.message || "There is some error")

        }
        finally {
            setLoading(false)
        }
    }
    const handlePayment = async () => {
        if (!isConfirm) {
            return alert("Please agree the Terms and Conditions")
        }
        if (sessionId) {
            setPaymentEnable(true);
            // navigate(`/transaction?session=${sessionId}&sessionIdFromQuery=${sessionIdFromQuery}`)
        } else {
            alert("There some error while payment")
        }
    }

    // Extract the sessionId from query parameters
    useEffect(() => {
        fetchSession()
    }, [sessionIdFromQuery]);



    useEffect(() => {
        if (!sessionId || !paymentEnable) return;

        // Load the Mastercard script
        const script = document.createElement('script');
        script.src = "https://afs.gateway.mastercard.com/static/checkout/checkout.min.js";
        script.async = true;
        script["data-error"] = "errorCallBack";
        script["data-complete"] = "completeCallback"
        window.errorCallBack = (error) => {
            console.log("🚀 ~ useEffect ~ window error:", error)
            alert(error?.["error.explanation"])
        }
        window.completeCallback = async (data) => {
            console.log("🚀 ~ useEffect ~ window data:", data)
            const response = await conformOrder(sessionIdFromQuery)
            navigate(`/payment?sessionId=${sessionIdFromQuery}`)
            navigate(`/`)
            // window.close()
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
    }, [paymentEnable]);

    //   // Event handlers to show embedded or payment page
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
        <>
            {
                loading ? <>
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><Oval
                      visible={true}
                      height="80"
                      width="80"
                      color="#0d6efd"
                      
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      secondaryColor=''
                      /></div>
                </> :

                    <>
                        {error ? <>{error}</> : <div className="model">
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
                                    {InvoiceData?.amount} <span style={{ fontSize: "20px", color: "#aad7f7" }}>BHD</span>
                                </h1>
                                <h6>Total amount to be paid</h6>
                            </div>
                            <div className="tableview">
                                <div className="d-flex justify-content-between">
                                    <p>Invoice No. :</p>
                                    <p>{InvoiceData?._id}</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <p>Remarks :</p>
                                    <p>{InvoiceData?.remark}</p>
                                </div>
                            </div>
                            {!paymentEnable ? <>
                            <div className="checkboxDiv">
                                <div className="d-flex">
                                    <input type="checkbox" id="terms" name="terms" value="agree"
                                        onChange={(e) => {
                                            console.log("🚀 ~ TransactionPage ~ value:", e?.target?.value)
                                            setIsConfirm(!isConfirm)


                                        }}
                                        checked={isConfirm}
                                    />
                                    <p className="self-center">I agree to BehBeta Terms and Conditions</p>
                                </div>
                            </div>
                            <hr />
                           
                                <h6>Select payment method</h6>
                                <div onClick={handlePayment} style={{
                                    display: "flex",
                                    flexDirection: 'row',
                                    alignItems: "center",
                                    cursor: "pointer"

                                }}>
                                    <img style={{
                                        marginRight: "10px",
                                        mixBlendMode: "multiply"
                                    }} src="https://afs.gateway.mastercard.com/asset/managed/resource/portals/b23d15e8-042c-3d6b-9b94-52f30ea80c41" width="25px"></img>
                                    <h6>AFS</h6>
                                </div>
                            </> :
                                <div>
                                    <div id="embed-target"></div>

                                </div>
                            }

                        </div>}
                    </>
            }</>
    );
};

export default TransactionPage;
