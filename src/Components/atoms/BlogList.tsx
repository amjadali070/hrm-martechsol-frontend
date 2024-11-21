import React from 'react';
import { Link } from 'react-router-dom';
import { FaBlogger } from 'react-icons/fa';
import Blog from './Blog';
import blogThumbnail from '../../assets/blog/blogThumbnail.png';

interface BlogData {
  id: number;
  image: string;
  title: string;
  paragraph: string;
  publishedDate: string;
}

const BlogList: React.FC = () => {
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
      title: 'The Role of Digital Transformation in Modern Business Growth',
      paragraph: 'Explore how digital transformation can accelerate growth and keep businesses competitive.',
      publishedDate: '12 days ago',
    },
    {
      id: 3,
      image: blogThumbnail,
      title: 'Sustainable Business Practices: The Need for Change',
      paragraph: 'Learn why sustainability is no longer optional but essential for businesses to thrive in the modern world.',
      publishedDate: '20 days ago',
    },
    {
      id: 4,
      image: blogThumbnail,
      title: 'AI in Marketing: The Future is Now',
      paragraph: 'Dive into the transformative potential of AI in revolutionizing marketing strategies.',
      publishedDate: '1 month ago',
    },
  ];

  return (
    <div className="w-full bg-gray-50 py-4 pb-10">
      <div className="mx-auto px-6 mt-6">
        <div className="flex items-center justify-center mb-10">
          <FaBlogger className="text-purple-700 text-3xl mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">MartechSol Blogs</h1>
        </div>
        <div className="space-y-6">
          {blogData.map((blog) => (
            <Link to={`/blog/${blog.id}`} key={blog.id}>
              <Blog
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