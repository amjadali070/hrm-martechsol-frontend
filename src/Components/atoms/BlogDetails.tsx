import React from 'react';
import { useParams, Link } from 'react-router-dom';
import blogThumbnail from '../../assets/blog/blogThumbnail.png';
import blogContent from '../../assets/blog/blogThumbnail.png';

interface BlogData {
  id: number;
  image: string;
  title: string;
  paragraph: string;
  publishedDate: string;
}

const blogData: BlogData[] = [
  {
    id: 1,
    image: blogThumbnail,
    title: 'Celebrating Iqbal: A Poetic Perspective on Effective Leadership',
    paragraph: 'Celebrating the Poet of the East – a visionary who truly inspired us to...unlock our true potential.',
    publishedDate: '9 days ago',
  },
  {
    id: 2,
    image: blogThumbnail,
    title: 'Celebrating Iqbal: A Poetic Perspective on Effective Leadership',
    paragraph: 'Celebrating the Poet of the East – a visionary who truly inspired us to...unlock our true potential.',
    publishedDate: '9 days ago',
  },
  {
    id: 3,
    image: blogThumbnail,
    title: 'Celebrating Iqbal: A Poetic Perspective on Effective Leadership',
    paragraph: 'Celebrating the Poet of the East – a visionary who truly inspired us to...unlock our true potential.',
    publishedDate: '9 days ago',
  },
  {
    id: 4,
    image: blogThumbnail,
    title: 'Celebrating Iqbal: A Poetic Perspective on Effective Leadership',
    paragraph: 'Celebrating the Poet of the East – a visionary who truly inspired us to...unlock our true potential.',
    publishedDate: '9 days ago',
  },
];

const BlogDetails: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const blog = blogData.find((b) => b.id === Number(blogId));
  const recentBlogs = blogData.filter((b) => b.id !== Number(blogId));

  if (!blog) {
    return <div className="text-center text-gray-700">Blog not found.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row max-w-full mx-auto bg-white p-6 rounded-lg">
      <div className="w-full md:w-2/3 pr-6 mt-3">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-72 object-cover rounded-lg mb-6"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">{blog.paragraph}</p>
        <p className="text-gray-500 text-sm mb-6">
          <span className="font-semibold">Published:</span> {blog.publishedDate}
        </p>
        <Link
          to="/blog"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
        >
          Back to Blogs
        </Link>
      </div>

      <div className="w-full md:w-1/3 mt-6 md:mt-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Blogs</h2>
        <div className="space-y-4">
          {recentBlogs.map((recentBlog) => (
            <Link
              to={`/blog/${recentBlog.id}`}
              key={recentBlog.id}
              className="flex items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow-sm transition duration-200"
            >
              <img
                src={recentBlog.image}
                alt={recentBlog.title}
                className="w-16 h-16 rounded-md object-cover mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{recentBlog.title}</h3>
                <p className="text-gray-500 text-sm">Published {recentBlog.publishedDate}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;