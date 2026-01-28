import { DataGrid } from "@mui/x-data-grid";
// import {
//     Card,
//     CardContent,
//     Typography,
//     LinearProgress,
//     Box
// } from "@mui/material";

import { useContext, useEffect } from 'react'
import mortContext from "../context/mort/mortContext"

const MortInRed = () => {


    const context = useContext(mortContext);
    const { yellowstatus, redstatus,redStatusDetails } = context;

    const red_status_columns = [
        {
            field: "NAME", headerName: "NAME", width: 200,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>NAME</span>
            ),
        },
        {
            field: "ORNAMENT_DETAILS", headerName: "ORNAMENT_DETAILS", width: 200,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>ORNAMENT_DETAILS</span>
            ),
        },
        {
            field: "AMOUNT", headerName: "AMOUNT", width: 120,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>AMOUNT</span>
            ),
        },
        // {
        //     field: "MORT_ACTUAL_PRINCIPAL", headerName: "MORT_ACTUAL_PRINCIPAL", width: 120,
        //     renderHeader: () => (
        //         <span style={{ fontWeight: "bold" }}>MRT_ACT_PNPL</span>
        //     ),
        // },
        {
            field: "START_DATE", headerName: "START_DATE", width: 150,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>START_DATE</span>
            ),
        },
        {
            field: "INTEREST", headerName: "INTEREST", width: 150,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>INTEREST</span>
            ),
        },
        {
            field: "INTEREST_REF", headerName: "INTEREST_REF", width: 150,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>INTEREST_REF</span>
            ),
        },
        {
            field: "INTEREST_BY_30", headerName: "INTEREST_BY_30", width: 150,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>INTEREST_BY_30</span>
            ),
        },
    ];

    useEffect(() => {

        redStatusDetails()

    }, [redStatusDetails])

    return (
        <>
            <div>
                <strong>Mortgadge In Red Status</strong>
            </div>
            <div className="row my-2">
                <div style={{ height: 550, width: "100%" }}>

                    <DataGrid
                        rows={redstatus}
                        columns={red_status_columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        // checkboxSelection
                        disableSelectionOnClick
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
            <div>
                <strong>Mortgadge In Future Red Status</strong>
            </div>
            <div className="row my-2">
                <div style={{ height: 400, width: "100%" }}>

                    <DataGrid
                        rows={yellowstatus}
                        columns={red_status_columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        // checkboxSelection
                        disableSelectionOnClick
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
        </>
    )
}

export default MortInRed