

import { useContext, useEffect, useRef } from 'react'
import mortContext from "../context/mort/mortContext"
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";


const About = (props) => {


    // const host = "http://localhost:5000"
    const { showalert } = props;
    const context = useContext(mortContext);
    const {  MORT_PUT_TAKEN_BY_LOVS, mort, handleSubmit, setName, name,  getMort, editMort } = context;

    const [selectedIds, setSelectedIds] = useState([]);
    const [emort, setEmort] = useState({ MORT_ID: "", NAME: "", ORNAMENT_DETAILS: "", AMOUNT: "", MORT_ACTUAL_PRINCIPAL: "", START_DATE: "", MORT_PUT_BY: "", MORT_RECEIVED_DATE: "", INTEREST: "", INTEREST_REF: "", INTEREST_BY_30: "", END_DATE: "", ACTUAL_INTEREST_RECEIVED: "" })
    const ref = useRef(null)
    const refClose = useRef(null)
    

    let selectedRows;

    const columns = [
        { field: "MORT_ID", headerName: "MORT_ID", width: 80,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>MORT_ID</span>
            ),
         },
        { field: "NAME", headerName: "NAME", width: 180,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>NAME</span>
            ), },
        { field: "ORNAMENT_DETAILS", headerName: "ORNAMENT_DETAILS", width: 180,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>ORNAMENT_DETAILS</span>
            ), },
        { field: "AMOUNT", headerName: "AMOUNT", width: 80,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>AMOUNT</span>
            ), },
        { field: "MORT_ACTUAL_PRINCIPAL", headerName: "MORT_ACTUAL_PRINCIPAL", width: 120,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>MRT_ACT_PNPL</span>
            ), },
        { field: "START_DATE", headerName: "START_DATE", width: 120,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>START_DATE</span>
            ), },
        { field: "MORT_PUT_BY", headerName: "MORT_PUT_BY", width: 120,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>MORT_PUT_BY</span>
            ), },
        { field: "MORT_RECEIVED_DATE", headerName: "MORT_RECEIVED_DATE", width: 120 ,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>MRT_RCVD_DT</span>
            ),},
        { field: "INTEREST", headerName: "INTEREST", width: 170,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>INTEREST</span>
            ), },
        { field: "INTEREST_REF", headerName: "INTEREST_REF", width: 170,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>INTEREST_REF</span>
            ), },
        { field: "INTEREST_BY_30", headerName: "INTEREST_BY_30", width: 170,
            renderHeader: () => (
                <span style={{ fontWeight: "bold" }}>INTEREST_BY_30</span>
            ), },

    ];




    const onClick = (mode = 'default') => {
        
        if (selectedIds.length > 1 || selectedIds.length < 1) {
            showalert("Don't select more than one entry to update", "danger")
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }


        console.log(selectedIds.length)
        const parts = selectedIds[0].split("_");
        console.log(parts); // ["1--1", "djsalfjsalk"]

        // Take out the first one
        const firstPart = parts[0];

        selectedRows = mort.filter((row) => firstPart.includes(row.MORT_ID) && row.START_DATE === parts[1]);
        
        console.log("search button mort value")
        console.log(selectedRows.length)
        if (selectedRows.length > 1 || selectedRows.length < 1) {
            showalert("There are more than one entry with your selection ", "danger")
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setEmort({ MORT_ID: selectedRows[0].MORT_ID, NAME: selectedRows[0].NAME, ORNAMENT_DETAILS: selectedRows[0].ORNAMENT_DETAILS, AMOUNT: selectedRows[0].AMOUNT, MORT_ACTUAL_PRINCIPAL: selectedRows[0].MORT_ACTUAL_PRINCIPAL, START_DATE: selectedRows[0].START_DATE, MORT_PUT_BY: selectedRows[0].MORT_PUT_BY, MORT_RECEIVED_DATE: selectedRows[0].MORT_RECEIVED_DATE, INTEREST: selectedRows[0].INTEREST, INTEREST_REF: selectedRows[0].INTEREST_REF, INTEREST_BY_30: selectedRows[0].INTEREST_BY_30, MORT_TAKEN_BY: "", ACTUAL_INTEREST_RECEIVED: "", PENDING_INTEREST_AMOUNT: "", END_DATE: "" })
        ref.current.click();
        
    }

    useEffect(() => {

        getMort()

    }, [])




    const handleClick = (e) => {
        console.log("updating the mort", emort)
        if (emort.END_DATE === "" || emort.MORT_TAKEN_BY === "" || emort.ACTUAL_INTEREST_RECEIVED === "" || emort.PENDING_INTEREST_AMOUNT === "") {
            refClose.current.click();
            showalert("Entries cannot be blank", "danger");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        editMort(emort.MORT_ID, emort.START_DATE, emort.END_DATE, emort.MORT_TAKEN_BY, emort.ACTUAL_INTEREST_RECEIVED, emort.INTEREST, emort.INTEREST_REF, emort.INTEREST_BY_30, emort.PENDING_INTEREST_AMOUNT);
        refClose.current.click();
        showalert("Mortgadge has been taken and entry is updated", "success")
        window.scrollTo({ top: 0, behavior: "smooth" });
        // addNote(note.title,note.description,note.tag);
    }
    const onChange = (e) => {
        setEmort({ ...emort, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="row my-4 d-flex justify-content-between align-items-center">
                <div className="col-md-8 d-flex">
                    <form className="d-flex" role="search" onSubmit={handleSubmit}>
                        <input className="form-control me-2" type="search" placeholder="Search with name" aria-label="Search"
                            value={name} onChange={(e) => setName(e.target.value)} />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
                <div className="col-md-4 text-end">
                    <button disabled={selectedIds.length < 1} className="btn btn-outline-danger" onClick={() => onClick()}>End Mort</button>

                </div>
            </div>

            <div style={{ height: 400, width: "100%" }}>

                <DataGrid
                    rows={mort}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                    disableSelectionOnClick
                    getRowId={(row) => row.MORT_ID + "_" + row.START_DATE}
                    onRowSelectionModelChange={(newSelection) => {
                        const idsArray = Array.from(newSelection.ids);
                        setSelectedIds(idsArray);
                    }}
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
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Mort</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Id:</label>
                                    <input disabled type="email" className="form-control" id="MORT_ID" name="MORT_ID" value={emort.MORT_ID} aria-describedby="emailHelp"
                                        onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">Customer Name:</label>
                                    <input disabled type="text" className="form-control" id="NAME" name="NAME" value={emort.NAME} onChange={onChange}
                                        minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">Ornament Details:</label>
                                    <input disabled type="text" className="form-control" id="ORNAMENT_DETAILS" name="ORNAMENT_DETAILS" value={emort.ORNAMENT_DETAILS} onChange={onChange}
                                        minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">Mort Put Date:</label>
                                    <input disabled type="text" className="form-control" id="START_DATE" name="START_DATE" value={emort.START_DATE} onChange={onChange}
                                        required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">Mort Taken Date:</label>
                                    <input type="date" className="form-control" id="END_DATE" name="END_DATE" value={emort.END_DATE || ""} onChange={onChange}
                                        required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">Pending Interest Amount:</label>
                                    <input type="number" onKeyDown={(e) => {
                                        if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                            e.preventDefault();
                                        }
                                    }} className="form-control" id="PENDING_INTEREST_AMOUNT" name="PENDING_INTEREST_AMOUNT" value={emort.PENDING_INTEREST_AMOUNT || ""} onChange={onChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">Actual Interest Received:</label>
                                    <input type="number" onKeyDown={(e) => {
                                        if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                            e.preventDefault();
                                        }
                                    }} className="form-control" id="ACTUAL_INTEREST_RECEIVED" name="ACTUAL_INTEREST_RECEIVED" value={emort.ACTUAL_INTEREST_RECEIVED || ""} onChange={onChange}
                                    />
                                </div>

                                <div className="mb-3">

                                    <label htmlFor="desc" className="form-label"><strong>Mort Taken By:</strong></label>

                                    <select style={{ width: "400px", height: "40px" }} id="MORT_TAKEN_BY" name="MORT_TAKEN_BY" value={emort.MORT_TAKEN_BY} onChange={onChange} >
                                        <option value="">-- Select --</option>
                                        {MORT_PUT_TAKEN_BY_LOVS.map((lov, index) => (
                                            <option key={index} value={lov}>
                                                {lov}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button onClick={handleClick} type="button" className="btn btn-primary">End The Mortgadge</button>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}



export default About


