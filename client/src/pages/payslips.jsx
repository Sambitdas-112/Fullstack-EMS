import { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets";
import Loading from "../components/loading";
import PayslipList from "../components/payslip/payslip-list";
import GeneratePayslipForm from "../components/payslip/generate-payslip-form";
import { useAuth } from "../context/auth-context";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Payslips() {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth()

  const isAdmin = user?.role === "admin";

  // ✅ fetch payslips
  const fetchPayslips = useCallback( async() => {
    try{
      const res = await api.get('/payslips')
      setPayslips(res.data.data || [])
    }catch(error){
      toast.error(error?.response?.data?.error || error?.message)
    }finally{
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {
    if(isAdmin) api.get("/employees").then((res)=>setEmployees(res.data.filter((e)=>!e.isDeleted))).catch(()=>{})
  }, [isAdmin]);

  if (loading) return <Loading />;

  return (
    <div className="container-fluid px-3 py-2">
      {/* ✅ HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
        <div>
          <h3 className="fw-bold mb-1">Payslips</h3>
          <p className="text-secondary mb-0"> {isAdmin ? "Generate and manage employee payslips" : "Your payslip history"}
          </p>
        </div>

        {/* ✅ BUTTON (RESPONSIVE, NO ABSOLUTE POSITIONING) */}
        {isAdmin && (
          <div className="w-md-auto">
            <GeneratePayslipForm employees={employees} onSuccess={fetchPayslips}/>
          </div>
        )}
      </div>

      {/* ✅ LIST */}
      <div className="mt-3">
        <PayslipList payslips={payslips} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
