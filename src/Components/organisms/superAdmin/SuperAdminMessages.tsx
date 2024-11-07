// frontend/src/components/superAdmin/SuperAdminMessages.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MessageTable from '../../atoms/MessageTable';
import WriteMessageModal from '../../atoms/MessageModal';
import ViewMessageModal from '../../atoms/ViewMessageModal';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/superadmin/messages`, { withCredentials: true });
        setMessages(response.data);
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch messages.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/messages/unread-count`, { withCredentials: true });
        setUnreadCount(response.data.unreadCount);
      } catch (error: any) {
        console.error(error.response?.data?.message || 'Failed to fetch unread messages count.');
      }
    };

    fetchAllMessages();
    fetchUnreadCount();
  }, [backendUrl]);

  const handleReply = (messageId: string, replyMessage: string, replyFile: File | null) => {
    onReply(messageId, replyMessage, replyFile);
  };

  const onReply = (messageId: string, replyMessage: string, replyFile: File | null) => {
    setSelectedMessageId(messageId);
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async (replyMessage: string, replyFile: File | null) => {
    try {
      if (!selectedMessageId) {
        toast.error('No message selected for reply.');
        return;
      }

      const originalMessage = messages.find(msg => msg._id === selectedMessageId);
      if (!originalMessage) {
        toast.error('Original message not found.');
        return;
      }

      const formData = new FormData();
      formData.append('receiverId', originalMessage.sender._id);
      formData.append('message', replyMessage);
      if (originalMessage.project?._id) formData.append('projectId', originalMessage.project._id);
      if (replyFile) formData.append('file', replyFile);

      const response = await axios.post(`${backendUrl}/api/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // Update messages state with the new reply
      setMessages([response.data, ...messages]);
      setUnreadCount(unreadCount + 1);
      toast.success('Reply sent successfully.');
      setIsReplyModalOpen(false);
      setSelectedMessageId(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to send reply.';
      console.error('Error sending reply:', errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleMessageTitleClick = (message: Message) => {
    setSelectedMessage(message);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedMessage(null);
  };

  if (loading) return <div className="text-center text-gray-500">Loading messages...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">All Messages ({unreadCount} Unread)</h2>
      <MessageTable
        messages={messages}
        onReply={handleReply}
        backendUrl={backendUrl}
      />

      {/* Reply Modal */}
      {isReplyModalOpen && selectedMessageId && (
        <WriteMessageModal
          onClose={() => setIsReplyModalOpen(false)}
          onSend={handleSendReply}
        />
      )}

      {/* View Message Modal */}
      {isViewModalOpen && selectedMessage && (
        <ViewMessageModal
          message={selectedMessage}
          onClose={handleCloseViewModal}
          backendUrl={backendUrl}
        />
      )}
    </div>
  );
};

export default SuperAdminMessages;