import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { useAuth } from "../context/auth-context";
import Loading from "../components/loading";

export default function Layout() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) {return <Navigate to="/login" replace />;}

  return (
    <div className="bg-light min-vh-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-layout">
        <div className="container-fluid py-3 py-md-4 px-3 px-md-4">
          <Outlet />
        </div>
      </main>

      <style>
        {`
          .main-layout {
            width: 100%;
            min-height: 100vh;
            overflow-x: hidden;
            transition: all 0.3s ease;
          }

          /* Desktop */
          @media (min-width: 768px) {
            .main-layout {
              margin-left: 280px;
              width: calc(100% - 280px);
            }
          }

          /* Mobile */
          @media (max-width: 767px) {
            .main-layout {
              margin-left: 0;
              width: 100%;
              padding-top: 70px;
            }
          }
        `}
      </style>
    </div>
  );
}
