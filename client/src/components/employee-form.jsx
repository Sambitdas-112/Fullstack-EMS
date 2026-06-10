import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DEPARTMENTS } from "../assets/assets";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function EmployeeForm({initialData,onSuccess,onCancel}){

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData;
    const handleSubmit = async(e)=>{
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget);
        if(isEditMode){
          const pwd = formData.get("password")
          if(!pwd) formData.delete("password")
        }
      try{
        const url = isEditMode ? `/employees/${initialData.id}` : "/employees";
        const method = isEditMode ? "put" : "post";
        await api[method](url, formData)
        onSuccess ? onSuccess() : navigate("/employees")
      }catch(error){
        toast.error(error.response?.data?.error || error.message)
      }finally{
        setLoading(false);
      }
    }

    return(
    <div>
        <h5 className="mb-3">Personal Information</h5>
        <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="d-block form-label">First Name</label>
            <input type="text" name="firstName" className="form-control" required defaultValue={initialData?.firstName} />
          </div>

          <div className="col-md-6">
            <label className="d-block form-label">Last Name</label>
            <input type="text" name="lastName" className="form-control" required defaultValue={initialData?.lastName}/>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="d-block form-label">Phone Number</label>
            <input type="text" name="phone" className="form-control" required defaultValue={initialData?.phone}/>
          </div>

          <div className="col-md-6">
            <label className="d-block form-label">Join Date</label>
            <input type="date" className="form-control" name="joinDate" required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split("T")[0] : ""}/>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Bio (Optional)</label>
          <textarea
            className="form-control" name="bio" rows="4" placeholder="Brief description..." defaultValue={initialData?.bio}></textarea>
        </div>

        <div>
          <h5 className="mt-4">Employment Details</h5>
          <div className="row mt-3">
          <div className="col-md-6">
            <label className="d-block form-label">Department</label>
            <select className="form-select" name="department" defaultValue={initialData?.department || ""}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map((deptName)=>(
                <option key={deptName} value={deptName}>
                    {deptName}
                </option>
              ))}
            </select>
          </div>
            <div className="col-md-6">
              <label className="d-block form-label">Position</label>
              <input type="text" name="position" className="form-control" required defaultValue={initialData?.position}/>
            </div>
            <div className="col-md-6 mt-3">
              <label className="d-block form-label">Basic Salary</label>
              <input type="number" name="basicSalary" className="form-control" required min="0" step="0.01" defaultValue={initialData?.basicSalary || 0}/>
            </div>
            <div className="col-md-6 mt-3">
              <label className="d-block form-label">Allowances</label>
              <input type="number" name="allowances" min="0" step="0.01" className="form-control" required defaultValue={initialData?.allowances || 0}/>
            </div>
            <div className="col-md-6 mt-3">
              <label className="d-block form-label">Deductions</label>
              <input type="number" name="deductions" min="0" step="0.01" className="form-control" required defaultValue={initialData?.deductions || 0}/>
            </div>
            {isEditMode && (
              <div className="col-md-6 mt-3">
                <label className="d-block form-label">Status</label>
                <select className="form-select" name="employmentStatus" required defaultValue={initialData?.employmentStatus}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        <div>
        <h5 className="mt-4">Account Setup</h5>
        <div className="row mb-3">
          <div>
            <label className="d-block form-label">Work Email</label>
            <input type="email" name="email" className="form-control text-secondary" required defaultValue={initialData?.email} />
          </div>
          </div>

          {!isEditMode && (
          <div className="col-md-6">
            <label className="d-block form-label">Temporary Password</label>
            <input type="password" name="password" className="form-control" required defaultValue={initialData?.password}/>
          </div>
          )}
          <div className="row">
          {isEditMode && (
          <div className="col-md-6">
            <label className="d-block form-label">Change Password (Optional)</label>
            <input type="password" name="password" className="form-control" placeholder="Leave blank to keep current"/>
          </div>
          )}
          <div className="col-md-6">
            <label className="d-block form-label">System Role</label>
            <select name="role" className="form-select" defaultValue={initialData?.user?.role || "EMPLOYEE"}>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          </div>
        </div>

        <div className="d-flex flex-row mt-4 gap-2 justify-content-end">
          <button type="button" className="btn btn-secondary" onClick={()=>(onCancel ? onCancel() : navigate(-1))}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
              {loading &&  <span className="sr-only"></span>}
              {isEditMode ? "Update Employee" : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
    )
}