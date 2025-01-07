// src/components/pages/CreateBlog.tsx
import React, { useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useBlogContext } from "../organisms/BlogContext";
import { useNavigate } from "react-router-dom";

const CreateBlog: React.FC = () => {
  //   const { fetchBlogs } = useBlogContext(); // So we can refetch upon success
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  // Local state to handle form inputs
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  // If you want to handle a publication date manually, add a publishedDate field.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create FormData for file + text fields
      const formData = new FormData();
      formData.append("title", title);
      formData.append("paragraph", paragraph);

      if (blogImage) {
        // The key here is 'blogImage' must match your controller's expectation
        formData.append("blogImage", blogImage);
      }

      // Make POST request to create the blog
      await axiosInstance.post(`${backendUrl}/api/blogs/post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // On success, refetch blog list
      //   await fetchBlogs();

      // Navigate back to the main blog list or detail page as needed
      navigate("/blog");
    } catch (error) {
      console.error("Error creating new blog:", error);
      // Optionally show a toast/notification
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter blog title"
          required
        />

        <label className="block mb-2 font-medium">Paragraph</label>
        <textarea
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={4}
          placeholder="Short description or paragraph..."
          required
        />

        <label className="block mb-2 font-medium">Upload Image</label>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setBlogImage(e.target.files[0]);
            }
          }}
          className="block mb-4"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors duration-200"
        >
          Submit Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
