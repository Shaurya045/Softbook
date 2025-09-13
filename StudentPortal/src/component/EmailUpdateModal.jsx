import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const EmailUpdateModal = ({ isOpen, onClose }) => {
  const { backendURL, studentAuthData, token, loadStudentData } =
    useContext(Context);
  const [newEmail, setNewEmail] = useState(studentAuthData?.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase();
    setNewEmail(value);
    setError(validateEmail(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValidation = validateEmail(newEmail);
    if (emailValidation) {
      setError(emailValidation);
      return;
    }

    if (newEmail === studentAuthData?.email) {
      setError("New email must be different from current email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${backendURL}studentauth/update-email`,
        { newEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await loadStudentData();
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000cc] flex items-center justify-center z-50">
      <div className="bg-[#1F2937] p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Update Email</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {studentAuthData?.email && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Email
              </label>
              <input
                type="email"
                value={studentAuthData?.email || ""}
                disabled
                className="w-full p-3 bg-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={handleEmailChange}
              className={`w-full p-3 bg-[#374151] rounded-lg text-white ${
                error ? "border border-red-500" : ""
              }`}
              placeholder="Enter new email address"
              required
            />
            {error && (
              <span className="text-red-500 text-xs mt-1">{error}</span>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            {/* <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              disabled={isLoading || !!error}
              className="flex-1 px-4 py-2 bg-[#477CBF] text-white rounded-lg hover:bg-[#252d7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailUpdateModal;
