// import { Link, useNavigate } from "react-router-dom";
// import LoginLeftSide from "./login-left-side";
// import { useState } from "react";
// import { useAuth } from "../context/auth-context";
// import toast from "react-hot-toast";

// export default function LoginForm({ role, title, subtitle }) {

//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       setError("");
//       await login(email, password, role);

//       toast.success("Login Successful");

//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.error || "Login Failed");

//       toast.error(err.response?.data?.error || "Login Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-vh-100 d-flex">
//       <LoginLeftSide />

//       <div className="flex-grow-1 d-flex justify-content-center align-items-center bg-white">
//         <div className="border rounded p-4 shadow" style={{ width: "400px" }}>
//           <Link to="/login" className="btn btn-link text-decoration-none mb-3">
//             ← Back to portals
//           </Link>

//           <div className="mb-4">
//             <h2 className="fw-bold">{title}</h2>
//             <p className="text-secondary">{subtitle}</p>
//           </div>

//           {error && <div className="alert alert-danger">{error}</div>}

//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label">Email Address</label>

//               <input
//                 type="email"
//                 className="form-control"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="john@example.com"
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Password</label>

//               <div className="input-group">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="form-control"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   placeholder="Enter password"
//                 />

//                 <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}> {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//             </div>

//             <button type="submit" disabled={loading} className="btn btn-primary w-100">
//               {loading ? "Signing In..." : "Sign In"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
