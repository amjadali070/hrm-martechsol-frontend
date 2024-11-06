// frontend/src/components/superAdmin/SuperAdminMessages.tsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import InputMessage from '../../atoms/InputMessage';
import { toast } from 'react-toastify';
import { AuthContext } from '../AuthContext';
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

const SuperAdminMessages: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const response = await axios.get('/api/superadmin/messages', { withCredentials: true });
        setMessages(response.data);
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch messages.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMessages();
  }, []);

  const handleProjectTitleClick = (projectId: string) => {
    // Implement navigation to the project details page
    console.log('Project Title Clicked:', projectId);
  };

  const handleReply = async (messageId: string, replyMessage: string, replyFile: File | null) => {
    try {
      const message = messages.find(msg => msg._id === messageId);
      if (!message) {
        toast.error('Original message not found.');
        return;
      }

      const formData = new FormData();
      formData.append('receiverId', message.sender._id);
      formData.append('message', replyMessage);
      if (message.project?._id) formData.append('projectId', message.project._id);
      if (replyFile) formData.append('file', replyFile);

      const response = await axios.post('/api/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // Update messages state
      setMessages([response.data, ...messages]);
      toast.success('Reply sent successfully.');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to send reply.';
      console.error('Error sending reply:', errorMsg);
      toast.error(errorMsg);
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-5">
      <InputMessage />
      <MessageTable
        messages={messages}
        onProjectTitleClick={handleProjectTitleClick}
        onReply={handleReply}
      />
    </div>
  );
};

export default SuperAdminMessages;