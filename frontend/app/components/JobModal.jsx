"use client";
import { useEffect, useState } from "react";
import { getAttachments, downloadAttachment } from "@/app/lib/api";
import MessageModal from "@/app/components/MessageModal";

export default function JobModal({ job, onClose, onMessageAdded }) {
  const [attachments, setAttachments] = useState([]);
  const [loadingAttach, setLoadingAttach] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (!job) return;
    const token = sessionStorage.getItem("token");
    setLoadingAttach(true);

    getAttachments(job.uuid, token)
      .then(setAttachments)
      .catch(console.error)
      .finally(() => setLoadingAttach(false));
  }, [job]);

  if (!job) return null;

  const handleDownload = (url) => {
    const token = sessionStorage.getItem("token");
    downloadAttachment(url, token);
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Job ID: {job.generated_job_id || job.uuid}</h2>
          <p>Status: {job.status}</p>
          <p>Date: {job.date}</p>
          <p>Job Address: {job.job_address || "NA"}</p>
          <p>Billing Address: {job.billing_address || "NA"}</p>
          <p>Job Description: {job.job_description || "NA"}</p>

          {/* Messages */}
          <h4>Messages:</h4>
          {job?.messages?.length > 0 ? (
            job.messages.map((msg, idx) => (
              msg && (
                <div
                  key={idx}
                  style={{
                    marginBottom: "10px",
                    padding: "8px",
                    borderRadius: "6px",
                    backgroundColor: msg.isCompanyMessage ? "#e3f2fd" : "#f1f8e9",
                    border: "1px solid #ccc",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
                    {msg.isCompanyMessage ? "Company" : "You"}
                  </p>
                  <p style={{ margin: "0 0 4px 0" }}>{msg.text}</p>
                  <small style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </small>
                </div>
              )
            ))
          ) : (
            <p>No messages yet.</p>
          )}

          {/* Attachments */}
          <h4>Attachments:</h4>
          {loadingAttach && <p>Loading attachments...</p>}
          {!loadingAttach && attachments.length === 0 && <p>No attachments found.</p>}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {attachments.map((url, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${url}`}
                  alt={`attachment-${index}`}
                  style={{
                    width: "100px",
                    borderRadius: "6px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                    backgroundColor: "#fafafa",
                  }}
                  onError={(e) => (e.target.style.display = "none")}
                />
                <button
                  onClick={() => handleDownload(url)}
                  style={{
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "#fff",
                    backgroundColor: "#0070f3",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              onClick={onClose}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#ccc",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <button
              onClick={() => setShowMessageModal(true)}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#0070f3",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Add Message
            </button>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          jobUUID={job.uuid}
          onClose={() => setShowMessageModal(false)}
          onMessageAdded={onMessageAdded} 
        />
      )}
    </>
  );
}
