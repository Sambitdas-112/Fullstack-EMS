import { useCallback, useEffect, useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import EmployeeCard from "../components/employee-card";
import EmployeeForm from "../components/employee-form";
import Loading from "../components/loading";
import api from "../api/axios";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // FETCH EMPLOYEES
  const fetchEmployees = useCallback(async () => {
    try {
      const url = selectedDept? `/employees?department=${selectedDept}`: "/employees";
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [selectedDept]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // FILTER
  const filtered = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.position}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid px-3 py-3">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Employees</h3>
          <p className="text-secondary mb-0">Manage your team members</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary d-flex align-items-center gap-2">
          <span className="bi bi-plus-lg"></span>
          Add Employee
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>
        </div>

        <div className="col-12 col-md-4">
          <select value={selectedDept} className="form-select" onChange={(e) => setSelectedDept(e.target.value)}>
            <option value="">All Departments</option>

            {DEPARTMENTS.map((deptName) => (
              <option key={deptName} value={deptName}>
                {deptName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* EMPLOYEES */}
      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-secondary fw-semibold">No Employees Found</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((emp) => (
            <div className="col-12 col-sm-6 col-lg-4" key={emp.id}>
              <EmployeeCard
                employee={emp}
                onDelete={fetchEmployees}
                onEdit={(e) => setEditEmployee(e)}
              />
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <>
          <div
            className="modal fade show d-block"
            onClick={() => setShowCreateModal(false)}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div
                className="modal-content border-0 shadow"
                onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h5 className="modal-title">Add New Employee</h5>
                    <p className="text-secondary small mb-0">
                      Create employee profile
                    </p>
                  </div>

                  <button className="btn-close" onClick={() => setShowCreateModal(false)}></button></div>

                <div className="modal-body">
                  <EmployeeForm
                    onSuccess={() => {
                      setShowCreateModal(false);
                      fetchEmployees();
                    }}
                    onCancel={() => setShowCreateModal(false)}/>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* EDIT MODAL */}
      {editEmployee && (
        <>
          <div className="modal fade show d-block" onClick={() => setEditEmployee(null)}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h5 className="modal-title">Edit Employee</h5>

                    <p className="text-secondary small mb-0">
                      Update employee details
                    </p>
                  </div>

                  <button className="btn-close" onClick={() => setEditEmployee(null)}></button>
                </div>

                <div className="modal-body">
                  <EmployeeForm initialData={editEmployee} onSuccess={() => {setEditEmployee(null); fetchEmployees(); }} onCancel={() => setEditEmployee(null)}/>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
