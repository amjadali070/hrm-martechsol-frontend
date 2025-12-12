// src/components/pages/CreateBlog.tsx
import React, { useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
// import { useBlogContext } from "../organisms/BlogContext";
import { useNavigate } from "react-router-dom";
import { FaPenNib, FaArrowLeft, FaHeading, FaImage, FaAlignLeft, FaSpinner } from "react-icons/fa";

const CreateBlog: React.FC = () => {
  //   const { fetchBlogs } = useBlogContext(); // So we can refetch upon success
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  // Local state to handle form inputs
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // If you want to handle a publication date manually, add a publishedDate field.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 mb-8 overflow-hidden">
        {/* Header */}
       <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
            <FaPenNib className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Create New Blog
            </h2>
            <p className="text-sm text-slate-grey-500">
               Share your thoughts with the team.
            </p>
          </div>
        </div>
        
        <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-platinum-200 text-gunmetal-700 text-sm font-bold rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm"
        >
            <FaArrowLeft size={12} /> Back to Blogs
        </button>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                 <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2">
                    <FaHeading className="text-gunmetal-400" /> Title
                 </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-platinum-200 rounded-lg text-gunmetal-900 placeholder:text-slate-grey-400 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all font-medium text-lg"
                    placeholder="Enter an engaging title..."
                    required
                />
            </div>

            <div className="space-y-2">
                 <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2">
                    <FaAlignLeft className="text-gunmetal-400" /> Content
                 </label>
                <div className="relative">
                    <textarea
                        value={paragraph}
                        onChange={(e) => setParagraph(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-platinum-200 rounded-lg text-gunmetal-900 placeholder:text-slate-grey-400 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all min-h-[200px] resize-y"
                        placeholder="Write your article content here..."
                        required
                    />
                     <div className="absolute bottom-3 right-3 text-xs text-slate-grey-400 font-medium bg-white/80 px-2 py-1 rounded">
                        {paragraph.length} chars
                     </div>
                </div>
            </div>

            <div className="space-y-2">
                 <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2">
                    <FaImage className="text-gunmetal-400" /> Featured Image
                 </label>
                 <div className="border-2 border-dashed border-platinum-300 rounded-xl p-8 text-center hover:bg-alabaster-grey-50 transition-colors relative">
                    <input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                            setBlogImage(e.target.files[0]);
                            }
                        }}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                    />
                    <div className="pointer-events-none">
                        {blogImage ? (
                             <div className="flex flex-col items-center">
                                <span className="text-gunmetal-900 font-bold mb-1">{blogImage.name}</span>
                                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Image Selected</span>
                             </div>
                        ) : (
                            <div className="flex flex-col items-center text-slate-grey-500">
                                <FaImage className="text-4xl mb-3 text-platinum-400" />
                                <span className="text-sm font-medium">Click to upload cover image</span>
                                <span className="text-xs mt-1 text-slate-grey-400">JPG, PNG up to 5MB</span>
                            </div>
                        )}
                    </div>
                 </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                        px-8 py-3 bg-gunmetal-900 text-white rounded-lg font-bold text-sm shadow-lg shadow-gunmetal-500/20 hover:bg-gunmetal-800 transition-all flex items-center gap-2
                        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                    `}
                >
                    {isLoading ? (
                        <>
                        <FaSpinner className="animate-spin" /> Publishing...
                        </>
                    ) : (
                        "Publish Post"
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
