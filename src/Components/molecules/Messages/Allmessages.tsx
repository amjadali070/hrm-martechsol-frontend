// frontend/src/atoms/AllMessages.tsx

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../organisms/AuthContext';
import MessageTable from '../../atoms/MessageTable';
import WriteMessageModal from '../../atoms/MessageModal';


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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

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
        const response = await axios.get(`${backendUrl}/api/messages/unread-count`, { withCredentials: true });
        setUnreadCount(response.data.unreadCount);
      } catch (err: any) {
        console.error(err.response?.data?.message || 'Failed to fetch unread messages count.');
      }
    };

    fetchMessages();
    fetchUnreadCount();
  }, [backendUrl, user?.role]);

  const handleReply = (messageId: string) => {
    setSelectedMessageId(messageId);
    setIsModalOpen(true);
  };

  const handleSendReply = async (replyMessage: string, replyFile: File | null) => {
    try {
      const formData = new FormData();

      // Find the original message
      const originalMessage = messages.find(msg => msg._id === selectedMessageId);
      if (!originalMessage) {
        alert('Original message not found.');
        return;
      }

      formData.append('receiverId', originalMessage.sender._id);
      formData.append('message', replyMessage);
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
      setIsModalOpen(false);
      setSelectedMessageId(null);
    } catch (error: any) {
      console.error('Error sending reply:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Failed to send reply.');
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading messages...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">All Messages ({unreadCount} Unread)</h2>
      <MessageTable messages={messages} onReply={handleReply} />
      {isModalOpen && selectedMessageId && (
        <WriteMessageModal
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendReply}
        />
      )}
    </div>
  );
};

export default AllMessages;