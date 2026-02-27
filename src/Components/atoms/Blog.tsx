import React from 'react';
import { MdDateRange, MdArrowForward } from 'react-icons/md';
import { BlogProps } from '../../types/Blog';
import { Link } from 'react-router-dom';


const Blog: React.FC<BlogProps> = ({ id, image, title, paragraph, publishedDate, link }) => {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl border border-platinum-200 overflow-hidden shadow-sm hover:shadow-md transition-all group h-full md:h-64">
      {/* Image Section */}
      <div className="md:w-1/3 relative overflow-hidden bg-alabaster-grey-50">
        <Link to={link || "#"} className="block h-full w-full">
             <img
                src={image}
                alt={title}
                className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </Link>
      </div>

      {/* Content Section */}
      <div className="md:w-2/3 p-6 flex flex-col justify-between">
        <div>
            <div className="flex items-center gap-2 mb-3">
                 <span className="px-2 py-0.5 bg-gunmetal-50 text-gunmetal-600 text-[10px] font-bold uppercase tracking-wider rounded border border-gunmetal-100">Blog Post</span>
                 <div className="flex items-center text-slate-grey-400 text-xs font-medium">
                    <MdDateRange className="mr-1" />
                    <p>{publishedDate}</p>
                 </div>
            </div>
            
            <Link
            to={link || "#"}
            className="block text-xl font-bold text-gunmetal-900 mb-3 hover:text-gunmetal-600 transition-colors line-clamp-2"
            >
             {title}
            </Link>
            
            <p className="text-slate-grey-600 text-sm leading-relaxed line-clamp-3 mb-4">{paragraph}</p>
        </div>

        <div className="flex justify-end mt-4">
             <Link 
                to={link || "#"}
                className="text-sm font-bold text-gunmetal-900 hover:text-gunmetal-600 flex items-center gap-1 group/btn transition-colors"
             >
                Read Article <MdArrowForward className="group-hover/btn:translate-x-1 transition-transform" />
             </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;