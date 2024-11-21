// BlogContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface Blog {
  id: number;
  image: string;
  title: string;
  paragraph: string;
  publishedDate: string;
}

interface BlogContextProps {
  blogs: Blog[];
}

const BlogContext = createContext<BlogContextProps | undefined>(undefined);

const blogData: Blog[] = [
  {
    id: 1,
    image: 'https://via.placeholder.com/300',
    title: 'Celebrating Iqbal: A Poetic Perspective on Effective Leadership',
    paragraph: 'Celebrating the Poet of the East – a visionary who truly inspired us to unlock our true potential.',
    publishedDate: '9 days ago',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/300',
    title: 'The Role of Digital Transformation in Modern Business Growth',
    paragraph: 'Explore how digital transformation can accelerate growth and keep businesses competitive.',
    publishedDate: '12 days ago',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/300',
    title: 'Sustainable Business Practices: The Need for Change',
    paragraph: 'Learn why sustainability is essential for businesses to thrive in the modern world.',
    publishedDate: '20 days ago',
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/300',
    title: 'AI in Marketing: The Future is Now',
    paragraph: 'Dive into the transformative potential of AI in revolutionizing marketing strategies.',
    publishedDate: '1 month ago',
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