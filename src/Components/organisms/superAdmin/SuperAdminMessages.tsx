// frontend/src/components/superAdmin/SuperAdminMessages.tsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MessageTable from '../../atoms/MessageTable';
import ViewMessageModal from '../../atoms/ViewMessageModal';
import { AuthContext } from '../../organisms/AuthContext';
import WriteMessageModal from '../../atoms/MessageModal';
import InputMessage from '../../atoms/InputMessage';

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
  const [currentTab, setCurrentTab] = useState<'received' | 'sent'>('received');

  const { user } = useContext(AuthContext); // Access the current user
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://default-backend-url.com';

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

  const handleReply = (messageId: string) => {
    onReply(messageId);
  };

  const onReply = (messageId: string) => {
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

  // const handleMessageTitleClick = (message: Message) => {
  //   setSelectedMessage(message);
  //   setIsViewModalOpen(true);
  // };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedMessage(null);
  };

  if (!user) {
    return <div className="text-center text-red-500">User not authenticated.</div>;
  }

  // // Filter messages based on currentTab and super admin's user ID
  // const filteredMessages = messages.filter(msg => 
  //   currentTab === 'sent' ? msg.sender._id === user._id : msg.receiver._id === user._id
  // );

  if (loading) return <div className="text-center text-gray-500">Loading messages...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">All Messages ({unreadCount} Unread)</h2>
      
      {/* Tabs for Sent and Received Messages */}
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 px-4 text-center rounded-t-lg ${
            currentTab === 'received' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setCurrentTab('received')}
        >
          Received Messages
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center rounded-t-lg ${
            currentTab === 'sent' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setCurrentTab('sent')}
        >
          Sent Messages
        </button>
      </div>

      {/* Message Table */}
      <MessageTable
        messages={messages}
        onReply={handleReply}
        backendUrl={backendUrl}
        messageType={currentTab}
        currentUserId={user._id}
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

      <InputMessage/>
    </div>
  );
};

export default SuperAdminMessages;