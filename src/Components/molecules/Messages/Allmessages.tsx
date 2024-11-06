// frontend/src/atoms/AllMessages.tsx

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../organisms/AuthContext';
import MessageTable from '../../atoms/Message';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
  project?: {
    _id: string;
    projectName: string;
  };
  message: string;
  file: string;
  read: boolean;
  createdAt: string;
}

const AllMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const { user } = useContext(AuthContext);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (user?.role === 'superAdmin') {
          // Fetch all messages for Super Admin
          const response = await axios.get(`${backendUrl}/api/superadmin/messages`, { withCredentials: true });
          setMessages(response.data);
        } else {
          // Fetch messages for Normal User
          const response = await axios.get(`${backendUrl}/api/messages`, { withCredentials: true });
          setMessages(response.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch messages.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        if (user?.role === 'superAdmin') {
          // For Super Admins, calculate unread messages if necessary
          // You might need to adjust the backend to provide this
          const response = await axios.get(`${backendUrl}/api/messages/unread-count`, { withCredentials: true });
          setUnreadCount(response.data.unreadCount);
        } else {
          // For Normal Users
          const response = await axios.get(`${backendUrl}/api/messages/unread-count`, { withCredentials: true });
          setUnreadCount(response.data.unreadCount);
        }
      } catch (err: any) {
        console.error(err.response?.data?.message || 'Failed to fetch unread messages count.');
      }
    };

    fetchMessages();
    fetchUnreadCount();
  }, [user?.role]);

  const handleProjectTitleClick = (projectId: string) => {
    // Implement navigation to the project details page
    // For example, using React Router:
    // history.push(`/projects/${projectId}`);
    console.log('Project Title Clicked:', projectId);
  };

  const handleReply = async (messageId: string, replyMessage: string, replyFile: File | null) => {
    try {
      const formData = new FormData();
      // For Super Admin, the receiver is the sender of the original message
      const originalMessage = messages.find(msg => msg._id === messageId);
      if (!originalMessage) {
        alert('Original message not found.');
        return;
      }

      formData.append('receiverId', originalMessage.sender._id);
      formData.append('message', replyMessage);
      // Optionally append projectId if replying within a project context
      if (originalMessage.project) {
        formData.append('projectId', originalMessage.project._id);
      }
      if (replyFile) formData.append('file', replyFile);

      const response = await axios.post(`${backendUrl}/api/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // Update messages state
      setMessages([response.data, ...messages]);
      setUnreadCount(unreadCount + 1);
      alert('Reply sent successfully.');
    } catch (error: any) {
      console.error('Error sending reply:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Failed to send reply.');
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden bg-white rounded-3xl">
      <div className="flex gap-3 flex-col">
        <div className="flex flex-col w-full mt-1">
          <h2 className="text-start mt-1 text-2xl font-medium text-zinc-800">
            All Messages ({unreadCount} Unread)
          </h2>
          <MessageTable messages={messages} onProjectTitleClick={handleProjectTitleClick} onReply={handleReply} />
        </div>
      </div>
    </div>
  );
};

export default AllMessages;