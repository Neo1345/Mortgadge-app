import React from 'react'

import { useContext} from 'react'
import mortContext from "../context/mort/mortContext"

const Admin = () => {

  const context = useContext(mortContext);
  const { Administration } = context;

  // Handlers for button clicks
  const handleBackup = () => {
    // TODO: call your backup API or logic here
    // console.log("Backup initiated...");
    Administration('backup');
    alert("Backup process completed!");
  };

  const handleRecover = () => {
    // TODO: call your recover API or logic here
    // console.log("Recover initiated...");
    Administration('recover');
    alert("Recover process completed!");
  };
  

  return (
    // <body style={{backgroundColor: "#f0f8ff"}}>
    <div>
    {/* <div className="container"> */}
      <h2 className="mb-4 text-center">Administration Panel</h2>

      <div className="d-flex justify-content-center gap-3">
        <button
          className="btn btn-primary"
          onClick={handleBackup}
        >
          🔒 Backup Data
        </button>

        <button
          className="btn btn-success"
          onClick={handleRecover}
        >
          ♻️ Recover Data
        </button>
      </div>
    </div>
    //  </div>
  );
}



export default Admin