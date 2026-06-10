import { format } from "date-fns";

export default function PayslipList({ payslips, isAdmin }) {
  return (
    <div className="mt-5">
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle text-center">
          {/* ✅ HEADER */}
          <thead className="table-secondary">
            <tr className="text-secondary">
              {isAdmin && <th className="text-nowrap py-3">Employee</th>}
              <th className="text-nowrap py-3">Period</th>
              <th className="text-nowrap py-3">Basic Salary</th>
              <th className="text-nowrap py-3">Net Salary</th>
              <th className="text-nowrap py-3">Actions</th>
            </tr>
          </thead>

          {/* ✅ BODY */}
          <tbody style={{fontSize:'15px'}}>
            {payslips.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="text-muted py-3">
                  No payslips found
                </td>
              </tr>
            ) : (
              payslips.map((payslip) => (
                <tr key={payslip._id || payslip.id}>
                  {/* Employee */}
                  {isAdmin && (
                    <td className="fw-semibold text-nowrap">
                      {payslip.employee?.firstName} {payslip.employee?.lastName}
                    </td>
                  )}

                  {/* Period */}
                  <td className="text-secondary py-3 fw-semibold text-nowrap">
                    {format(
                      new Date(payslip.year, payslip.month - 1),
                      "MMMM yyyy",
                    )}
                  </td>

                  {/* Basic */}
                  <td className="text-nowrap">
                    ₹{payslip.basicSalary?.toLocaleString()}
                  </td>

                  {/* Net */}
                  <td className="fw-semibold text-success text-nowrap">
                    ₹{payslip.netSalary?.toLocaleString()}
                  </td>

                  {/* Action */}
                  <td className="text-nowrap">
                    <button onClick={() => window.open(`/print/payslips/${payslip._id || payslip.id}`, )}className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 mx-auto">
                      <span className="bi bi-download"></span><span className="d-none d-sm-inline">Download</span></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
