"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { loginUser } from "@/app/lib/api";

export default function LoginForm() {
  const [email, setEmail] = useState('maria@example.com');
  const [phone, setPhone] = useState('09179876543');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { user, token } = await loginUser({ email, phone });
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
