// import React, { useEffect } from 'react'
import { Link, useLocation } from "react-router-dom"

const Navbar = () => {

    let location = useLocation();
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#4f7879be" }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"><strong>Mortgadge App</strong></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Entry Section</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">End Mortgadge</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/snapshot" ? "active" : ""}`} to="/snapshot">Snapshot</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/pendingmort" ? "active" : ""}`} to="/pendingmort">Outstanding-Mort</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/mortinred" ? "active" : ""}`} to="/mortinred">Mortgadge In Red</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/admin"? "active": ""} text-end` } to="/admin">Administration</Link> */}
                        {/* </li> */}

                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`} to="/admin"><i className="fas fa-lock me-1"></i><strong>Administration</strong> </Link>
                        </li>
                    </ul>


                </div>
            </div>
        </nav>
    )
}

export default Navbar