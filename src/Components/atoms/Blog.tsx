import React from 'react';
import { MdDateRange } from 'react-icons/md';

interface BlogProps {
  image: string;
  title: string;
  paragraph: string;
  publishedDate: string;
  link: string;
}

const Blog: React.FC<BlogProps> = ({ image, title, paragraph, publishedDate, link }) => {
  return (
    <div className="flex flex-col sm:flex-row bg-gray-100 rounded-lg overflow-hidden border border-gray-300 mb-4">
      <div className="sm:w-1/4 flex-shrink-0">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={image}
            alt={title}
            className="w-auto h-auto object-cover"
          />
        </a>
      </div>

      <div className="sm:w-3/4 p-2 flex flex-col justify-center ml-8">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold text-blue-600 mb-6 hover:text-blue-500 hover:underline transition-colors duration-200"
        >
          {title}
        </a>
        <p className="text-gray-700 text-sm sm:text-base mb-6"><span className='font-semibold'>Description:</span> {paragraph}</p>
        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
          <MdDateRange className="mr-2 text-gray-400" />
          <p>Published {publishedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Blog;