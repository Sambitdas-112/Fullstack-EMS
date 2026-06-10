export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight:'90vh'}}>
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "2rem", height: "2rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>

        <div className="mt-3 text-primary fw-semibold">Loading...</div>
      </div>
    </div>
  );
}
