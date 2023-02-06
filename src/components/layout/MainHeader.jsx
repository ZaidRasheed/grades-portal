import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Collapse } from "react-bootstrap";

export default function MainHeader() {
    const [hamburgerMenu, setHamburgerMenu] = useState(false)
    const url = useLocation()

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand h1 mx-4" to="/">Grades Portal</Link>
                <button onClick={() => setHamburgerMenu(prev => !prev)} className="navbar-toggler" type="button">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse row">
                    <div className="col-12 d-flex justify-content-end">
                        <ul className="navbar-nav flex-row mx-4">
                            <li className="nav-item">
                                <Link className={`nav-link ${url.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${url.pathname === '/student-login' ? 'active' : ''}`} to="/student-login">Students</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${url.pathname === '/teacher-login' ? 'active' : ''}`} to="/teacher-login">Teachers</Link>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
            <Collapse in={hamburgerMenu} >
                <ul className="navbar-nav  m-auto">
                    <li className="nav-item h4">
                        <Link className={`nav-link ${url.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item h4">
                        <Link className={`nav-link ${url.pathname === '/student-login' ? 'active' : ''}`} to="/student-login">Students</Link>
                    </li>
                    <li className="nav-item h4">
                        <Link className={`nav-link ${url.pathname === '/teacher-login' ? 'active' : ''}`} to="/teacher-login">Teachers</Link>
                    </li>
                </ul>
            </Collapse>
        </nav>
    )
}
