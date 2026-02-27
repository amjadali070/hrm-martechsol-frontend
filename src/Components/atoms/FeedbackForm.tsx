import React, { useState } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import { FaPaperPlane, FaPen, FaCommentDots } from "react-icons/fa";

const FeedbackForm: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});
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
      setTimeout(() => setSubmitSuccess(null), 3000); // Clear success message after 3 seconds
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
    <section className="w-full">
      <div className="flex flex-col w-full bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden">
        {/* Header */}
        <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200">
           <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
                  <FaCommentDots className="text-gunmetal-600 text-xl" />
              </div>
              <div>
                  <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Submit Feedback
                  </h2>
                  <p className="text-sm text-slate-grey-500">
                    We value your input. Let us know how we can improve.
                  </p>
              </div>
           </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Subject Input */}
                <div className="flex flex-col group">
                    <label
                    htmlFor="subject"
                    className="text-sm font-bold text-gunmetal-700 mb-2 flex items-center gap-2"
                    >
                     <FaPen className="text-slate-grey-400 text-xs" /> Subject
                    </label>
                    <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full px-4 py-3 bg-white border ${
                        errors.subject ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-platinum-200 focus:border-gunmetal-500 focus:ring-gunmetal-500/20"
                    } rounded-lg text-sm text-gunmetal-900 placeholder:text-slate-grey-400 focus:outline-none focus:ring-4 transition-all`}
                    placeholder="Briefly describe your feedback..."
                    />
                    {errors.subject && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-600 animate-in slide-in-from-left-1">{errors.subject}</p>
                    )}
                </div>

                {/* Message Input (Quill) */}
                <div className="flex flex-col">
                    <label
                    htmlFor="message"
                    className="text-sm font-bold text-gunmetal-700 mb-2"
                    >
                    Message
                    </label>
                    <div className={`rounded-lg overflow-hidden border ${errors.message ? 'border-rose-500' : 'border-platinum-200'} focus-within:ring-4 focus-within:ring-gunmetal-500/20 focus-within:border-gunmetal-500 transition-all`}>
                        <ReactQuill
                        value={message}
                        onChange={setMessage}
                        modules={modules}
                        formats={formats}
                        placeholder="Share your detailed thoughts here..."
                        theme="snow"
                        className="bg-white h-[200px] sm:h-[250px] [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-alabaster-grey-50 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-platinum-200 [&_.ql-container]:border-none [&_.ql-editor]:text-gunmetal-800 [&_.ql-editor]:text-sm [&_.ql-editor]:font-sans"
                        />
                    </div>
                    {errors.message && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-600 animate-in slide-in-from-left-1">{errors.message}</p>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-platinum-200">
                    <div className="w-full sm:w-auto">
                         {submitSuccess === true && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Feedback submitted successfully!
                            </div>
                        )}
                        {submitSuccess === false && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-rose-600 bg-rose-50 px-4 py-2 rounded-lg border border-rose-100 animate-in fade-in slide-in-from-bottom-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                Failed to submit. Please try again.
                            </div>
                        )}
                    </div>
                    
                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center gap-2 px-8 py-3 bg-gunmetal-900 text-white text-sm font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20 hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-full sm:w-auto`}
                    >
                    {isSubmitting ? (
                        <>Sending...</>
                    ) : (
                        <>
                        <FaPaperPlane className="text-xs" /> Submit Feedback
                        </>
                    )}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
