import './App.css';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import { Home } from "./components/Home";
import About from './components/About';
import Snapshot from './components/Snapshot';
import MortState from './context/mort/MortState';
import { useState,useRef } from "react";
import Alert from "./components/Alert";
import PendingMort from './components/PendingMort';
import MortInRed from './components/MortInRed';
import Admin from './components/Admin';

function App() {

  const [alert,setAlert] = useState(null);
  const alertRef = useRef(null);


  const showAlert = (message,type)=> {

    setAlert({
      msg:message,
      type:type
    })
    setTimeout( () => {
      setAlert(null);
    },5000 );
  }
  return (
    <MortState>
    <Router>
        <Navbar />
        <Alert alert=  {alert} />
        {/* <Alert message = "this is amazing react course"/> */}
        <div className="container">
        <Routes>
           <Route path="/" element={<Home showalert = {showAlert} />} /> 
          <Route path="/about" element={<About showalert = {showAlert} />} />
          <Route path="/snapshot" element={<Snapshot showalert = {showAlert}/>} />
          <Route path="/pendingmort" element={<PendingMort showalert = {showAlert}/>} />
          <Route path="/mortinred" element={<MortInRed/>} />
           <Route path="/admin" element={<Admin/>} />
        </Routes>
        </div>
      </Router>
      </MortState>
  );
}

export default App;
