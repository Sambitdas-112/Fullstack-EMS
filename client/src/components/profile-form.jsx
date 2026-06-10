import { useState } from "react"
import api from "../api/axios";

export default function ProfileForm({initialData, onSuccess}){
    if (!initialData) return null;
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        setError("")
        setMessage("")
        const formData = new FormData(e.currentTarget)
        try{
            await api.post("/profile", formData)
            setMessage("Profile updated successfully")
            onSuccess?.()
        }catch(err){
            setError(err.response?.data?.error || err.message)
        }finally{
            setLoading(false)
        }
    }
    return(
        <form onSubmit={handleSubmit} class="row border border-1 rounded card card-group shadow-sm p-1 mt-1 g-3">
            <div className=" d-flex align-items-center">
                <div className="me-2 text-secondary">
                    <span className="bi bi-person fs-4"></span>
                </div>
                <div className="fw-semibold fs-5 text-dark">
                    Public Profile
                </div>
            </div>
            
            {error && (
            <div className="alert alert-danger d-flex align-items-center mb-3">
                <span className="bi bi-exclamation-triangle-fill me-2"></span>
                {error}
            </div>
            )}
            {message && (
            <div className="alert alert-success d-flex align-items-center">
                <span className="bi bi-check-circle-fill me-2"></span>
                {message}
            </div>
            )}


            <div class="col-md-6 fw-semibold">
                <label className="form-label d-block">Name</label>
                <input disabled value={`${initialData.firstName} ${initialData.lastName}`} type="text" className="form-control text-secondary"/>
            </div>
            <div class="col-md-6 fw-semibold">
                <label className="form-label d-block">Email</label>
                <input disabled value={`${initialData.email}`} type="email" className="form-control text-secondary"/>
            </div>
            <div class="col-12 fw-semibold">
                <label for="inputAddress" className="d-block form-label">Position</label>
                <input type="text" disabled value={initialData.position} className="form-control"/>
            </div>
            <div class="col-12 mt-2">
                <label className="form-label fw-semibold d-block">Bio</label>
                <textarea name="bio" disabled={initialData.isDeleted} defaultValue={initialData.bio || ""} placeholder="Write a brief bio..." className={`form-control ${initialData.isDeleted ? "bg-white text-secondary disabled" : ""}`}></textarea>
                <p style={{fontSize:'14px'}} className="mt-1 text-secondary">This will be displayed on your profile.</p>
            </div>
            {initialData.isDeleted ? (
                <div className="pt-2">
                    <div className="p-2 text-center border border-secondary rounded rounded-2">
                        <p>Account Deactivated</p>
                        <p>You can no longer update your profile</p>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-end">
                    <button type="submit" disabled={loading} className="btn btn-primary mb-2 d-flex align-items-center gap-2 justify-content-center">
                        {loading ? <span className="sr-only"></span> : <span className="bi bi-floppy"></span>}
                        Save Changes
                    </button>
                </div>
            )}
    </form>
    )
}