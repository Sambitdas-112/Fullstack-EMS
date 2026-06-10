import { useState } from "react";
import Employees from "../../pages/employees";
import { spread } from "axios";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function GeneratePayslipForm({employees, onSuccess}){

    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    if(!isOpen) return(
        <button onClick={()=>setIsOpen(true)} className="bi bi-plus btn btn-primary"> Generate Payslip</button>
    )

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries())
        try{
            await api.post('/payslips', data)
            setIsOpen(false)
            onSuccess()
        }catch(err){
            toast.error(err.response?.data?.error || err?.message);
        }
        setLoading(false);
    }

    return(
        <div style={{background: 'rgba(0, 0, 0, 0.6)'}} className="modal fade show d-block">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Generate Monthly Payslip</h5>
                    <button onClick={()=> setIsOpen(false)} className="btn-close"></button>
                </div>
                <form onSubmit={handleSubmit}>
                <div className="modal-body">
                        <div>
                            <label className="form-label fw-semibold">Employee</label>
                            <select className="form-select" name="employeeId" required>
                                {employees.map((e)=>( 
                                    <option key={e.id} value={e.id}>
                                        {e.firstName} {e.lastName} ({e.position})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="d-flex row-cols-2 gap-1">
                            <div>
                                <label className="form-label fw-semibold mt-2">Month</label>
                                <select className="form-select" name="month">
                                    {Array.from({length:12}, (_, i)=> i + 1).map
                                        ((m)=>(
                                            <option value={m} key={m}>
                                                {m}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div>
                                <label className="form-label fw-semibold mt-2">Year</label>
                                <input className="form-control" type="number" name="year" defaultValue={new Date().getFullYear()}/>
                            </div>
                        </div>
                        <div>
                            <label className="form-label fw-semibold mt-2">Basic Salary</label>
                            <input className="form-control" type="number" name="basicSalary" required placeholder="7000"/>
                        </div>
                        <div className="d-flex row-cols-2 gap-1">
                            <div>
                                <label className="form-label fw-semibold mt-2">Allowances</label>
                                <input className="form-control" type="number" name="allowances" required defaultValue="0"/>
                            </div>
                            <div>
                                <label className="form-label fw-semibold mt-2">Deductions</label>
                                <input className="form-control" type="number" name="deductions" required defaultValue="0"/>
                            </div>
                        </div>
                    
                </div>
                <div className="modal-footer">
                    <button onClick={()=>setIsOpen(false)} type="button" className="btn btn-secondary">
                        Cancel
                    </button>
                    <button disabled={loading} type="submit" className="btn btn-primary">
                        {loading && <span className="sr-only"></span>}
                        Generate
                    </button>
                </div>
                </form>
            </div>
        </div>
    </div>
    )
}