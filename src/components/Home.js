import React, { useContext, useState, useEffect } from 'react'
import mortContext from "../context/mort/mortContext"
// import { Box, TextField, Button } from "@mui/material";
import {
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Box
} from "@mui/material";


export const Home = (props) => {


    const { showalert } = props;
    const context = useContext(mortContext);
    const {deacsums,getDeactivatedMortAgg,int_sum,updateInterest, addMort, getAgg, mort_sum, total, MORT_PUT_TAKEN_BY_LOVS } = context;
    const [mort, setMort] = useState({ MORT_ID: "", NAME: "", ORNAMENT_DETAILS: "", AMOUNT: "", MORT_ACTUAL_PRINCIPAL: "", START_DATE: "", MORT_PUT_BY: "", MORT_RECEIVED_DATE: "" })
    const [receivedinterest, setReceivedinterest] =useState("")
    const handleIntSubmit =(e) =>{
        e.preventDefault();
        console.log(receivedinterest)
        updateInterest(receivedinterest)
        showalert("Interest has been submitted successfully.", "success")
    }
    const handleClick = (e) => {
        e.preventDefault();
        console.log(mort)
         if (!mort.MORT_ID || !mort.NAME || !mort.ORNAMENT_DETAILS || !mort.AMOUNT || !mort.MORT_ACTUAL_PRINCIPAL || !mort.START_DATE || !mort.MORT_PUT_BY || !mort.MORT_RECEIVED_DATE) {

            showalert("Cannot add empty entry", "danger")
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        addMort(mort.MORT_ID, mort.NAME, mort.ORNAMENT_DETAILS, mort.AMOUNT, mort.MORT_ACTUAL_PRINCIPAL, mort.START_DATE, mort.MORT_PUT_BY, mort.MORT_RECEIVED_DATE);
        setMort({ MORT_ID: "", NAME: "", ORNAMENT_DETAILS: "", AMOUNT: "", MORT_ACTUAL_PRINCIPAL: "", START_DATE: "", MORT_PUT_BY: "", MORT_RECEIVED_DATE: "" })
        showalert("Entry has been successfully added", "success")
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;

    }
    const onChange = (e) => {

        setMort({ ...mort, [e.target.name]: e.target.value })


    }

    useEffect(() => {
        getAgg()
        getDeactivatedMortAgg()

    }, [])
    const progress = (mort_sum / total) * 100;


    return (
        <>


            <div className="container">
                
                <div className="d-flex justify-content-end">
                    <form className="row">
                        
                        <div className="col-auto">
                            <label htmlFor="amountInput" className="visually-hidden">Amount</label>
                            <input type="number" onKeyDown={(e) => {
                                        if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                            e.preventDefault();
                                        }
                                    }} value={receivedinterest} onChange={(e) => setReceivedinterest(e.target.value)}  className="form-control" id="amountInput" placeholder="Enter Received Interest"/>
                        </div>

                        
                        <div className="col-auto">
                            <button onClick={handleIntSubmit} type="submit" className="btn btn-success mb-3">
                                Submit Interest
                            </button>
                        </div>
                    </form>
                </div>
                <h2>Add a Mortgage Entry</h2>


                <div className="row my-4">
                    <div className="col-md-8">
                        <form style={{
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "500px",
                            backgroundColor: "#cee6e7be",
                            padding: "2rem",
                            borderRadius: "10px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><strong>Mortgadge Id :</strong></label>
                                </div>
                                <div className="col-md-9">
                                    <input type="email" className="form-control" id="MORT_ID" name="MORT_ID" value={mort.MORT_ID} aria-describedby="emailHelp"
                                        onChange={onChange} minLength={5} required />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="desc" className="form-label"><strong>Customer Name :</strong></label>
                                </div>
                                <div className="col-md-9">
                                    <input lang="hi" type="text" className="form-control" id="NAME" name="NAME" value={mort.NAME} onChange={onChange} minLength={5} required />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="desc" className="form-label"><strong>Ornament Details :</strong></label>
                                </div>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="ORNAMENT_DETAILS" name="ORNAMENT_DETAILS" value={mort.ORNAMENT_DETAILS} onChange={onChange} minLength={5} required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="desc" className="form-label"><strong>Amount :</strong></label>
                                </div>
                                <div className="col-md-9">
                                    <input type="number" onKeyDown={(e) => {
                                        if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                            e.preventDefault();
                                        }
                                    }} className="form-control" id="AMOUNT" name="AMOUNT" value={mort.AMOUNT} onChange={onChange} required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="desc" className="form-label"><strong>Actual Principal :</strong></label>
                                </div>
                                <div className="col-md-9">
                                    <input type="number" onKeyDown={(e) => {
                                        if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                            e.preventDefault();
                                        }
                                    }}
                                        className="form-control" id="MORT_ACTUAL_PRINCIPAL" name="MORT_ACTUAL_PRINCIPAL" value={mort.MORT_ACTUAL_PRINCIPAL} onChange={onChange} minLength={5} required />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="desc" className="form-label"><strong>Start Date :</strong></label>
                                </div>
                                <div className="col-md-9">
                                    <input type="date" className="form-control" id="START_DATE" name="START_DATE" value={mort.START_DATE} onChange={onChange} minLength={5} required />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="desc" className="form-label"><strong>Handed Over By :</strong></label>
                                </div>
                                <div className="col-md-9">
                                    {/* <input type="text" className="form-control" id="MORT_PUT_BY" name="MORT_PUT_BY" value={mort.MORT_PUT_BY} onChange={onChange} minLength={5} required /> */}
                                    <select style={{ width: "400px", height: "40px" }} id="MORT_PUT_BY" name="MORT_PUT_BY" value={mort.MORT_PUT_BY} onChange={onChange} >
                                        <option value="">-- Select --</option>
                                        {MORT_PUT_TAKEN_BY_LOVS.map((lov, index) => (
                                            <option key={index} value={lov}>
                                                {lov}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="desc" className="form-label"><strong>Mortgadge Received Date :</strong></label>
                                </div>
                                <div className="col-md-9">
                                    <input type="date" className="form-control" id="MORT_RECEIVED_DATE" name="MORT_RECEIVED_DATE" value={mort.MORT_RECEIVED_DATE} onChange={onChange} minLength={5} required />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" onClick={handleClick}>Add Entry</button>
                        </form>
                    </div>

                    <div className="col-md-4 d-flex flex-column align-items-end" style={{
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "300px",
                        backgroundColor: "#cee6e7be",
                        padding: "2rem 1rem .15rem",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}>

                        <Card className="mb-3" style={{ maxWidth: "400px", width: "100%" }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Mort Status
                                </Typography>

                                {/* Metrics */}
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body1">Current Value:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        ₹{mort_sum}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body1">Total:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        ₹{total}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography variant="body1">Lent Amount:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        ₹{total - mort_sum}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography variant="body1">Interest as of now:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        ₹{int_sum}
                                    </Typography>
                                </Box>

                                {/* Progress Bar */}
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Security Percentage
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                                <Box display="flex" justifyContent="space-between" mt={1}>
                                    <Typography variant="caption">Sec Value: ₹{mort_sum}</Typography>
                                    <Typography variant="caption">{progress.toFixed(1)}%</Typography>
                                </Box>
                            </CardContent>
                        </Card>


                        <Card className="mb-3" style={{ maxWidth: "400px", width: "100%" }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Deactivated Interest Metrics
                                </Typography>

                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body1">Actual Collected:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        ₹{parseFloat(deacsums['DEAC_ACTUAL_INT']).toFixed(2)}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body1">Ideal Interest:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        ₹{parseFloat(deacsums['DEAC_INTEREST']).toFixed(2)}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography variant="body1">Interest old(REF):</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        ₹{parseFloat(deacsums['DEAC_INT_BY_30']).toFixed(2)}
                                    </Typography>
                                </Box>


                                {/* <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Security Percentage
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                                <Box display="flex" justifyContent="space-between" mt={1}>
                                    <Typography variant="caption">Sec Value: ₹{mort_sum}</Typography>
                                    <Typography variant="caption">{progress.toFixed(1)}%</Typography>
                                </Box> */}
                            </CardContent>
                        </Card>
                    </div>
                </div >
            </div >



        </>
    )
}



export default Home;