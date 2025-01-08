import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaThumbsUp, FaRegComment } from "react-icons/fa";
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
  const recentBlogs = blogs.filter((b) => b.id !== Number(blogId));

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
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-2xl text-gray-600">Blog not found.</p>
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
      author: "User",
      content: newComment,
      likes: 0,
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4 bg-white rounded-lg p-6">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto object-cover rounded-lg mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {blog.title}
          </h1>

          <p className="text-gray-500 text-sm mb-4">{blog.publishedDate}</p>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4 mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <FaThumbsUp className="mr-2" />
                Like
              </button>
              <p className="text-gray-500">{likes} Likes</p>
            </div>
            <div className="flex items-center">
              <FaRegComment className="mr-2 text-gray-500" />
              <p className="text-gray-500">{comments.length} Comment(s)</p>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {blog.paragraph}
          </p>
          {blog.content && (
            <div className="mt-6 space-y-4">
              {blog.content.map((content, index) =>
                typeof content === "string" ? (
                  <p
                    key={index}
                    className="text-gray-700 text-base leading-relaxed"
                  >
                    {content}
                  </p>
                ) : (
                  <img
                    key={index}
                    src={content.src}
                    alt={content.alt || "Blog Content"}
                    className="w-full rounded-lg"
                  />
                )
              )}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Leave a Comment
            </h2>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
                placeholder="Write your comment here..."
              ></textarea>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition duration-200"
              >
                Submit Comment
              </button>
            </form>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
            {comments.length === 0 ? (
              <p className="text-gray-600">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="mb-6 border-b border-gray-200 pb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">
                      {comment.author}
                    </p>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition duration-200 mt-8 font-semibold"
          >
            Back to Blogs
          </Link>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Blogs
            </h2>
            <div className="space-y-4">
              {recentBlogs.map((recentBlog) => (
                <Link
                  to={`/blog/${recentBlog.id}`}
                  key={recentBlog.id}
                  className="flex items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition duration-200"
                >
                  <img
                    src={recentBlog.image}
                    alt={recentBlog.title}
                    className="w-16 h-16 rounded-md object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {recentBlog.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Published {recentBlog.publishedDate}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
