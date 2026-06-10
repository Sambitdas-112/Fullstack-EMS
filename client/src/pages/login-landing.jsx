import { Link, Navigate } from "react-router-dom";
import LoginLeftSide from "../components/login-left-side";
import Loading from "../components/loading";
import { useAuth } from "../context/auth-context";

export default function LoginLanding(){

    const {user, loading} = useAuth()

    if(loading) return <Loading/>
    // if(!user) return <Navigate to="/login"/>

    const portalOptions = [
        {
            to: "/login/admin",
            title: "Admin Portal",
            description: "Manage Employees, departments, payroll, and system configuration."
        },
        {
            to: "/login/employee",
            title: "Employee Portal",
            description: "View your profile, track attendance, request time off, and access payslips."
        }
    ]

    return(
        <div className="d-flex flex-column flex-lg-row min-vh-10">
            <LoginLeftSide/>
            <div className="p-4 p-md-5 flex-grow-1">
                    <div
                        className="text-center text-md-start mx-3 mx-md-5"
                        style={{ marginTop: window.innerWidth < 992 ? "50px" : "170px" }}>
                        <h2 className="text-dark fs-3">Welcome Back</h2>
                        <p className="mt-3 text-secondary">Select your portal to securely access the system</p>
                    </div>
                    <div className="mt-3 mx-3 mx-md-5 w-75 d-flex flex-column">
                        {portalOptions.map((portal)=>(
                            <Link key={portal.to} to={portal.to} className="mt-2 text-decoration-none text-secondary border rounded btn btn-light p-3">
                                <div>
                                    <h6 className="d-flex justify-content-between align-items-center mb-0">{portal.title} <span className="bi bi-arrow-right"></span></h6>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 me-5 text-center text-secondary" style={{fontSize:'14px'}}>
                        <p>© {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}