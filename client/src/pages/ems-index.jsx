import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginLanding from "./login-landing";
import Layout from "./layout";
import Dashboard from "./dashboard";
import Attendance from "./attendance";
import Employees from "./employees";
import Leave from "./leave";
import Payslips from "./payslips";
import PrintPayslip from "./print-payslip";
import Settings from "./settings";
import LoginLeftSide from "../components/login-left-side";
import AdminLogin from "../components/admin-login";
import EmployeeLogin from "../components/employee-login";
// import LoginForm from "../components/login-form";

export default function EmsIndex() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginLanding/>}/>
        <Route path="/login/admin" element={<AdminLogin role="admin" title="Admin Portal" subtitle="Sign in to manage the organization"/>}/>
        
        <Route path="/login/employee" element={<EmployeeLogin role="employee" title="Employee Portal" subtitle="Sign in to access your account"/>}/>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<Leave />} />
          <Route path="payslips" element={<Payslips />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/print/payslips/:id" element={<PrintPayslip />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
