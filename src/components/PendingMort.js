import { DataGrid } from "@mui/x-data-grid";
import {
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Box
} from "@mui/material";

import { useContext, useEffect, useState } from 'react'
import mortContext from "../context/mort/mortContext"



const PendingMort = () => {
    const context = useContext(mortContext);
    const { getPendingMortDts, mort_pendingdtls, mort_pending, getPendingMort } = context;

    const pending_mort_columns = [
        {
            field: "NAME", headerName: "NAME", width: 180,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>NAME</span>
            ),
        },
        {
            field: "ORNAMENT_DETAILS", headerName: "ORNAMENT_DETAILS", width: 180,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>ORNAMENT_DETAILS</span>
            ),
        },
        {
            field: "AMOUNT", headerName: "AMOUNT", width: 100,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>AMOUNT</span>
            ),
        },
        {
            field: "MORT_ACTUAL_PRINCIPAL", headerName: "MORT_ACTUAL_PRINCIPAL", width: 120,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>MRT_ACT_PNPL</span>
            ),
        },
        {
            field: "START_DATE", headerName: "START_DATE", width: 120,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>START_DATE</span>
            ),
        },
        {
            field: "END_DATE", headerName: "END_DATE", width: 120,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>END_DATE</span>
            ),
        },
        {
            field: "PENDING_MORT_AMOUNT", headerName: "PENDING_MORT_AMOUNT", width: 130,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>PNDG_MRT_AMT</span>
            ),
        },
        {
            field: "PENDING_INTEREST_AMOUNT", headerName: "PENDING_INTEREST_AMOUNT", width: 150,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>PNDG_INT_AMT</span>
            ),
        },
    ];

    useEffect(() => {

        getPendingMortDts()
        getPendingMort()

    }, [])

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        {/* First card */}
                        <Card sx={{ px: 2, py: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="textSecondary">
                                    Pending Mort Amount:
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    ₹{mort_pending['MORT_PENDING']}
                                </Typography>
                            </Box>
                        </Card>

                        {/* Second card */}
                        <Card sx={{ px: 2, py: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="textSecondary">
                                    Pending Interest Amount:
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    ₹{mort_pending['INT_PENDING']}
                                </Typography>
                            </Box>
                        </Card>
                    </Box>
                </div>
            </div>


            <div>
                <strong>Pending Amount Details</strong>
            </div>
            <div className="row my-2">
                <div style={{ height: 400, width: "100%" }}>

                    <DataGrid
                        rows={mort_pendingdtls}
                        columns={pending_mort_columns}
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

export default PendingMort