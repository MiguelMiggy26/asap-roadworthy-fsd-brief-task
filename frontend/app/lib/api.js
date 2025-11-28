// lib/api.js

// Login – receives a token from backend
export async function loginUser({ email, phone }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, phone }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }
  return res.json();
}

// Utility to attach Authorization header
function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : undefined,
  };
}

// Get companies
export async function getCompanies(uuid, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company?uuid=${uuid}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) throw new Error("Failed to fetch companies");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Get jobs
export async function getJobs(company_uuid, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job?company_uuid=${company_uuid}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) throw new Error("Failed to fetch jobs");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Get attachments
export async function getAttachments(jobUUID, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attachment?job_uuid=${jobUUID}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) throw new Error("Failed to fetch attachments");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Download attachment
export async function downloadAttachment(url, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) throw new Error("Failed to download file");

  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);

  const parts = url.split("/");
  link.download = parts[parts.length - 1];

  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function addMessage(jobUUID, sender_uid, text, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({ jobUUID, sender_uid, text }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to send message");
  }

  return res.json();
}

