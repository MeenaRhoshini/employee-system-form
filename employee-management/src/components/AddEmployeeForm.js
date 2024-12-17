import React, { useState } from "react";
import axios from "axios";

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    date_of_joining: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper function to reset form
  const resetForm = () => {
    setFormData({
      employee_id: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      date_of_joining: "",
      role: "",
    });
  };

  // Client-side validation
  const validateForm = () => {
    const { employee_id, name, email, phone, department, date_of_joining, role } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!employee_id || !name || !email || !phone || !department || !date_of_joining || !role) {
      setError("All fields are required.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }

    setLoading(true); // Set loading state

    try {
      const apiUrl = process.env.REACT_APP_API_URL; // Fetch the API URL from environment variable
      const response = await axios.post(
        `${apiUrl}/employee-management/add_employee.php`, // Use the apiUrl
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        resetForm();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
      console.error("Error: ", err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm(); // Call the submitForm function
  };

  return (
    <form
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4">Add Employee</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <input
        type="text"
        name="employee_id"
        placeholder="Employee ID"
        value={formData.employee_id}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <select
        name="department"
        value={formData.department}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      >
        <option value="">Select Department</option>
        <option value="HR">HR</option>
        <option value="Engineering">Engineering</option>
        <option value="Marketing">Marketing</option>
      </select>
      <input
        type="date"
        name="date_of_joining"
        value={formData.date_of_joining}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        max={new Date().toISOString().split("T")[0]}
        required
      />
      <input
        type="text"
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      <button
        type="reset"
        onClick={resetForm}
        className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
      >
        Reset
      </button>
    </form>
  );
};

export default AddEmployeeForm;
