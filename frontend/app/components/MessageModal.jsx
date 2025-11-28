"use client";
import { useState } from "react";
import { addMessage } from "@/app/lib/api"; // we'll create this function

export default function MessageModal({ jobUUID, onClose, onMessageAdded }) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        const token = sessionStorage.getItem("token");
        const { uuid: sender_uid } = JSON.parse(sessionStorage.getItem("user"));

        setLoading(true);
        try {
            await addMessage(jobUUID, sender_uid, message, token);
            setMessage("");
            onMessageAdded?.();
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
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
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "2rem",
                    borderRadius: "8px",
                    maxWidth: "400px",
                    width: "90%",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Send Message</h3>
                <textarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
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
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: "#0070f3",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}
