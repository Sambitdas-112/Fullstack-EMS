import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function ApplyLeaveModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await api.post("/leave", data);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || err?.message);
    }
  };
  if (!open) return null;

  return (
    <div
      style={{ background: "rgba(0, 0, 0, 0.6)" }}
      className="modal fade show d-block"
      onClick={onClose}>
      <div className="modal-dialog">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Apply For Leave</h5>
              <p style={{ fontSize: "14px" }} className="text-secondary">
                Submit your leave request for approval
              </p>
            </div>
            <button className="btn-close mb-4" onClick={onClose}></button>
          </div>
          
            <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div>
                <label className="d-flex form-label align-items-center fw-semibold gap-2 mb-2">
                  <span className="bi bi-file-text"> Leave Type</span>
                </label>
                <select className="form-select" name="type" required>
                  <option value="SICK">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="ANNUAL">Annual Leave</option>
                </select>
              </div>
              <label className="d-flex form-label align-items-center fw-semibold gap-2 mt-2 ">
                <span className="bi bi-calendar-date"> Duration</span>
              </label>
              <div className="d-flex row-cols-2 gap-2">
                <div>
                  <span className="d-block fw-semibold text-secondary mb-1">
                    From
                  </span>
                  <input className="form-control" type="date" name="startDate" required min={minDate}/>
                </div>
                <div>
                  <span className="d-block fw-semibold text-secondary mb-1">
                    To
                  </span>
                  <input className="form-control" type="date" name="endDate" required min={minDate}/>
                </div>
              </div>
              <div>
                <label className="d-flex form-label align-items-center fw-semibold gap-2 mt-2">
                  <span className="bi bi-question-circle"> Reason</span>
                </label>
                <textarea className="form-control" name="reason" required rows="3" placeholder="Briefly describe why you need this leave..."></textarea>
              </div>
            
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button className="btn btn-primary" disabled={loading} type="submit">{loading ? (<span className="sr-only"></span>) : (<span className="bi bi-send"></span>)}{loading ? "Submitting..." : " Submit"}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
