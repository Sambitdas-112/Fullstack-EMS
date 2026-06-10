export default function AttendanceStats({ history }) {
  const totalPresent = history.filter(
    (h) => (h.status === "PRESENT") | (h.status === "LATE"),
  ).length;
  const totalLate = history.filter((h) => h.status === "LATE").length;

  const stats = [
    {
      label: "Days Present",
      value: totalPresent,
      icon: "bi-calendar-check",
      color: "primary",
    },
    {
      label: "Late Arrivals",
      value: totalLate,
      icon: "bi-exclamation-triangle",
      color: "warning",
    },
    {
      label: "Avg. Work Hrs",
      value: "8.5 Hrs",
      icon: "bi-clock-history",
      color: "success",
    },
  ];

  return (
    <div className="container-fluid py-3">
      <div className="row g-3">
        {stats.map((s) => (
          <div className="col-12 col-sm-6 col-lg-4" key={s.label}>
            <div className="card border-0 shadow-sm rounded-4 h-100 attendance-card">
              <div className="card-body d-flex align-items-center p-3 p-md-4">
                {/* Icon */}
                <div className={`bg-${s.color} bg-opacity-10 text-${s.color} d-flex align-items-center justify-content-center rounded-circle flex-shrink-0`} style={{width: "52px",height: "52px",}}>
                  <span className={`bi ${s.icon} fs-5`}></span>
                </div>

                {/* Content */}
                <div className="ms-3 overflow-hidden">
                  <p className="text-muted mb-1 small">{s.label}</p>
                  <h4 className="fw-bold mb-0 text-dark">{s.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
