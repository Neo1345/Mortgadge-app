import {
    Card,
    CardContent,
    Typography,
    // LinearProgress,
    Box
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useContext, useEffect, useState } from 'react'
import mortContext from "../context/mort/mortContext"
// import { useRef } from "react";
// import html2canvas from "html2canvas";




const Snapshot = (props) => {



    // const componentRef = useRef();
    // const [screenshots, setScreenshots] = useState([]);
    const [value, setValue] = useState({ mort: "", int: "" });

    const { showalert } = props;
    // const handleIntReceived = (e) => {
    //     e.preventDefault(); // prevent page reload
    //     alert(`You entered: ${value}`);
    // };

    const context = useContext(mortContext);
    const {componentRef,handleScreenshot, clearSnapshot, formatted1, mort_snapdtls, getSnapDetails, mort_snapcurrent, getSnapCurrent, getPendingMort, mort_pending } = context;

    const handleClearSnap = (e) => {
        e.preventDefault(); // prevent page reload
        clearSnapshot();
        showalert("Snapshot is cleared", "success")

    };


    // const handleScreenshot = () => {
    //     html2canvas(componentRef.current).then((canvas) => {
    //         const imgData = canvas.toDataURL("image/png");
    //         // Store screenshot in state (latest first)
    //         setScreenshots((prev) => [imgData, ...prev]);


    //         // Option 2: Download directly
    //         const link = document.createElement("a");
    //         link.href = imgData;
    //         link.download = "screenshot.png";
    //         link.click();
    //     });
    // };



    const snap_fields = [

        {
            field: "NAME", headerName: "नाम", width: 200, headerClassName: "bold-header",
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>नाम</span>
            ),
        },
        {
            field: "ORNAMENT_DETAILS", headerName: "ग्राम/आभूषणों के नाम", width: 200,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>ग्राम/आभूषणों के नाम</span>
            ),
        },
        {
            field: "AMOUNT", headerName: "AMOUNT", width: 120,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>मूलधन</span>
            ),
        },
        {
            field: "START_DATE", headerName: "START_DATE", width: 150,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>गिरवी रखने की तिथि</span>
            ),
        },
        {
            field: "END_DATE", headerName: "END_DATE", width: 150,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>गिरवी उठाने की तिथि</span>
            ),
        },
        {
            field: "MORT_TAKEN_BY", headerName: "MORT_TAKEN_BY", width: 150,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>के द्वारा गिरवी उठी</span>
            ),
        },
        {
            field: "INTEREST", headerName: "INTEREST", width: 150,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>ब्याज</span>
            ),
        }

    ];

    // console.log('logging in snap page', mort_snapdtls)
    useEffect(() => {
// eslint-disable-next-line
        getSnapCurrent()
        getPendingMort()
        getSnapDetails()
        // console.log(mort_pending)

    },[] )

    return (
        <>



            {/* <form > */}
            <div className="row">
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="Enter Mort Amt Received..."
                        value={value['mort']}
                        onChange={(e) => setValue({ ...value, mort: e.target.value })}
                    />

                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Enter Interest Received..."
                        value={value['int']}
                        onChange={(e) => setValue({ ...value, int: e.target.value })}
                    />
                </div>
                <div className="col-md-2 text-end">
                   <button type="submit" className="btn btn-outline-info my-2" onClick={handleScreenshot}>Screen Capture</button>
                    <button type="submit" className="btn btn-outline-success" onClick={handleClearSnap}>Clear Snapshot</button>
                </div>
                {/* <div className="col-md-2 text-end">
                    
                </div> */}

                {/* <button type="submit">Submit Received Mort Amt</button> */}
                {/* </form> */}
            </div>
            <div ref={componentRef} style={{
                padding: "5px",   // adds gap inside
                // background: "#f0f0f0",
                margin: "5px"     // adds gap outside
            }}
            >
                <div className="row my-4">
                    <div className="col-md-4">
                        <h3>Date: {formatted1}</h3>
                    </div>
                    <div className="col-md-8">
                        <h5><strong>श्री अविनाश (बंटी भैया) चौरई</strong></h5>
                    </div>
                </div>
                <div className="container"
                    style={{
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "100px",
                        backgroundColor: "#cee6e7be",
                        padding: "1rem 1rem .15rem 1rem",
                        borderRadius: "1px",
                        boxShadow: "0 0 0 rgba(0,0,0,0.1)"
                    }}

                >
                    <div className="row"
                    // style={{
                    //     backgroundRepeat: "no-repeat",
                    //     backgroundPosition: "center",
                    //     backgroundSize: "100px",
                    //     backgroundColor: "#cee6e7be",
                    //     padding: "2rem 1rem 1rem 1rem",
                    //     borderRadius: "1px",
                    //     boxShadow: "0 0 0 rgba(0,0,0,0.1)"
                    // }}
                    >
                        <div className="col-md-6" >
                            <Card className="mb-3" style={{ maxWidth: "600px", width: "100%" }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom fontWeight="bold">
                                        गिरवी ब्योरा

                                    </Typography>
                                    {/* ----------------------------------------------------------------------------- */}
                                    {/* Metrics */}
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body1">{formatted1} की रकम बाकी:</Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            ₹{mort_snapcurrent['MORT_SNAP_CURRENT'] === null ? 0 : mort_snapcurrent['MORT_SNAP_CURRENT']}

                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body1">पुरानी रकम बाकी:</Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            (+)  ₹{mort_pending['MORT_PENDING'] === null ? 0 : mort_pending['MORT_PENDING']}

                                        </Typography>
                                    </Box>
                                    -----------------------------------------------------------------------------
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography variant="body1">कुल रकम:</Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            =  ₹{(mort_pending['MORT_PENDING'] + mort_snapcurrent['MORT_SNAP_CURRENT']) === null ? 0 : (mort_pending['MORT_PENDING'] + mort_snapcurrent['MORT_SNAP_CURRENT'])}

                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography variant="body1">{formatted1} की रकम जमा :</Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            -₹{value['mort'] === null ? 0 : value['mort']}
                                        </Typography>
                                    </Box>
                                    -----------------------------------------------------------------------------
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography variant="body1"><strong>कुल रकम बाकी :</strong></Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            =   ₹{(mort_pending['MORT_PENDING'] + mort_snapcurrent['MORT_SNAP_CURRENT'] - value['mort']) === null ? 0 : (mort_pending['MORT_PENDING'] + mort_snapcurrent['MORT_SNAP_CURRENT'] - value['mort'])}

                                        </Typography>
                                    </Box>

                                    {/* Progress Bar */}
                                    {/* <Typography variant="body2" color="text.secondary" gutterBottom>
                                Security Percentage
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={2222}
                                sx={{ height: 10, borderRadius: 5 }}
                            />
                            <Box display="flex" justifyContent="space-between" mt={1}>
                                <Typography variant="caption">Sec Value: ₹{11}</Typography>
                                <Typography variant="caption">{222}%</Typography>
                            </Box> */}

                                </CardContent>
                            </Card>
                        </div>

                        <div className="col-md-6">

                            <Card className="mb-3" style={{ maxWidth: "600px", width: "100%" }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom fontWeight="bold">
                                        ब्याज
                                    </Typography>

                                    {/* Metrics */}
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body1">{formatted1} का कुल ब्याज:</Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            ₹{mort_snapcurrent['INT_ACT'] === null ? 0 : mort_snapcurrent['INT_ACT']}

                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body1">पुराना ब्याज बाकी:</Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            (+)  ₹{mort_pending['INT_PENDING'] === null ? 0 : mort_pending['INT_PENDING']}
                                        </Typography>
                                    </Box>
                                    -----------------------------------------------------------------------------
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography variant="body1">कुल ब्याज:</Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            = ₹{(mort_pending['INT_PENDING'] + mort_snapcurrent['INT_ACT']) === null ? 0 : (mort_pending['INT_PENDING'] + mort_snapcurrent['INT_ACT'])}

                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography variant="body1">{formatted1} का ब्याज जमा:</Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            - ₹{value['int'] === null ? 0 : value['int']}

                                        </Typography>
                                    </Box>
                                    -----------------------------------------------------------------------------
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography variant="body1"><strong>कुल ब्याज बाकी:</strong></Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            = ₹{(mort_pending['INT_PENDING'] + mort_snapcurrent['INT_ACT'] - value['int']) === null ? 0 : (mort_pending['INT_PENDING'] + mort_snapcurrent['INT_ACT'] - value['int'])}

                                        </Typography>
                                    </Box>

                                    {/* Progress Bar */}
                                    {/* <Typography variant="body2" color="text.secondary" gutterBottom>
                                Security Percentage
                            </Typography> */}
                                    {/* <LinearProgress
                                variant="determinate"
                                value={2222}
                                sx={{ height: 10, borderRadius: 5 }}
                            />
                            <Box display="flex" justifyContent="space-between" mt={1}>
                                <Typography variant="caption">Sec Value: ₹{11}</Typography>
                                <Typography variant="caption">{222}%</Typography>
                            </Box> */}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="row my-2">
                    <h5><strong>{formatted1} की उठने वाली गिरवी</strong></h5>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <DataGrid

                            rows={mort_snapdtls}
                            columns={snap_fields}
                            // pageSize={5}
                            // rowsPerPageOptions={[5, 10, 20]}
                            // checkboxSelection
                            // disableSelectionOnClick
                            pagination={false}
                            rowsPerPageOptions={[]}
                            hideFooterPagination
                            hideFooter
                            getRowId={(row) => row.NAME + "_" + row.START_DATE}
                            sx={{
                                border: "1px solid #1976d2",
                                borderRadius: "4px",

                                // horizontal row borders
                                "& .MuiDataGrid-row": {
                                    borderBottom: "1px solid #1976d2",
                                },

                                // vertical cell borders
                                "& .MuiDataGrid-cell": {
                                    borderRight: "1px solid #1976d2",
                                },

                                // header row styles (merged into one block)
                                "& .MuiDataGrid-columnHeaders": {
                                    borderBottom: "1px solid #1976d2",
                                    // backgroundColor: "#36bce1", // ✅ now it will apply
                                },

                                // vertical header borders
                                "& .MuiDataGrid-columnHeader": {
                                    borderRight: "1px solid #1976d2",
                                    backgroundColor: "#d9e8e7ff"
                                },
                                "& .MuiDataGrid-columnHeader:last-child": {
                                    borderRight: "none",
                                    // backgroundColor: "#36bce1"
                                },
                            }}




                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Snapshot