interface CommentProps {
    id: number;
    author: string;
    content: string;
    likes: number;
  }
  
export interface BlogProps {
    id?: number;
    image: string;
    title: string;
    paragraph: string;
    publishedDate: string;
    content?: (string | { src: string; alt?: string })[];
    link?: string;
    likes?: number;
    comments?: CommentProps[];
  }