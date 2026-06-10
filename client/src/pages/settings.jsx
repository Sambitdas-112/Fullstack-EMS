import { useEffect, useState } from "react";
import { dummyProfileData } from "../assets/assets";
import Loading from "../components/loading";
import ProfileForm from "../components/profile-form";
import ChangePasswordModal from "../components/change-password-modal";
import { useAuth } from "../context/auth-context";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const {user} = useAuth()

  const fetchProfile = async () => {
    try{
      const res = await api.get("/profile")
      const profile = res.data;
      if(profile) setProfile(profile)
    }catch(err){
      toast.error(err?.response?.data?.error || err?.message)
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="container-fluid py-2 px-3">
      {/* Page Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Settings</h3>
        <p className="text-muted mb-0">
          Manage your profile and security preferences
        </p>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm rounded-4 h-100"
            style={{ overflow: "hidden" }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                  style={{ width: 55, height: 55 }}>
                  <i className="bi bi-person-fill fs-5"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-0">Profile Information</h5>
                  <small className="text-muted">
                    Update your personal details
                  </small>
                </div>
              </div>

              {profile && (
                <ProfileForm initialData={profile} onSuccess={fetchProfile} />
              )}
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center me-3"
                  style={{ width: 55, height: 55 }}>
                  <i className="bi bi-shield-lock-fill fs-5"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-0">Security</h5>
                  <small className="text-muted">Protect your account</small>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>

                <div className="input-group">
                  <span className="bi bi-lock-fill input-group-text bg-light"></span>

                  <input type="password" className="form-control" value="********" disabled readOnly/>
                </div>
              </div>

              <button className="btn btn-primary w-100 rounded-3" onClick={() => setShowPasswordModal(true)}><span className="bi bi-key-fill me-2"></span>Change Password</button>

              <hr className="my-4" />

              <div className="d-flex align-items-center">
                <span className="bi bi-shield-check text-success fs-5 me-3"></span>

                <div>
                  <div className="fw-semibold">Account Protected</div>

                  <small className="text-muted">
                    Your account security is active
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)}/>
    </div>
  );
}
