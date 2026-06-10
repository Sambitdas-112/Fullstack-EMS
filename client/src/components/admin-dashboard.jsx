import { Link } from "react-router-dom";

export default function AdminDashboard({ data }) {
  const stats = [
    {
      value: data.totalEmployees,
      label: "Total Employees",
      description: "Active Workforce",
      icon: "bi-people-fill",
      color: "primary",
    },
    {
      value: data.totalDepartments,
      label: "Departments",
      description: "Organization Units",
      icon: "bi-building",
      color: "info",
    },
    {
      value: data.todayAttendance,
      label: "Today's Attendance",
      description: "Checked in today",
      icon: "bi-calendar-check-fill",
      color: "success",
    },
    {
      value: data.pendingLeaves,
      label: "Pending Leaves",
      description: "Awaiting Approval",
      icon: "bi-hourglass-split",
      color: "warning",
    },
  ];

  return (
    <div className="container py-2">
      <div className="mb-5">
        <h3 className="fw-bold">Dashboard</h3>
        <p className="text-muted mb-0">
          Welcome back, Admin — here's your overview
        </p>
      </div>

      <div className="row g-3">
        {stats.map((s) => (
          <div className="col-12 col-sm-6 col-lg-3" key={s.label}>
            <div
              className={`card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-4 border-${s.color}`}>
              <div className="d-flex align-items-center gap-3">
                {/* ICON */}
                <div
                  className={`d-flex align-items-center justify-content-center rounded-circle bg-${s.color} bg-opacity-10`}
                  style={{ width: "45px", height: "45px" }}>
                  <span className={`bi ${s.icon} fs-4 text-${s.color}`}></span>
                </div>

                {/* TEXT */}
                <div>
                  <p className="text-muted mb-1 small">{s.label}</p>
                  <h4 className="fw-bold mb-0">{s.value}</h4>
                  <span className="text-muted small">{s.description}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
