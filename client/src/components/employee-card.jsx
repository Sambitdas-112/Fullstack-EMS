import toast from "react-hot-toast";
import api from "../api/axios";

export default function EmployeeCard({ employee, onDelete, onEdit }) {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try{
      await api.delete(`/employees/${employee.id}`)
      onDelete()
    }catch(err){
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100" style={{maxWidth:'250px',minHeight:'280px'}}>
      {/* TOP SECTION */}
      <div className="position-relative bg-secondary-subtle py-5">
        {/* DEPARTMENT BADGE */}
        <div className="position-absolute top-0 start-0 p-2 d-flex gap-2">
          <span className="badge bg-white text-secondary shadow-sm">
            {employee.department || "Remote"}
          </span>

          {employee.isDeleted && (
            <span className="badge bg-danger">Deleted</span>
          )}
        </div>

        {/* AVATAR */}
        <div className="d-flex justify-content-center">
          <div
            className="rounded-circle bg-success-subtle d-flex align-items-center justify-content-center shadow-sm"
            style={{
              width: "60px",
              height: "60px",
            }}>
            <span className="text-success fw-bold fs-5">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {!employee.isDeleted && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              onClick={() => onEdit(employee)}
              className="btn btn-md btn-light rounded-circle shadow-sm">
              <span className="bi bi-pencil text-warning"></span>
            </button>

            <button
              onClick={handleDelete}
              className="btn btn-md btn-light rounded-circle shadow-sm">
              <span className="bi bi-trash text-danger"></span>
            </button>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="card-body bg-light text-center">
        <h5 className="fw-bold mb-1">
          {employee.firstName} {employee.lastName}
        </h5>
        <p className="text-secondary small mb-0">{employee.position}</p>
      </div>
    </div>
  );
}
