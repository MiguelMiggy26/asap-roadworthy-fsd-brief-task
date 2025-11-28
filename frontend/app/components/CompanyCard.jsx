export default function CompanyCard({ company, onClick }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        width: "200px",
        cursor: "pointer",
      }}
      onClick={() => onClick(company)}
    >
      <h3>{company.name}</h3>
      <p>Active: {company.active ? "Yes" : "No"}</p>
    </div>
  );
}
