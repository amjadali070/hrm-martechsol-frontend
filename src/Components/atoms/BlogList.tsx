import React from "react";
import { Link } from "react-router-dom";
import { useBlogContext } from "../organisms/BlogContext";
import Blog from "./Blog";
import { FaPlus, FaNewspaper } from "react-icons/fa";

const BlogList: React.FC = () => {
  const { blogs } = useBlogContext();

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 mb-8 overflow-hidden">
        {/* Header */}
       <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
            <FaNewspaper className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Company Blog
            </h2>
            <p className="text-sm text-slate-grey-500">
               Latest updates, news, and articles from MartechSol.
            </p>
          </div>
        </div>
        
        <Link
            to="/create-blog"
            className="flex items-center gap-2 px-5 py-2.5 bg-gunmetal-900 text-white text-sm font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20"
        >
            <FaPlus size={12} /> Create New Post
        </Link>
      </div>

       <div className="p-8 bg-alabaster-grey-50/30">
        <div className="space-y-6 max-w-5xl mx-auto">
          {blogs.map((blog) => (
              <Blog
                key={blog.id}
                id={blog.id}
                image={blog.image}
                title={blog.title}
                paragraph={blog.paragraph}
                publishedDate={blog.publishedDate}
                link={`/blog/${blog.id}`}
              />
          ))}
          {blogs.length === 0 && (
             <div className="text-center py-20 bg-white rounded-xl border border-platinum-200 border-dashed">
                 <FaNewspaper className="mx-auto text-4xl text-platinum-300 mb-4" />
                 <h3 className="text-lg font-bold text-gunmetal-900">No blog posts found</h3>
                 <p className="text-slate-grey-500 text-sm mt-1">Be the first to publish an article!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
