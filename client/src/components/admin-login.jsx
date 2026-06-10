import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import toast from "react-hot-toast";
import LoginLeftSide from "./login-left-side";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await login(data.email, data.password, "admin");

      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || "Login Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column flex-lg-row">
      {/* Left Side */}
      <LoginLeftSide />

      {/* Right Side */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center bg-light p-4">
        <div className="card border-0 rounded-4 w-100" style={{maxWidth: "380px", boxShadow: "0 10px 30px rgba(0,0,0,0.12)",}}>
          <div className="card-body p-4 ">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "55px",
                  height: "55px",
                  background: "linear-gradient(135deg,#0d6efd,#4f46e5)",
                }}>
                <span className="bi bi-shield-lock-fill text-white fs-5"></span>
              </div>

              <h3 className="fw-bold mb-1">Admin Login</h3>

              <p className="text-secondary mb-0">
                Sign in to manage the organization
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">
                  Email Address
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <span className="bi bi-envelope"></span>
                  </span>

                  <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`}placeholder="Enter your email"{...register("email", {required: "Email is required",pattern: {value: /^\S+@\S+$/i, message: "Invalid email address",},})}/>
                </div>

                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">
                  Password
                </label>

                <div className="input-group">
                  <span className="bi bi-lock input-group-text bg-white"></span>

                  <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} placeholder="Enter your password" {...register("password", {required: "Password is required", minLength: {value: 6,message: "Minimum 6 characters",},})}/></div>

                {errors.password && (
                  <small className="text-danger">
                    {errors.password.message}
                  </small>
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn w-100 text-white fw-semibold"
                style={{
                  background: "linear-gradient(135deg,#0d6efd,#4f46e5)",
                  border: "none",
                  height: "42px",
                }}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Back Button */}
              <Link to="/login" className="btn btn-light border w-100 mt-3">
                Back to Portals
              </Link>
            </form>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-muted">
                © {new Date().getFullYear()} Employee Management System
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
