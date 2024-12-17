import React, { useState, useEffect } from "react";
import AddEmployeeForm from "./components/AddEmployeeForm";

const App = () => {
  const [apiUrl, setApiUrl] = useState("");

  // Fetch the API URL from environment variable (or fallback to default)
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8082";
    setApiUrl(apiUrl);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <AddEmployeeForm apiUrl={apiUrl} />
    </div>
  );
};

export default App;
