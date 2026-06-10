import { useCallback, useEffect, useState } from "react"
import { dummyAttendanceData } from "../assets/assets"
import CheckInButton from "../components/attendance/checkin-button"
import AttendanceStats from "../components/attendance/attendance-stats"
import AttendanceHistory from "../components/attendance/attendance-history"
import Loading from "../components/loading"
import api from "../api/axios"
import toast from "react-hot-toast"

export default function Attendance(){

    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [isDeleted, setIsDeleted] = useState(false)

    const fetchData = useCallback(async ()=>{
        try{
            const res = await api.get("/attendance");
            const json = res.data;
            setHistory(json.data || [])
            if(json.employee?.isDeleted) setIsDeleted(true)
        }catch(error){
            toast.error(error?.response?.data?.error || error?.message)
        }finally{
            setLoading(false)
        }
    },[])
    
    useEffect(()=>{
        fetchData()
    },[fetchData]);

    if (loading) return <Loading/>

    const today = new Date()
    today.setHours(0,0,0,0)
    const todayRecord = Array.isArray(history)
  ? history.find(
      (r) =>
        new Date(r.date).toDateString() === today.toDateString()
    )
  : null;

    return(
        <div className="container mt-2">
            <div className="page-header mx-2">
                <h3 className="page-title fw-bold">Attendance</h3>
                <p className="page-subtitle">Track your work hours and daily check-ins</p>
            </div>

            {isDeleted ? (
                <div className="mb-5 p-5 bg-danger-subtle border border-danger-subtle text-center rounded rounded-2">
                    <p className="text-danger-emphasis">You can no longer clock in or out because your employee records have been marked as deleted.</p>
                </div>
            ): (
                <div className="mt-4">
                    <CheckInButton todayRecord={todayRecord} onAction={fetchData}/>
                </div>
            )}
            <AttendanceStats history={history}/>
            <AttendanceHistory history={history}/>
        </div>
    )
}