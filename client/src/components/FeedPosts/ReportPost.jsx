import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const ReportPost = ({ postId, reportedBy }) => {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleReport = async () => {
    if (!reason.trim()) {
      setMessage("Please provide a reason for reporting.");
      return;
    }
    try {
      await addDoc(collection(firestore, "reports"), {
        postId,
        reportedBy,
        reason,
        timestamp: serverTimestamp(),
      });
      setMessage("Report submitted successfully!");
      setReason(""); 
    } catch (error) {
      console.error("Error reporting post:", error);
      setMessage("Failed to submit report. Please try again.");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", maxWidth: "400px" }}>
      <h3>Report Post</h3>
      <textarea
        placeholder="Enter reason for reporting..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{ width: "100%", minHeight: "80px", padding: "10px" }}
      />
      <button onClick={handleReport} style={{ marginTop: "10px" }}>
        Submit Report
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ReportPost;
