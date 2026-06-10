import { getDayTypeDisplay, getWorkingHoursDisplay } from "../../assets/assets";
import { format } from "date-fns";

export default function AttendanceHistory({ history = [] }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "PRESENT":
        return "success";

      case "LATE":
        return "warning";

      case "ABSENT":
        return "danger";

      default:
        return "secondary";
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5" >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Recent Activity</h5>
      </div>

      {/* Responsive Table */}
      <div className=" shadow-sm  overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle mb-0">
            <thead className="table-secondary">
              <tr>
                <th className="px-2 px-md-3 py-2 py-md-3 text-nowrap small">
                  Date
                </th>

                <th className="px-2 px-md-3 py-2 py-md-3 text-center text-nowrap small">
                  Check In
                </th>

                <th className="px-2 px-md-3 py-2 py-md-3 text-center text-nowrap small">
                  Check Out
                </th>

                <th className="px-2 px-md-3 py-2 py-md-3 text-center text-nowrap small">
                  Hours
                </th>

                {/* FIXED */}
                <th
                  className="px-2 px-md-3 py-2 py-md-3 text-center small"
                  style={{ minWidth: "110px" }}>
                  Day Type
                </th>

                {/* FIXED */}
                <th
                  className="px-2 px-md-3 py-2 py-md-3 text-center small"
                  style={{ minWidth: "100px" }}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-5 text-muted fw-semibold">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                history.map((record) => {
                  const dayType = getDayTypeDisplay(record);

                  return (
                    <tr key={record._id || record.id}>
                      {/* Date */}
                      <td className="px-2 px-md-3 py-2 py-md-3 fw-semibold text-nowrap small">
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </td>

                      {/* Check In */}
                      <td className="px-2 px-md-3 py-2 py-md-3 text-center text-nowrap small">
                        {record.checkIn
                          ? format(new Date(record.checkIn), "hh:mm a")
                          : "-"}
                      </td>

                      {/* Check Out */}
                      <td className="px-2 px-md-3 py-2 py-md-3 text-center text-nowrap small">
                        {record.checkOut
                          ? format(new Date(record.checkOut), "hh:mm a")
                          : "-"}
                      </td>

                      {/* Working Hours */}
                      <td className="px-2 px-md-3 py-2 py-md-3 text-center text-nowrap fw-semibold small">
                        {getWorkingHoursDisplay(record)}
                      </td>

                      {/* Day Type */}
                      <td className="px-2 px-md-3 py-2 py-md-3 text-center" style={{ minWidth: "110px" }}>
                        {dayType.label !== "-" ? (
                          <span className={`badge p-2 bg-warning-subtle text-warning ${dayType.className}`}>
                            {dayType.label}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 text-center fw-semibold py-3">
                        <span
                          className={`${record.status === "PRESENT" ? "badge bg-warning-subtle text-warning" : record.status === "LATE" ? "badge bg-danger-subtle p-2 text-danger" : ""}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
