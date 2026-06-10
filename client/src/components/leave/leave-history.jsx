import { useState } from "react"
import { format } from "date-fns"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function LeaveHistory({leaves, isAdmin, onUpdate}){

    const [processing, setProcessing] = useState(null)

    const handleStatusUpdate = async (id, status) => {
        setProcessing(id)
        try{
            await api.patch(`/leave/${id}`, {status})
            toast.success(`Leave ${status.toLowerCase()} successfully`);
            onUpdate?.();
        }catch(error){
            toast.error(error?.response?.data?.error || error?.message)
        }finally{
            setProcessing(null);
        }
    }
    return(
        <div className="mt-5">
            <div className="overflow-x-auto">
                <table className="table table-hover table-bordered table-responsive">
                    <thead className="table-secondary">
                        <tr>
                            {isAdmin && <th className="text-center">Employee</th>}
                            <th className="px-5 text-center text-secondary py-2">Type</th>
                            <th className="px-5 text-center text-secondary py-2">Dates</th>
                            <th className="px-5 text-center text-secondary py-2">Reason</th>
                            <th className="px-5 text-center text-secondary py-2">Status</th>
                            {isAdmin && <th className="text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length === 0? (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 4} className="text-center text-secondary">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave)=>{
                                return(
                                    <tr style={{fontSize:'14px'}} key={leave._id || leave.id}>
                                        {isAdmin && (
                                        <td className="px-2 text-center fw-semibold py-3">
                                            {leave.employee?.firstName} {leave.employee?.lastName}
                                        </td>
                                        )}
                                        <td className="text-secondary text-center fw-semibold py-3 px-3">
                                            <span style={{fontSize:'12px'}}>
                                                {leave.type}
                                            </span>
                                        </td>
                                        <td className="px-2 text-center text-secondary fw-semibold py-3">
                                             {format(new Date(leave.startDate), "MMM dd")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-2 text-center text-secondary fw-semibold py-3" title={leave.reason}>
                                            {leave.reason}
                                        </td>
                                        <td className="px-2 text-center text-secondary fw-semibold py-3">
                                            <span className={`${leave.status === "APPROVED" ? "badge text-success bg-success-subtle" : leave.status === "REJECTED" ? "badge text-danger bg-danger-subtle" : "badge text-bg-warning text-white"}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                {leave.status == "PENDING" && (
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button onClick={()=>handleStatusUpdate(leave._id || leave.id, "APPROVED")} disabled={!!processing}>
                                                            {processing === (leave._id || leave.id) ? <span className="sr-only"></span> : <span className="bi bi-check text-success"></span>}
                                                        </button>
                                                        <button onClick={()=>handleStatusUpdate(leave._id || leave.id, "REJECTED")} disabled={!!processing}>
                                                            {processing === (leave._id || leave.id) ? <span className="sr-only"></span> : <span className="bi bi-x text-danger"></span>}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}