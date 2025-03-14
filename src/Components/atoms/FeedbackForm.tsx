import React, { useState } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

const FeedbackForm: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { subject?: string; message?: string } = {};
    if (!subject.trim()) newErrors.subject = "Subject is required.";
    if (!message.trim() || message === "<p><br></p>")
      newErrors.message = "Message is required.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await axios.post(
        `${backendUrl}/api/forms/`,
        {
          subject,
          message,
          formType: "feedback",
        },
        { withCredentials: true }
      );
      setSubmitSuccess(true);
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  return (
    <section className="flex flex-col w-full">
      <div className="flex flex-col p-8 w-full bg-white rounded-2xl">
        <h2 className="text-2xl font-bold text-purple-900 mb-6 text-left">
          Feedback Form
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`p-3 bg-white border ${
                errors.subject ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter subject"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <ReactQuill
              value={message}
              onChange={setMessage}
              modules={modules}
              formats={formats}
              placeholder="Enter your feedback"
              className={`rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              style={{ height: "200px" }}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <div className="flex justify-end mt-10">
            <button
              type="submit"
              className={`px-8 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {submitSuccess === true && (
            <p className="mt-4 text-sm text-green-600 text-center">
              Feedback submitted successfully!
            </p>
          )}
          {submitSuccess === false && (
            <p className="mt-4 text-sm text-red-600 text-center">
              Failed to submit feedback. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default FeedbackForm;
