import React from 'react';
import { Link } from 'react-router-dom';
import { useBlogContext } from '../context/BlogContext';
import Blog from './Blog';

const BlogList: React.FC = () => {
  const { blogs } = useBlogContext();

  return (
    <div className="w-full bg-gray-50 py-4 pb-10">
      <div className="mx-auto px-6 mt-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-10"><span className='text-purple-900'>MartechSol </span>Blogs</h1>
        <div className="space-y-6">
          {blogs.map((blog) => (
            <Link to={`/blog/${blog.id}`} key={blog.id}>
              <Blog
                id={blog.id}
                image={blog.image}
                title={blog.title}
                paragraph={blog.paragraph}
                publishedDate={blog.publishedDate}
                link={`/blog/${blog.id}`}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;