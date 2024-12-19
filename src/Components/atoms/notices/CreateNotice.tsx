import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

interface Notice {
  _id?: string;
  date: string;
  subject: string;
  status: "Read" | "Unread";
  paragraph: string;
}

const CreateNotice: React.FC = () => {
  const [notice, setNotice] = useState<Notice>({
    date: new Date().toISOString().split("T")[0],
    subject: "",
    status: "Unread",
    paragraph: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${backendUrl}/api/notices`,
        {
          subject: notice.subject,
          paragraph: notice.paragraph,
          date: notice.date,
        },
        { withCredentials: true }
      );
      toast.success("Notice created successfully");
      navigate("/organization/notice-management");
    } catch (err) {
      setError("Failed to create notice");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create New Notice</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Subject</label>
          <input
            type="text"
            value={notice.subject}
            onChange={(e) => setNotice({ ...notice, subject: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Message</label>
          <ReactQuill
            theme="snow"
            value={notice.paragraph}
            onChange={(content: string) =>
              setNotice({ ...notice, paragraph: content })
            }
            className="h-40"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "list",
              "bullet",
              "link",
              "image",
            ]}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-14">
          <button
            type="button"
            onClick={() => navigate("/organization/notice-management")}
            className="px-4 py-2 bg-gray-200 rounded-full"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
          >
            Preview
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Create"}
          </button>
        </div>
      </form>

      {previewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[45%] overflow-auto max-h-full">
            <h2 className="text-xl font-bold mb-4">Preview Notice</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{notice.subject}</h3>
              <p className="text-sm text-gray-500">
                Date: {new Date(notice.date).toLocaleDateString()}
              </p>
            </div>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: notice.paragraph }}
            ></div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setPreviewMode(false)}
                className="px-4 py-2 bg-gray-200 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNotice;
