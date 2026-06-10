export default function LoginLeftSide() {
  return (
    <div
      className="d-flex text-white fw-bold h-100 min-vh-100"
      style={{
        backgroundImage:
        "linear-gradient(rgba(4, 6, 43, 0.95), rgba(18, 23, 117, 0.95), rgba(3, 5, 48, 0.95))",
      }}>
      <div className="d-flex justify-content-center flex-column p-4 p-md-5 w-100">
        <h1 className="fw-bold mb-4" style={{ fontSize: "37px" }}> Employee <br />Management System</h1>

        <p className="fw-light mb-0" style={{maxWidth: "500px", fontSize: "16px",}}>Streamline your workforce operations, track attendance, manage payroll and empower your team securely.</p>
      </div>
    </div>
  );
}
