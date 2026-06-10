import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { dummyPayslipData } from "../assets/assets";
import Loading from "../components/loading";
import { format, isDate } from "date-fns";
import api from "../api/axios";

export default function PrintPayslip(){

    const {id} = useParams();
    const [payslip, setPayslip] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        api.get(`/payslips/${id}`).then((res)=> setPayslip(res.data)).catch(console.error).finally(()=>setLoading(false))
    },[id])

    if(loading) return <Loading/>
    if(!payslip) return <p className="text-center py-5 text-secondary">Payslip not found</p>

    return(
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-sm p-4" style={{width:'500px'}}>
                <h4 className="text-center fw-bold">PAYSLIP</h4>
                <p className="text-center text-muted">{format(new Date(payslip.year,payslip.month - 1), "MMMM yyyy")}</p>
                
                <hr />

                <div className="row mt-3">
                <div className="col-5">
                    <small className="text-muted">EMPLOYEE NAME</small>
                    <div className="fw-semibold">{payslip.employee?.firstName} {payslip.employee?.lastName}</div>
                </div>
                <div className="col-7 text-end">
                    <small className="text-muted">POSITION</small>
                    <div className="fw-semibold">{payslip.employee?.position}</div>
                </div>
                </div>

                <div className="row mt-3">
                <div className="col-6">
                    <small className="text-muted">EMAIL</small>
                    <div className="fw-semibold">{payslip.employee?.email}</div>
                </div>
                <div className="col-6 text-end">
                    <small className="text-muted">PERIOD</small>
                    <div className="fw-semibold">{format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}</div>
                </div>
                </div>

                <div className="mt-4 border rounded">
                <div className="d-flex justify-content-between px-3 py-2 bg-light border-bottom fw-semibold text-muted">
                    <span>DESCRIPTION</span>
                    <span>AMOUNT</span>
                </div>

                <div className="d-flex justify-content-between px-3 py-2">
                    <span>Basic Salary</span>
                    <span>₹{payslip.basicSalary?.toLocaleString()}</span>
                </div>

                <div className="d-flex justify-content-between px-3 py-2">
                    <span>Allowances</span>
                    <span className="text-success">+₹{payslip.allowances?.toLocaleString()}</span>
                </div>

                <div className="d-flex justify-content-between px-3 py-2 border-bottom">
                    <span>Deductions</span>
                    <span className="text-danger">-₹{payslip.deductions?.toLocaleString()}</span>
                </div>

                <div className="d-flex justify-content-between px-3 py-3 fw-bold">
                    <span>Net Salary</span>
                    <span>₹{payslip.netSalary?.toLocaleString()}</span>
                </div>
                </div>

                <div className="text-center mt-4">
                <button onClick={()=>window.print()} className="btn btn-primary px-4 d-print-none">
                    Print Payslip
                </button>
                </div>
            </div>
    </div>
    )
}