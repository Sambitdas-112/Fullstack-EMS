import { useCallback, useEffect, useState } from "react";
import Loading from "../components/loading";
import { dummyLeaveData } from "../assets/assets";
import LeaveHistory from "../components/leave/leave-history";
import ApplyLeaveModal from "../components/leave/apply-leave-modal";
import { useAuth } from "../context/auth-context";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Leave() {
  const {user} = useAuth()
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const isAdmin = user?.role === "admin";

  const fetchLeaves = useCallback(async() => {
    try{
      const res = await api.get('/leave');
      setLeaves(res.data.data || [])
      if(res.data.employee?.isDeleted) setIsDeleted(false)
    }catch(error){
      toast.error(error?.response?.data?.error || error.message)
    }finally{
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  if (loading) return <Loading />;

  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const sickCount = approvedLeaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedLeaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedLeaves.filter((l) => l.type === "ANNUAL").length;

  const leaveStats = [
    {
      label: "Sick Leave",
      value: sickCount,
      icon: <span className="bi bi-thermometer text-danger"></span>,
    },
    {
      label: "Casual Leave",
      value: casualCount,
      icon: <span className="bi bi-umbrella text-primary"></span>,
    },
    {
      label: "Annual Leave",
      value: annualCount,
      icon: <span className="bi bi-flower1 text-success"></span>,
    },
  ];

  return (
    <div className="container-fluid px-3 py-2">
      {/* ✅ HEADER (RESPONSIVE) */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
        <div>
          <h3 className="fw-bold mb-1">Leave Management</h3>
          <p className="text-secondary mb-0">
            {isAdmin ? "Manage leave applications" : "Your leave history and requests"}
          </p>
        </div>

        {!isAdmin && !isDeleted && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary d-flex align-items-center gap-2 w-md-auto"><span className="bi bi-plus-lg"></span>Apply For Leave</button>)}
      </div>

      {/* ✅ STATS (MOBILE FRIENDLY GRID) */}
      {!isAdmin && (
        <div className="row g-3 mt-4">
          {leaveStats.map((s) => (
            <div className="col-12 col-sm-6 mb-2 col-lg-4" key={s.label}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="fs-3">{s.icon}</div>

                  <div>
                    <div className="text-muted small">{s.label}</div>
                    <div className="fw-bold fs-4 text-success">{s.value}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ HISTORY */}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />

      {/* ✅ MODAL */}
      <ApplyLeaveModal open={showModal} onClose={() => setShowModal(false)} onSuccess={fetchLeaves}/>
    </div>
  );
}
