import MortContext from "./mortContext";
import { useState } from "react";
import { useRef } from "react";
import html2canvas from "html2canvas";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import ExcelJS from "exceljs";


const MortState = (props) => {
  // {"MORT_SNAP_CURRENT":0,"INT_ACT":0}
  // {"MORT_PENDING":0,"INT_PENDING":0}
  const host = "http://localhost:5000"
  const [results, setResults] = useState([]);
  const [name, setName] = useState("");
  const [mort, setMort] = useState([])
  const [mort_sum, setMort_sum] = useState(0);
  const [int_sum, setInt_sum] = useState(0);
  const [deacsums, setDeacsums] = useState({
    DEAC_ACTUAL_INT: 0, DEAC_INTEREST: 0,
    DEAC_INT_BY_30: 0, DEAC_INT_REF: 0
  });
  const [mort_snapcurrent, setMort_snapcurrent] = useState({ MORT_SNAP_CURRENT: 0, INT_ACT: 0 });
  const [mort_pending, setMort_pending] = useState({
    MORT_PENDING: 0,
    INT_PENDING: 0
  });
  const [mort_snapdtls, setMort_snapdtls] = useState([]);
  const [mort_pendingdtls, setMort_pendingdtls] = useState([]);
  const [redstatus, setRedstatus] = useState([])
  const [yellowstatus, setYellowstatus] = useState([])
  // const [screenshots, setScreenshots] = useState([]);
  const total = 2388737;
  const componentRef = useRef();

  //  function s2ab(s) {
  //       const buf = new ArrayBuffer(s.length);
  //       const view = new Uint8Array(buf);
  //       for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  //       return buf;
  //     } 
  const handleScreenshot = async () => {
    // html2canvas(componentRef.current).then((canvas) => {
    //     const imgData = canvas.toDataURL("image/png");
    //     // Store screenshot in state (latest first)
    //     // setScreenshots((prev) => [imgData, ...prev]);


    //     // Option 2: Download directly
    //     const link = document.createElement("a");
    //     link.href = imgData;
    //     link.download = "screenshot.png";
    //     link.click();
    // });


    const canvas = await html2canvas(componentRef.current);
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "screenshot.png";
    link.click();

    // Send screenshot to backend
    await fetch(`${host}/api/mortgde/screenshot_saver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imgData }),
    });

    // alert("screenshot has been saved in document snapshots_history.xlsx");

  };

  const MORT_PUT_TAKEN_BY_LOVS = ["रंजीत वर्मा",
    "प्रमोद महाराज",
    'बंटी भैया',
    "आशू डेहरिया",
    "किशोर"
  ]
  const todayIST1 = new Date().toLocaleDateString("en-GB", {
    timeZone: "Asia/Kolkata", // IST timezone
  });
  const formatted1 = todayIST1.replace(/\//g, "-");

  function daysInMonth(year, month) {
    // month is 1-based (1 = Jan, 12 = Dec)
    return new Date(year, month, 0).getDate();
  }

  function diffInMonths(startStr, endStr) {

    if (!startStr || !endStr) {
      return null; // or throw an error
    }
    // console.log("type of datestr",typeof dateStr)

    // Parse dd-mm-yyyy strings
    const [startDay, startMonth, startYear] = startStr.split("-").map(Number);
    const [endDay, endMonth, endYear] = endStr.split("-").map(Number);

    // Whole months difference
    let months = (endYear - startYear) * 12 + (endMonth - startMonth) - 1;

    // Days in start and end months
    const daysInStartMonth = daysInMonth(startYear, startMonth);
    const daysInEndMonth = daysInMonth(endYear, endMonth);

    // Fractional part
    const startFraction = (daysInStartMonth - startDay + 1) / daysInStartMonth;
    const endFraction = endDay / daysInEndMonth;

    return months + startFraction + endFraction;
  }

  // Utility: parse dd-mm-yyyy into JS Date
  function parseDDMMYYYY(dateStr) {
    if (!dateStr) {
      return null; // or throw an error
    }
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  }

  // Month difference with fraction (Excel DATEDIF + fractional part)
  function monthDiffWithFraction(startDateStr, endDateStr) {
    const start = parseDDMMYYYY(startDateStr);
    const end = parseDDMMYYYY(endDateStr);
    if (!start || !end) {
      return null; // or throw an error
    }

    // Full months difference
    let months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    // Anchor date
    const anchor = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());

    // Adjust if overshoot
    if (anchor > end) {
      months--;
      anchor.setMonth(anchor.getMonth() - 1);
    }

    // Fractional part
    const daysInMonth = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate();
    // const diffDays = (end - anchor) / (1000 * 60 * 60 * 24) + 1;
    const diffDays = Math.floor((end - anchor) / (1000 * 60 * 60 * 24)) + 1;
    const fraction = diffDays / daysInMonth;

    return months + fraction;
  }
  function calcInterest(start_date, end_date, amount) {
    const months = diffInMonths(start_date, end_date);
    return (amount * 1.25 * months) / 100;
  }

  function calcInterestRef(start_date, end_date, amount) {
    const months = monthDiffWithFraction(start_date, end_date);
    return (amount * 1.25 * months) / 100;
  }

  function parseDMY(dateStr) {
    // Split by dash
    if (!dateStr) {
      return null; // or throw an error
    }

    const [day, month, year] = dateStr.split("-").map(Number);
    // JS Date months are 0-based (0 = Jan, 11 = Dec)
    return new Date(year, month - 1, day);
  }

  function daysBetweenInclusive(date1, date2) {
    const d1 = parseDMY(date1);
    const d2 = parseDMY(date2);
    if (!d1 || !d2) {
      return null; // or throw an error
    }

    // Normalize to midnight to avoid time zone issues
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const diffMs = d2 - d1;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays + 1; // include end date
  }



  function calcInterestby30(start_date, end_date, amount) {
    const days = daysBetweenInclusive(start_date, end_date);
    const months = days / 30;
    return (amount * 1.25 * months) / 100;
  }

  // function calcStatus(start_date, end_date) {
  //   let status =''
  //   const days = parseInt(daysBetweenInclusive(start_date, end_date));
  //   if (days>=340 && days<365){
  //     status = 'Yellow'
  //   }
  //   else if (days > 365){
  //     status = 'Red'
  //   }
  //   else {
  //     status = 'Green'
  //   }

  //   return status;
  // }



  const handleSubmit = async (e) => {
    e.preventDefault();
    // if(name===''){
    //   getMort();
    // }
    const response = await fetch(`${host}/api/mortgde/fetchmortinfo?name=${encodeURIComponent(name)}`);
    const data = await response.json();
    console.log(data)
    const enriched = data.map(row => ({
      ...row,
      INTEREST: calcInterest(row.START_DATE, formatted1, row.AMOUNT),
      INTEREST_REF: calcInterestRef(row.START_DATE, formatted1, row.AMOUNT),
      INTEREST_BY_30: calcInterestby30(row.START_DATE, formatted1, row.AMOUNT)
    }));

    console.log(enriched)

    setMort(enriched)
    // console.log()
    // setMort(data);
  };



  // get all notes
  const getMort = async () => {

    const response = await fetch(`${host}/api/mortgde/fetchmortinfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      }
      // ,
      // body:JSON.stringify({title,description,tag})
    });
    const json = await response.json();

    const enriched = json.map(row => ({
      ...row,
      INTEREST: calcInterest(row.START_DATE, formatted1, row.AMOUNT),
      INTEREST_REF: calcInterestRef(row.START_DATE, formatted1, row.AMOUNT),
      INTEREST_BY_30: calcInterestby30(row.START_DATE, formatted1, row.AMOUNT)
    }));

    console.log('enriched', enriched)
    let interest_sum = 0;
    // let red_status_list =[]
    // let yellow_status_list =[]
    for (const row of enriched) {
      interest_sum += parseInt(row.INTEREST)
      // setInt_sum(int_sum+=parseInt(row.INTEREST))
      // if (row.STATUS === 'Red'){
      //   // red_status_list.concat(row)
      //   red_status_list = [...red_status_list, row];
      //   console.log(row)
      // }
      // if (row.STATUS === 'Yellow'){
      //   // red_status_list.concat(row)
      //   yellow_status_list = [...yellow_status_list, row];
      //   console.log(row)
      // }

    }
    setInt_sum(interest_sum);
    // console.log('red',red_status_list)
    // console.log('yellow',yellow_status_list)
    // console.log(interest_sum)
    setMort(enriched)
    // setRedstatus(red_status_list)
    // setYellowstatus(yellow_status_list)



  }

  const getAgg = async () => {

    const response = await fetch(`${host}/api/mortgde/fetchmortinfo/?mode=aggregated`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      }
      // ,
      // body:JSON.stringify({title,description,tag})
    });
    const json = await response.json();
    // console.log(json[0]['MORT_SUM'])
    setMort_sum(json[0]['MORT_SUM'])
    console.log(mort_sum)
  }

  const getSnapCurrent = async () => {

    const response = await fetch(`${host}/api/mortgde/fetchmortinfo/?mode=snapcurrent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      }
      // ,
      // body:JSON.stringify({title,description,tag})
    });
    const json = await response.json();
    console.log("snapcurrent json is ", json)
    const json_final = { MORT_SNAP_CURRENT: json[0]?.MORT_SNAP_CURRENT ?? 0, INT_ACT: json[0]?.INT_ACT ?? 0 }
    console.log("json_final is", json_final)
    setMort_snapcurrent(json_final)
    // console.log(mort_sum)
  }

  const getPendingMort = async () => {

    const response = await fetch(`${host}/api/mortgde/fetchmortinfo/?mode=pendingmort`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      }
      // ,
      // body:JSON.stringify({title,description,tag})
    });
    const json = await response.json();
    console.log(json)
    console.log("snappending json is ", json)
    const json_final_pending = { MORT_PENDING: json[0]?.MORT_PENDING ?? 0, INT_PENDING: json[0]?.INT_PENDING ?? 0 }
    console.log("json_final_pending is", json_final_pending)
    setMort_pending(json_final_pending)
    // console.log(mort_sum)
  }

  const getDeactivatedMortAgg = async () => {

    const response = await fetch(`${host}/api/mortgde/fetchmortinfo/?mode=deactivatedagg`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      }
      // ,
      // body:JSON.stringify({title,description,tag})
    });
    const json = await response.json();
    console.log(json)
    console.log("getDeactivatedMortAgg json is ", json)

    const json_final_dec_agg = {
      DEAC_ACTUAL_INT: json[0]?.DEAC_ACTUAL_INT ?? 0,
      DEAC_INTEREST: json[0]?.DEAC_INTEREST ?? 0,
      DEAC_INT_BY_30: json[0]?.DEAC_INT_BY_30 ?? 0,
      DEAC_INT_REF: json[0]?.DEAC_INT_REF ?? 0
    }
    // const json_final_dec_agg = {MORT_PENDING:json[0]?.MORT_PENDING ?? 0,INT_PENDING:json[0]?.INT_PENDING ?? 0}
    console.log("json_final_dec_agg is", json_final_dec_agg)
    setDeacsums(json_final_dec_agg)
    // console.log(mort_sum)
  }

  const getSnapDetails = async () => {

    const response = await fetch(`${host}/api/mortgde/fetchmortinfo/?mode=snapdetails`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      }
      // ,
      // body:JSON.stringify({title,description,tag})
    });
    const json = await response.json();
    console.log('json response of getdetails', json)
    setMort_snapdtls(json)
    console.log('getsnapdetails', mort_snapdtls)
  }

  const getPendingMortDts = async () => {

    const response = await fetch(`${host}/api/mortgde/fetchmortinfo/?mode=pendingmortdetails`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      }
      // ,
      // body:JSON.stringify({title,description,tag})
    });
    const json = await response.json();
    console.log('json response of getdetails', json)
    setMort_pendingdtls(json)
    // console.log('getsnapdetails',mort_snapdtls)
  }

  const updateInterest = async (interest_amount) => {
    await fetch(`${host}/api/mortgde/updateinterest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      },
      body: JSON.stringify({ interest_amount })
    });
  }

  //Add a note
  const addMort = async (mort_id, name, ornament_details, amount, mort_actual_principal, start_date, mort_put_by, mort_received_date) => {

    const response = await fetch(`${host}/api/mortgde/addmort`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      },
      body: JSON.stringify({ mort_id, name, ornament_details, amount, mort_actual_principal, start_date, mort_put_by, mort_received_date })
    });
    // const json = await response.json();
    console.log(response);


  }

  // // delete note
  // const deleteNote = async (id) =>{

  //   const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
  //       method:'DELETE',
  //       headers:{
  //         'Content-Type':'application/json',
  //         "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
  //       }
  //       // ,
  //       // body:JSON.stringify({title,description,tag})
  //     });
  //   const json = await response.json();
  //   console.log(json)
  //   // setNotes(json)

  //   console.log("Deleting the note with id"+ id);
  //   const newNotes = notes.filter((note)=>{return note._id !==id})
  //   setNotes(newNotes)
  // }

  // //edit a note
  const editMort = async (id, start_date, end_date, mort_taken_by, actual_interest_received, interest, interest_ref, interest_by_30, pending_interest_amount) => {

    console.log(id, start_date)
    const response = await fetch(`${host}/api/mortgde/updatemortgde/${id}/${start_date}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'//,
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      },
      body: JSON.stringify({
        end_date: end_date,
        mort_taken_by: mort_taken_by,
        actual_interest_received: actual_interest_received,
        interest: interest,
        interest_ref: interest_ref,
        interest_by_30: interest_by_30,
        pending_interest_amount: pending_interest_amount
      })
    }
    );

    // const json = await response.json();
    console.log(response)

    // let newNotes = JSON.parse(JSON.stringify(notes))

    // for (let index =0;index < newNotes.length;index++) {
    //   const element = newNotes[index];
    //   if(element._id === id){
    //     newNotes[index].title = title;
    //     newNotes[index].description = description;
    //     newNotes[index].tag = tag;
    //     break;
    //   }

    // }
    // setNotes(newNotes);
  }

  const clearSnapshot = async () => {

    // console.log(id, start_date)
    const response = await fetch(`${host}/api/mortgde/clearsnapshot`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'//,
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      },

    }
    );

    console.log(response)


  }
  const redStatusDetails = async () => {

    // console.log(id, start_date)
    const response = await fetch(`${host}/api/mortgde/fetchmortinfo/?mode=redstatusdetails`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'//,
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      },

    }
    );

    const json = await response.json();
    console.log('json response of redStatusDetails', json)
    const enriched = json.map(row => ({
      ...row,
      INTEREST: calcInterest(row.START_DATE, formatted1, row.AMOUNT),
      INTEREST_REF: calcInterestRef(row.START_DATE, formatted1, row.AMOUNT),
      INTEREST_BY_30: calcInterestby30(row.START_DATE, formatted1, row.AMOUNT)
    }));

    let red_status_list = []
    let yellow_status_list = []
    for (const row of enriched) {

      if (row.STATUS === 1) {
        red_status_list = [...red_status_list, row];
      }
      else {
        yellow_status_list = [...yellow_status_list, row];
      }
    }

    setRedstatus(red_status_list)
    setYellowstatus(yellow_status_list)

  }

  const Administration = async (type) => {

    // console.log(id, start_date)
    const response = await fetch(`${host}/api/mortgde/admininstration`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'//,
        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0YjdiMGRhNDM0NWZhMDllNzFkOTc0In0sImlhdCI6MTc2NjU1NzgyOX0.c_8h_S3-QV1roXWsHjDaYMhmOHVNCFXwZCZ-HzeFRhI"
      },
      body: JSON.stringify({
        type: type
      })
    }
    );

    console.log(response)


  }

  return (
    <MortContext.Provider value={{  componentRef, handleScreenshot, Administration, redStatusDetails, yellowstatus, redstatus, deacsums, getDeactivatedMortAgg, int_sum, updateInterest, mort_pendingdtls, getPendingMortDts, formatted1, clearSnapshot, mort_snapdtls, getSnapDetails, getPendingMort, mort_pending, mort_snapcurrent, getSnapCurrent, mort, setMort, handleSubmit, setName, name, results, setResults, getMort, editMort, addMort, getAgg, mort_sum, MORT_PUT_TAKEN_BY_LOVS, total }}>
      {props.children}
    </MortContext.Provider>
  )


}
export default MortState;

