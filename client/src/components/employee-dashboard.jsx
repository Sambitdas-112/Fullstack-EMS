import { Link } from "react-router-dom";

export default function EmployeeDashboard({ data }) {
  const emp = data.employee;

  const cards = [
    {
      value: data.currentMonthAttendance,
      title: "Days Present",
      subtitle: "This Month",
      icon: "bi-calendar-check",
      color: "primary",
    },
    {
      value: data.pendingLeaves,
      title: "Pending Leaves",
      subtitle: "Awaiting Approval",
      icon: "bi-clock-history",
      color: "warning",
    },
    {
      value: data.latestPayslip
        ? `₹${data.latestPayslip.netSalary?.toLocaleString()}`
        : "N/A",
      title: "Latest Payslip",
      subtitle: "Most recent payout",
      icon: "bi-cash-stack",
      color: "success",
    },
  ];

  return (
    <div className="container-fluid px-3 py-3 overflow-hidden">
      {/* HEADER */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Welcome, {emp?.firstName} 👋</h3>

        <p className="text-secondary mb-0">
          {emp?.position} • {emp?.department || "No Department"}
        </p>
      </div>

      {/* STATS */}
      <div className="row mt-3 g-3">
        {cards.map((card, index) => (
          <div className="col-12 col-sm-6 col-lg-4" key={index}>
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-secondary small mb-1">{card.title}</p>
                    <h3 className="fw-bold mb-1">{card.value}</h3>
                    <small className="text-muted">{card.subtitle}</small>
                  </div>

                  <div
                    className={`bg-${card.color}-subtle text-${card.color} rounded-circle d-flex align-items-center justify-content-center`}
                    style={{
                      width: "52px",
                      height: "52px",
                      fontSize: "20px",
                    }}>
                    <span className={`bi ${card.icon}`}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="d-flex flex-column flex-sm-row gap-3 mt-5">
        <Link
          to="/attendance"
          className="btn btn-primary fw-semibold px-4 py-2">
          Mark Attendance
          <span className="bi bi-arrow-right ms-2"></span>
        </Link>

        <Link
          to="/leave"
          className="btn btn-outline-success fw-semibold px-4 py-2">
          Apply For Leave
        </Link>
      </div>
    </div>
  );
}
