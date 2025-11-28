export default function JobCard({ job, onClick }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        width: "200px",
        cursor: "pointer",
      }}
      onClick={() => onClick(job)}
    >
      <h3>Job ID: {job.generated_job_id || job.uuid}</h3>
      <p>Status: {job.status}</p>
      <p>Date: {job.date}</p>
    </div>
  );
}
