import React, { createContext, useContext, ReactNode } from 'react';
import { BlogProps } from '../../types/Blog';
import blogThumbnail from '../../assets/blog/blogThumbnail.png';
import blogContent from '../../assets/blog/blogContent.png';


interface BlogContextProps {
  blogs: BlogProps[];
}

const BlogContext = createContext<BlogContextProps | undefined>(undefined);

const blogData: BlogProps[] = [
  {
    id: 1,
    image: blogThumbnail,
    title: 'Celebrating Iqbal: A Poetic Perspective on Effective Leadership',
    paragraph: 'Learn the secrets of effective leadership through the vision of Iqbal.',
    publishedDate: '9 days ago',
    content: [{ src: blogContent }]
  },
  {
    id: 2,
    image: blogThumbnail,
    title: 'Celebrating Iqbal: A Poetic Perspective on Effective Leadership',
    paragraph: 'Learn the secrets of effective leadership through the vision of Iqbal.',
    publishedDate: '9 days ago',
    content: [{ src: blogContent }]
  },
  {
    id: 3,
    image: blogThumbnail,
    title: 'Celebrating Iqbal: A Poetic Perspective on Effective Leadership',
    paragraph: 'Learn the secrets of effective leadership through the vision of Iqbal.',
    publishedDate: '9 days ago',
    content: [{ src: blogContent }]
  },
  {
    id: 4,
    image: blogThumbnail,
    title: 'Celebrating Iqbal: A Poetic Perspective on Effective Leadership',
    paragraph: 'Learn the secrets of effective leadership through the vision of Iqbal.',
    publishedDate: '9 days ago',
    content: [{ src: blogContent }],
    likes: 10,
    comments: [ { id: 1, author: 'Amjad Ali', content: 'Great blog!', likes: 2 } ]
  },
];

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <BlogContext.Provider value={{ blogs: blogData }}>{children}</BlogContext.Provider>;
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};