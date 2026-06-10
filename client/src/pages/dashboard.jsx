import { useEffect, useState } from "react";
import Loading from "../components/loading";
import EmployeeDashboard from "../components/employee-dashboard";
import AdminDashboard from "../components/admin-dashboard";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { set } from "date-fns";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        });
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;
  if (!data)
    return (
      <p className="text-gray text-center py-5">Failed to load dashboard</p>
    );

  if (data.role === "admin") {
    return <AdminDashboard data={data} />;
  } else {
    return <EmployeeDashboard data={data} />;
  }
}
