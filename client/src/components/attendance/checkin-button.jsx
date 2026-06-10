import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function CheckInButton({ todayRecord, onAction }) {
  const [loading, setLoading] = useState(false);

  const handleAttendance = async () => {
  setLoading(true);

  try {
    const res = await api.post("/attendance");

    console.log("Attendance Response:", res.data);

    toast.success(
      res.data.type === "CHECK_OUT"
        ? "Checked Out Successfully"
        : "Checked In Successfully"
    );

    onAction();
  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.error || error?.message
    );
  }

  setLoading(false);
};

  // Work Completed
  if (todayRecord?.checkOut) {
    return (
      <div className="position-fixed bottom-0 end-0 p-2 p-md-3" style={{zIndex: 1050,}}>
        <div className="bg-white border shadow rounded-4 px-3 py-2 text-center" style={{width: "220px", maxWidth: "85vw",}}>
            <span className="bi bi-check-circle-fill text-success fs-3"></span>
            <div className="fw-bold mt-1 small">Work Completed</div>
            <small className="text-muted">Great Job! See you tomorrow</small>
        </div>
      </div>
    );
  }

  const isCheckedIn = !!todayRecord?.checkIn;

  return (
    <div className="position-fixed bottom-0 end-0 p-2 p-md-3" style={{zIndex: 1050,}}>

      <button onClick={handleAttendance} disabled={loading} className="btn border-0 rounded-4 shadow-lg d-flex align-items-center gap-2 text-white px-3 py-2" style={{width: "230px",minHeight: "64px", background: isCheckedIn ? "linear-gradient(135deg,#1e3a8a,#172554)":"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>
        
        {/* Icon */}
        <div className="flex-shrink-0">
          {loading ? (
            <div className="spinner-border spinner-border-sm text-light"
              role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : isCheckedIn ? (
            <span className="bi bi-box-arrow-left fs-5"></span>
          ) : (
            <span className="bi bi-box-arrow-right fs-5"></span>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow-1 align-items-center text-center text-start">
          <div className="fw-bold small">
            {loading ? "Processing..." : isCheckedIn ? "Clock Out" : "Clock In"}
          </div>

          <small className="opacity-75 d-block">
            {isCheckedIn ? "End your shift" : "Start your work"}
          </small>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <span className="bi bi-chevron-right"></span>
        </div>
      </button>
    </div>
  );
}

