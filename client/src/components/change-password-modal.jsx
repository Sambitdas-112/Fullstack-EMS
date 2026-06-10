import { useState } from "react"
import api from "../api/axios";

export default function ChangePasswordModal({open, onClose}){

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({type:"", text:""})

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({type:"", text:""});
        const formData = new FormData(e.currentTarget)
        const currentPassword = formData.get("currentPassword");
        const newPassword = formData.get("newPassword");

        try{
            const {data} = await api.post("/auth/change-password", {currentPassword, newPassword});
            if(!data.success) throw new Error(data.error || "Failed")
                setMessage({type: "success", text: data.message})
                e.target.reset();
        }catch(error){
            setMessage({
            type: "error",
            text: error.response?.data?.error || error.message || "Something went wrong",
        });
        }finally{
            setLoading(false);
        }
    }

    if(!open) return null;

    return(
        <div style={{background: 'rgba(0, 0, 0, 0.6)'}} className="modal fade show d-block" onClick={onClose}>
            <div className="modal-dialog">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                    <h5 className="modal-title bi bi-lock"> Change Password</h5>
                    </div>
                    <button className="btn-close mb-4" onClick={onClose}></button>
                </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                        {message.text && (
                        <div className={`alert ${message.type === "success"? "alert-success text-success": "alert-danger text-danger"}`}role="alert"> <i className={`bi ${message.type === "success"? "bi-check-circle-fill": "bi-exclamation-triangle-fill"}`}></i><span> {message.text}</span>
                        </div>
                        )}
                        <div>
                            <label className="d-block form-label fw-semibold mt-2">Current Password</label>
                            <input type="password" className="form-control" name="currentPassword" required/>
                        </div>
                        <div>
                            <label className="d-block form-label fw-semibold mt-2">New Password</label>
                            <input type="password" className="form-control" name="newPassword" required/>
                        </div>
                    
                </div>
                <div className="modal-footer">
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                    Cancel
                    </button>
                    <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading && <span className="sr-only"></span>} 
                    Update Password
                    </button>
                </div>
                </form>
            </div>
        </div>
    </div>
    )
}