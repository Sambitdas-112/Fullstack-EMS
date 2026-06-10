import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import api from "../api/axios";

export default function Sidebar() {
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("");

  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile");

        if (data.firstName) {
          setUserName(`${data.firstName} ${data.lastName || ""}`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const role = user?.role;

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "bi-grid-fill",
      show: true,
    },
    {
      name: "Employees",
      href: "/employees",
      icon: "bi-people-fill",
      show: role === "admin",
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: "bi-calendar-check-fill",
      show: role !== "admin",
    },
    {
      name: "Leave",
      href: "/leave",
      icon: "bi-calendar-event-fill",
      show: true,
    },
    {
      name: "Payslips",
      href: "/payslips",
      icon: "bi-receipt-cutoff",
      show: true,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "bi-gear-fill",
      show: true,
    },
  ];

  const handleLogout = async () => {
    await logout();
    if (role === "admin") {
    navigate("/login/admin");
  } else {
    navigate("/login/employee");
  }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="d-md-none bg-white border-bottom px-3 py-2 d-flex justify-content-between align-items-center position-sticky top-0 z-3">
        <button className="btn btn-dark" onClick={() => setShow(true)}>
          <span className="bi bi-list fs-5"></span>
        </button>

        <h5 className="fw-bold mb-0">
          Employee<span className="text-primary">MS</span>
        </h5>
      </div>

      {/* Overlay */}
      {show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1040 }}
          onClick={() => setShow(false)}></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-dark text-white position-fixed top-0 start-0 vh-100 p-4 d-flex flex-column justify-content-between ${
          show ? "translate-middle-x-0" : ""
        }`}
        style={{width: "290px", zIndex: 1050, transform: show || window.innerWidth >= 768 ? "translateX(0)" : "translateX(-100%)", transition: "0.3s", }}>
        <div>
          {/* Close Button */}
          <div className="d-flex justify-content-between align-items-center d-md-none mb-4">
            <h5 className="fw-bold mb-0">Menu</h5>

            <button className="btn btn-light btn-sm" onClick={() => setShow(false)}><span className="bi bi-x-lg"></span></button>
          </div>

          {/* Logo */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="bg-light text-primary rounded-3 d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px" }}>
              <span className="bi bi-buildings-fill fs-4"></span>
            </div>

            <div>
              <h5 className="fw-bold mb-0">EmployeeMS</h5>
              <small className="text-secondary">Management System</small>
            </div>
          </div>

          {/* Profile */}
          <div className="bg-secondary bg-opacity-25 rounded-4 p-3 d-flex align-items-center gap-3 mb-4">
            <div
              className="bg-secondary bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "48px",
                height: "48px",
                fontSize: "20px",
              }}>
              {userName?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h6 className="mb-0 fw-bold">{userName || "Employee"}</h6>

              <small className="text-light">
                {role === "admin" ? "Administrator" : "Employee"}
              </small>
            </div>
          </div>

          {/* Navigation */}
          <p className="text-secondary small fw-semibold text-uppercase">
            Navigation
          </p>

          <ul className="nav flex-column gap-2">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <li key={item.href}>
                  <Link to={item.href} onClick={() => setShow(false)} className={`nav-link rounded-3 px-3 py-3 d-flex align-items-center gap-3 ${location.pathname === item.href? "bg-primary text-white": "text-light"}`}>

                    <span className={`bi ${item.icon}`}></span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="btn btn-outline-danger p-2 w-100 rounded-3"><span className="bi bi-box-arrow-right me-2"></span>Logout</button>
      </div>
    </>
  );
}
