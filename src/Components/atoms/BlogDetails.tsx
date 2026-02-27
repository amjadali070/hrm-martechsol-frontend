import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaThumbsUp, FaRegComment, FaArrowLeft, FaUserCircle, FaPaperPlane, FaCalendarAlt } from "react-icons/fa";
import { useBlogContext } from "../organisms/BlogContext";

interface CommentProps {
  id: number;
  author: string;
  content: string;
  likes: number;
}

const BlogDetails: React.FC = () => {
  const { blogs } = useBlogContext();
  const { blogId } = useParams<{ blogId: string }>();

  const blog = blogs.find((b) => b.id === Number(blogId));
  const recentBlogs = blogs.filter((b) => b.id !== Number(blogId)).slice(0, 3); // Limit recent blogs to 3

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<CommentProps[]>([]);

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (blog) {
      setLikes(blog.likes || 0);
      setComments(blog.comments || []);
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-platinum-200">
        <h2 className="text-2xl font-bold text-gunmetal-900 mb-2">Blog Post Not Found</h2>
        <Link to="/blog" className="text-blue-600 hover:underline font-medium">Return to Blog List</Link>
      </div>
    );
  }

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const comment: CommentProps = {
      id: comments.length + 1,
      author: "User", // Ideally curr user name
      content: newComment,
      likes: 0,
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="max-w-screen-xl mx-auto mb-8">
      {/* Back Button */}
      <div className="mb-6">
           <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-grey-500 hover:text-gunmetal-900 transition-colors">
               <FaArrowLeft size={12} /> Back to Blogs
           </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-3/4 space-y-8">
             <div className="bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden">
                <div className="relative h-64 md:h-96 w-full">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                         <div className="p-8 text-white w-full">
                              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight leading-tight shadow-black drop-shadow-md">
                                {blog.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                                <span className="flex items-center gap-1.5"><FaCalendarAlt /> {blog.publishedDate}</span>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="p-8">
                     <p className="text-slate-grey-600 text-lg leading-relaxed mb-8 border-l-4 border-gunmetal-900 pl-4 font-serif italic bg-alabaster-grey-50 py-2 rounded-r-lg">
                        {blog.paragraph}
                    </p>

                    {blog.content && (
                        <div className="space-y-6 text-gunmetal-900 leading-7">
                        {blog.content.map((content, index) =>
                            typeof content === "string" ? (
                            <p key={index} className="text-base text-slate-grey-800">
                                {content}
                            </p>
                            ) : (
                            <div key={index} className="my-6 rounded-xl overflow-hidden shadow-md">
                                <img
                                    src={content.src}
                                    alt={content.alt || "Blog Content"}
                                    className="w-full h-auto"
                                />
                            </div>
                            )
                        )}
                        </div>
                    )}
                    
                     <div className="flex items-center justify-between border-t border-platinum-200 pt-6 mt-10">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2 px-4 py-2 bg-alabaster-grey-50 border border-platinum-200 text-gunmetal-700 rounded-lg hover:bg-gunmetal-50 hover:border-gunmetal-300 transition-all font-semibold text-sm"
                            >
                                <FaThumbsUp className="text-emerald-600" />
                                {likes} Likes
                            </button>
                            <div className="flex items-center gap-2 px-4 py-2 text-slate-grey-500 text-sm font-medium">
                                <FaRegComment />
                                {comments.length} Comments
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-platinum-200 p-8">
                 <h2 className="text-xl font-bold text-gunmetal-900 mb-6 flex items-center gap-2">
                    <FaRegComment className="text-gunmetal-500" /> Discussion
                 </h2>
                 
                 <div className="mb-8">
                    <form onSubmit={handleCommentSubmit} className="relative">
                         <div className="flex gap-4">
                              <div className="pt-2">
                                  <div className="w-10 h-10 rounded-full bg-gunmetal-100 flex items-center justify-center text-gunmetal-600">
                                      <FaUserCircle size={24} />
                                  </div>
                              </div>
                             <div className="grow">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="w-full p-4 bg-alabaster-grey-50 border border-platinum-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all resize-none text-sm min-h-[100px]"
                                    placeholder="Share your thoughts..."
                                ></textarea>
                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-gunmetal-900 text-white rounded-lg hover:bg-gunmetal-800 transition-colors font-bold text-sm flex items-center gap-2"
                                    >
                                        <FaPaperPlane size={12} /> Post Comment
                                    </button>
                                </div>
                             </div>
                         </div>
                    </form>
                 </div>

                 <div className="space-y-6">
                    {comments.length === 0 ? (
                        <div className="text-center py-8 bg-alabaster-grey-50/50 rounded-xl border border-dashed border-platinum-200">
                             <p className="text-slate-grey-400 text-sm">No comments yet. Be the first to share your thoughts!</p>
                        </div>
                        ) : (
                        comments.map((comment) => (
                            <div
                            key={comment.id}
                            className="flex gap-4 p-4 border-b border-platinum-100 last:border-0 hover:bg-alabaster-grey-50/50 rounded-lg transition-colors"
                            >
                                <div className="shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-platinum-200 flex items-center justify-center text-slate-grey-500 font-bold text-xs uppercase">
                                        {comment.author.substring(0,2)}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gunmetal-900 text-sm">{comment.author}</span>
                                        <span className="text-xs text-slate-grey-400">• Just now</span>
                                    </div>
                                    <p className="text-slate-grey-700 text-sm leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
            </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-platinum-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gunmetal-900 mb-4 pb-3 border-b border-platinum-100">
              Recent Posts
            </h2>
            <div className="space-y-4">
              {recentBlogs.map((recentBlog) => (
                <Link
                  to={`/blog/${recentBlog.id}`}
                  key={recentBlog.id}
                  className="group flex gap-3 items-start"
                >
                  <div className="w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-platinum-100">
                      <img
                        src={recentBlog.image}
                        alt={recentBlog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                  </div>
                  <div className="grow">
                    <h3 className="text-sm font-bold text-gunmetal-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {recentBlog.title}
                    </h3>
                    <p className="text-xs text-slate-grey-400 mt-1">
                       {recentBlog.publishedDate}
                    </p>
                  </div>
                </Link>
              ))}
               {recentBlogs.length === 0 && <p className="text-sm text-slate-grey-400 italic">No other posts available.</p>}
            </div>
            
            <div className="mt-6 pt-4 border-t border-platinum-100">
                 <Link to="/blog" className="block w-full py-2 text-center text-sm font-bold text-gunmetal-600 hover:text-gunmetal-900 border border-platinum-200 hover:border-gunmetal-300 rounded-lg hover:bg-alabaster-grey-50 transition-all">
                     View All Posts
                 </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
