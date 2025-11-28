"use client";
import { useEffect, useState } from "react";

export default function AuthenticatedRoute({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) window.location.href = '/';
    else setUser(storedUser);
  }, []);

  if (!user) return <div>Loading...</div>;

  return children;
}