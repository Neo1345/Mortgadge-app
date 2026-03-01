const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
// const fetchuser = require('../middleware/fetchuser');
const fs = require("fs");
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
const ExcelJS = require("exceljs");

const FILE_PATH = "./snapshots_history.xlsx";

router.post("/screenshot_saver", async (req, res) => {
  try {
    const { imgData } = req.body;
    const base64 = imgData.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    // Load or create workbook
    let workbook;
    if (fs.existsSync(FILE_PATH)) {
      workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(FILE_PATH);
    } else {
      workbook = new ExcelJS.Workbook();
      const ws = workbook.addWorksheet("Reciepts History");
      ws.addRow(["Timestamp", "Screenshot"]);
    }

    const worksheet = workbook.getWorksheet("Reciepts History");

    // Add timestamp row
    let lastRowNumber = worksheet.lastRow.number;
    lastRowNumber += 30;
    const timestamp = new Date().toLocaleString();
    const row = worksheet.insertRow(lastRowNumber,[timestamp]);

    // Embed image next to timestamp
    const imageId = workbook.addImage({
      buffer,
      extension: "png",
    });

    // worksheet.addImage(imageId, {
    //   tl: { col: 1, row: row.number - 1 }, // place beside timestamp
    //   ext: { width: 200, height: 150 },
    // });

    // let lastRowNumber = worksheet.lastRow.number;
    console.log(lastRowNumber)

    // Place image at the bottom, next to timestamp
    worksheet.addImage(imageId, {
      tl: { col: 1, row: lastRowNumber - 1 }, // column B, last row
      ext: { width: 800, height: 500 },
    });

    // lastRowNumber += 500;

    // Save workbook back to disk
    await workbook.xlsx.writeFile(FILE_PATH);

    res.json({ success: true, message: "Snapshot appended to Excel" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


router.get('/fetchmortinfo', async (req, res) => {
  let connection;
  const params = {};
  let { name, mode } = req.query;
  // console.log(name)
  query = `select MORT_ID, NAME, ORNAMENT_DETAILS, AMOUNT, MORT_ACTUAL_PRINCIPAL, TO_CHAR(START_DATE,'DD-MM-YYYY') as START_DATE, 
 TO_CHAR(END_DATE,'YYYY-MM-DD') as END_DATE, 
 ACTIVE_STATUS, PENDING_MORT_AMOUNT, PENDING_INTEREST_AMOUNT, ACTUAL_INTEREST_RECEIVED, MORT_TAKEN_BY, 
 MORT_PUT_BY,  TO_CHAR(MORT_RECEIVED_DATE,'DD-MM-YYYY') as MORT_RECEIVED_DATE, 
 FW_MORT_REFERENCE_DATE, FW_REFERENCE, CURRENT_DAY_FLAG from mortgadgeaccounts WHERE active_status = 1`
  if (name) {
    // console.log('under name if')
    query += " AND name like :name"
    console.log(query)
    params.name = `%${name}%`;
  }
  if (mode === 'aggregated') {
    query = "select sum(amount) as mort_sum from mortgadgeaccounts WHERE active_status = 1"
  }

  if (mode === 'snapcurrent') {
    query = "select sum(amount) as mort_snap_current,sum(actual_interest_received) int_act from mortgadgeaccounts WHERE current_day_flag='Y'"

  }
  if (mode === 'pendingmort') {
    query = "select sum(pending_mort_amount) as mort_pending,sum(pending_interest_amount) as int_pending from mortgadgeaccounts WHERE current_day_flag='N'"

  }

  if (mode === 'snapdetails') {
    query = `select name,ornament_details,sum(amount) as amount ,TO_CHAR(min(start_date),'DD-MM-YYYY') as start_date ,TO_CHAR(end_date,'DD-MM-YYYY') as END_DATE,mort_taken_by,sum(actual_interest_received) as interest from mortgadgeaccounts
              where current_day_flag = 'Y'
                group by name,ornament_details,end_date,mort_taken_by`

  }

  if (mode === 'deactivatedagg') {
    query = ` select sum(interest) as deac_interest,sum(actual_interest_received) as deac_actual_int,sum(interest_ref) deac_int_ref
 ,sum(interest_by_30) as deac_int_by_30 from mortgadgeaccounts
              where active_status = 0`

  }
  if (mode === 'pendingmortdetails') {
    query = `select  NAME, ORNAMENT_DETAILS, AMOUNT, MORT_ACTUAL_PRINCIPAL, TO_CHAR(START_DATE,'DD-MM-YYYY') as START_DATE, 
 TO_CHAR(END_DATE,'DD-MM-YYYY') as END_DATE, 
PENDING_MORT_AMOUNT, PENDING_INTEREST_AMOUNT, ACTUAL_INTEREST_RECEIVED,  ACTIVE_STATUS, MORT_TAKEN_BY,
 CURRENT_DAY_FLAG from mortgadgeaccounts WHERE active_status = 0 and (pending_mort_amount>0 or pending_interest_amount>0) 
 order by to_date(END_DATE,'DD-MM-YYYY')`

  }
  if (mode === 'redstatusdetails') {
    query = ` select name,ornament_details,sum(amount) as amount,min(to_char(start_date,'DD-MM-YYYY') ) as start_date,
             max( case when to_date(sysdate,'dd-mm-yyyy')-to_date(start_date,'dd-mm-yyyy') >=340 and 
              to_date(sysdate,'dd-mm-yyyy')-to_date(start_date,'dd-mm-yyyy') < 365 then 0 
              else 1
              end) as STATUS
              from mortgadgeaccounts where active_status = 1 and 
              to_date(sysdate,'dd-mm-yyyy')-to_date(start_date,'dd-mm-yyyy') >=340
              group by name,ornament_details`

  }

  try {
    connection = await oracledb.getConnection('default'); // get from pool
    const result = await connection.execute(
      query,
      params,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }



});


router.put('/updatemortgde/:id/:start_date', async (req, res) => {
  let connection;
  try {
    console.log(req.body)
    const { end_date, mort_taken_by, actual_interest_received, interest, interest_ref, interest_by_30, pending_interest_amount } = req.body;
    const mort_id = req.params.id;
    const start_date = req.params.start_date;

    if (!end_date) {
      return res.status(400).send("Values are empty.");
    }

    connection = await oracledb.getConnection();

    const result = await connection.execute(
      `UPDATE mortgadgeaccounts 
       SET end_date = TO_DATE(:end_date, 'YYYY-MM-DD'), 
       actual_interest_received = :actual_interest_received,
       mort_taken_by =:mort_taken_by,
       interest = :interest,
       interest_ref = :interest_ref,
       interest_by_30 = :interest_by_30,
       pending_mort_amount = amount,
       pending_interest_amount = :pending_interest_amount,
       active_status = 0 ,current_day_flag = 'Y',fw_mort_reference_date = TO_DATE(:end_date, 'YYYY-MM-DD')
       WHERE  mort_id = :id and start_date = TO_DATE(:start_date, 'DD-MM-YYYY')`,
      {
        end_date, id: mort_id, start_date: start_date, actual_interest_received, mort_taken_by,
        interest,
        interest_ref,
        interest_by_30,
        pending_interest_amount
      },
      { autoCommit: true } // commit changes immediately
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Note not found");
    }

    res.send("Note updated successfully");

  } catch (error) {
    console.error("Oracle error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});


router.put('/clearsnapshot', async (req, res) => {
  let connection;
  const params = {};
  try {


    connection = await oracledb.getConnection('default');

    const result = await connection.execute(
      `UPDATE mortgadgeaccounts SET current_day_flag = 'N' where current_day_flag  = 'Y'`,
      params,
      { autoCommit: true } // commit changes immediately
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Note not found");
    }

    res.send("Mort updated successfully");

  } catch (error) {
    console.error("Oracle error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

router.post('/updateinterest', async (req, res) => {
  let connection;
  try {
    console.log(req.body)
    const { interest_amount } = req.body;
    // const mort_id = req.params.id;
    console.log(interest_amount)
    // || !name|| !ornament_details|| !amount|| !mort_actual_principal|| !start_date|| !mort_put_by|| !mort_received_date
    if (interest_amount < 1) {
      console.log("cannot update empty value")
      return res.status(400).send("cannot update empty value");
    }

    connection = await oracledb.getConnection();

    const int_result = await connection.execute(
      `select mort_id as id,to_char(start_date,'dd-mm-yyyy') as start_date,to_char(end_date,'dd-mm-yyyy') as end_date
      ,pending_interest_amount  from mortgadgeaccounts where 
      pending_interest_amount >0`,
      {},
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      } // commit changes immediately
    );

    if (int_result.rowsAffected === 0) {
      return res.status(404).send("Mort not found");
    }



    let received_int_amount = parseInt(interest_amount);



    console.log('int_result', int_result)

    for (const row of int_result.rows) {
      if (received_int_amount <= 0) break;
      console.log(row)
      let newPendingInt = parseInt(row.PENDING_INTEREST_AMOUNT);
      console.log('pia', row.PENDING_INTEREST_AMOUNT)
      if (received_int_amount >= newPendingInt) {

        received_int_amount -= newPendingInt;
        newPendingInt = 0;
        console.log('first if', received_int_amount, newPendingInt)
      } else {

        newPendingInt -= received_int_amount;
        received_int_amount = 0;
        console.log('else part', newPendingInt, received_int_amount)
      }


      await connection.execute(
        `UPDATE mortgadgeaccounts SET pending_interest_amount = :newPendingInt WHERE mort_id = :id
        and end_date = to_date(:end_date,'dd-mm-yyyy')
        and start_date=to_date(:start_date,'dd-mm-yyyy')`,
        { newPendingInt, id: row.ID, end_date: row.END_DATE, start_date: row.START_DATE },
        { autoCommit: true }
      );
    }

    // await connection.commit();
    // await connection.close();



  } catch (error) {
    console.error("Oracle error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});


router.post('/addmort', async (req, res) => {
  let connection;
  try {
    console.log(req.body)
    const { mort_id, name, ornament_details, amount, mort_actual_principal, start_date, mort_put_by, mort_received_date } = req.body;
    // const mort_id = req.params.id;
    console.log(start_date, mort_received_date)
    // || !name|| !ornament_details|| !amount|| !mort_actual_principal|| !start_date|| !mort_put_by|| !mort_received_date
    if (!mort_id) {
      console.log("Fields are empty")
      return res.status(400).send("Every field is mandatory");
    }

    connection = await oracledb.getConnection();

    const result = await connection.execute(
      `insert into mortgadgeaccounts (mort_id,name,ornament_details,amount,mort_actual_principal,start_date,mort_put_by,mort_received_date,active_status,current_day_flag)
       values(:mort_id,:name,:ornament_details,:amount,:mort_actual_principal,to_date(:start_date,'yyyy-mm-dd'),:mort_put_by,to_date(:mort_received_date,'yyyy-mm-dd'),1,'N')`,
      {
        mort_id: mort_id, name: name, ornament_details: ornament_details, amount: amount, mort_actual_principal: mort_actual_principal,
        start_date: start_date, mort_put_by: mort_put_by, mort_received_date: mort_received_date
      },
      { autoCommit: true } // commit changes immediately
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Mort not found");
    }


    res.send("Mort inserted successfully");

    let received_amount = parseInt(amount);

    const update_rows = await connection.execute(
      `SELECT mort_id as id, pending_mort_amount,to_char(end_date,'dd-mm-yyyy') as end_date
     FROM mortgadgeaccounts where pending_mort_amount > 0 
     and end_date = to_date(:start_date,'yyyy-mm-dd')`,
      { start_date },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('update_rows', update_rows)

    for (const row of update_rows.rows) {
      if (received_amount <= 0) break;

      let newPending = parseInt(row.PENDING_MORT_AMOUNT);
      console.log(row.PENDING_MORT_AMOUNT)
      if (received_amount >= newPending) {
        received_amount -= newPending;
        newPending = 0;
        console.log('entering if', received_amount, newPending)
      } else {
        newPending -= received_amount;
        received_amount = 0;
        console.log('entering else', received_amount, newPending)
      }


      await connection.execute(
        `UPDATE mortgadgeaccounts SET pending_mort_amount = :newPending WHERE mort_id = :id
        and end_date = to_date(:end_date,'dd-mm-yyyy')`,
        { newPending, id: row.ID, end_date: row.END_DATE },
        { autoCommit: true }
      );
    }

    // await connection.commit();
    // await connection.close();



  } catch (error) {
    console.error("Oracle error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

router.put('/admininstration', async (req, res) => {
  let connection;
  try {
    console.log(req.body)
    connection = await oracledb.getConnection();
    if (req.body['type']==='backup'){

      console.log('type is backup')
      const rs1 = await connection.execute(
      `truncate table mortgadgeaccounts_backup`,
      {},
      { autoCommit: true } // commit changes immediately
    );

    const rs2 = await connection.execute(
      `insert into mortgadgeaccounts_backup
    (MORT_ID,
    NAME,
    ORNAMENT_DETAILS,
    AMOUNT,
    MORT_ACTUAL_PRINCIPAL,
    START_DATE,
    END_DATE,
    ACTIVE_STATUS,
    PENDING_MORT_AMOUNT,
    PENDING_INTEREST_AMOUNT,
    ACTUAL_INTEREST_RECEIVED,
    MORT_TAKEN_BY,
    MORT_PUT_BY,
    MORT_RECEIVED_DATE,
    FW_MORT_REFERENCE_DATE,
    FW_REFERENCE,
    CURRENT_DAY_FLAG,
    INTEREST,
    INTEREST_REF,
    INTEREST_BY_30) 
    select 
    MORT_ID,
    NAME,
    ORNAMENT_DETAILS,
    AMOUNT,
    MORT_ACTUAL_PRINCIPAL,
    START_DATE,
    END_DATE,
    ACTIVE_STATUS,
    PENDING_MORT_AMOUNT,
    PENDING_INTEREST_AMOUNT,
    ACTUAL_INTEREST_RECEIVED,
    MORT_TAKEN_BY,
    MORT_PUT_BY,
    MORT_RECEIVED_DATE,
    FW_MORT_REFERENCE_DATE,
    FW_REFERENCE,
    CURRENT_DAY_FLAG,
    INTEREST,
    INTEREST_REF,
    INTEREST_BY_30 from mortgadgeaccounts`,
      {},
      { autoCommit: true } // commit changes immediately
    );
    }
    
    if (req.body['type']==='recover'){

      console.log('type is recover')
      const rs1 = await connection.execute(
      `truncate table mortgadgeaccounts`,
      {},
      { autoCommit: true } // commit changes immediately
    );

    const rs2 = await connection.execute(
      `insert into mortgadgeaccounts
    (MORT_ID,
    NAME,
    ORNAMENT_DETAILS,
    AMOUNT,
    MORT_ACTUAL_PRINCIPAL,
    START_DATE,
    END_DATE,
    ACTIVE_STATUS,
    PENDING_MORT_AMOUNT,
    PENDING_INTEREST_AMOUNT,
    ACTUAL_INTEREST_RECEIVED,
    MORT_TAKEN_BY,
    MORT_PUT_BY,
    MORT_RECEIVED_DATE,
    FW_MORT_REFERENCE_DATE,
    FW_REFERENCE,
    CURRENT_DAY_FLAG,
    INTEREST,
    INTEREST_REF,
    INTEREST_BY_30) 
    select 
    MORT_ID,
    NAME,
    ORNAMENT_DETAILS,
    AMOUNT,
    MORT_ACTUAL_PRINCIPAL,
    START_DATE,
    END_DATE,
    ACTIVE_STATUS,
    PENDING_MORT_AMOUNT,
    PENDING_INTEREST_AMOUNT,
    ACTUAL_INTEREST_RECEIVED,
    MORT_TAKEN_BY,
    MORT_PUT_BY,
    MORT_RECEIVED_DATE,
    FW_MORT_REFERENCE_DATE,
    FW_REFERENCE,
    CURRENT_DAY_FLAG,
    INTEREST,
    INTEREST_REF,
    INTEREST_BY_30 from mortgadgeaccounts_backup`,
      {},
      { autoCommit: true } // commit changes immediately
    );
    }

    

    // if (result.rowsAffected === 0) {
    //   return res.status(404).send("Note not found");
    // }

    res.send("Mort updated successfully");

  } catch (error) {
    console.error("Oracle error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});




module.exports = router;