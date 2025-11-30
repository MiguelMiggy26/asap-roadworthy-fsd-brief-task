"use client";
import { useEffect, useState } from "react";
import CompanyCard from "@/app/components/CompanyCard";
import JobCard from "@/app/components/JobCard";
import JobModal from "@/app/components/JobModal";
import { getCompanies, getJobs } from "@/app/lib/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    if (!storedUser || !token) {
      window.location.href = "/";
      return;
    }

    setUser(storedUser);

    getCompanies(storedUser.uuid, token)
      .then((data) => setCompanies(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchJobs = async (companyUuid) => {
    setLoadingJobs(true);
    try {
      const data = await getJobs(companyUuid, token);
      setJobs(data);

      if (selectedJob) {
        const updatedJob = data.find((j) => j.uuid === selectedJob.uuid);
        if (updatedJob) setSelectedJob(updatedJob);
      }
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleMessageAdded = () => {
    if (selectedCompany) {
      fetchJobs(selectedCompany.uuid); 
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    fetchJobs(company.uuid);
  };

  if (!user) return <div>Loading user...</div>;
  if (loading) return <div>Loading companies...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}</p>

      {!selectedCompany && (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {companies.map((company) => (
            <CompanyCard
              key={company.uuid}
              company={company}
              onClick={handleCompanyClick}
            />
          ))}
        </div>
      )}

      {selectedCompany && (
        <div>
          <button onClick={() => setSelectedCompany(null)}>Back</button>
          <h2>Ongoing Work Order</h2>
          {loadingJobs && <div>Loading jobs...</div>}
          {!loadingJobs && jobs.length === 0 && <div>No jobs found</div>}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {jobs.map((job) => (
              <JobCard key={job.uuid} job={job} onClick={setSelectedJob} />
            ))}
          </div>
        </div>
      )}

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onMessageAdded={handleMessageAdded}
        />
      )}
    </div>
  );
}
