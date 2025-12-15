// src/pages/FullNotificationsPage.tsx
import React, { useState, useEffect } from "react";
import {
  IoCheckmarkCircle,
  IoMailUnreadOutline,
  IoMailOpenOutline,
  IoFilterSharp,
  IoTimeOutline,
} from "react-icons/io5";
import { FaBell, FaInbox, FaSpinner, FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useNotifications, { Notification } from "../../hooks/useNotifications";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import axios from "axios";

const FullNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const {
    notifications,
    isLoading,
    markAsRead,
    fetchNotifications,
  } = useNotifications(user?._id);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [expanded, setExpanded] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!userLoading) {
    }
  }, [userLoading, user]);

  const handleMarkAllAsRead = () => {
    notifications.forEach((notification) => {
      if (notification.status === "unread") {
        markAsRead(notification.id);
      }
    });
    toast.success("All notifications marked as read");
  };

  const handleFilterChange = (newFilter: "all" | "read" | "unread") => {
    setFilter(newFilter);
    setExpanded(false);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    return notification.status === filter;
  });

  const visibleNotifications = expanded
    ? filteredNotifications
    : filteredNotifications.slice(0, 5);

  const canExpand = filteredNotifications.length > 5;
  const showMore = canExpand && !expanded;
  const showLess = canExpand && expanded;

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === "unread") {
      await markAsRead(notification.id);
    }
    navigate("/notification-detail", { state: { notification } });
  };

  const toggleStatus = async (
    e: React.MouseEvent,
    noticeId: string,
    currentStatus: "Read" | "Unread"
  ) => {
    e.stopPropagation();
    const newStatus = currentStatus === "Read" ? "Unread" : "Read";

    try {
      await axios.patch(
        `${backendUrl}/api/notices/${noticeId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      await fetchNotifications();
      // No toast needed for individual toggle to keep it snappy, or use a very subtle one
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-auto">
       
       <div className="w-full bg-white rounded-2xl shadow-xl border border-platinum-200 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-platinum-200 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="flex items-center gap-4">
                <div className="bg-gunmetal-50 p-3.5 rounded-2xl border border-platinum-200 shadow-inner text-gunmetal-600">
                    <FaBell className="text-2xl" />
                </div>
                <div>
                   <h1 className="text-2xl font-extrabold text-gunmetal-900 tracking-tight">Notifications</h1>
                   <p className="text-sm font-medium text-slate-grey-500">Stay updated with important announcements and alerts.</p>
                </div>
             </div>

             <div className="flex flex-wrap items-center gap-3">
                 <div className="flex p-1 bg-alabaster-grey-50 rounded-xl border border-platinum-200">
                     {[
                         { id: 'all', label: 'All', icon: IoFilterSharp },
                         { id: 'unread', label: 'Unread', icon: IoMailUnreadOutline },
                         { id: 'read', label: 'Read', icon: IoMailOpenOutline }
                     ].map((item) => (
                         <button
                           key={item.id}
                           onClick={() => handleFilterChange(item.id as any)}
                           className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                               filter === item.id 
                                 ? "bg-white text-gunmetal-900 shadow-sm ring-1 ring-platinum-200" 
                                 : "text-slate-grey-500 hover:text-gunmetal-700 hover:bg-platinum-100"
                           }`}
                         >
                             <item.icon className="mr-2 text-lg" />
                             {item.label}
                         </button>
                     ))}
                 </div>
                 
                 <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center px-4 py-2.5 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100"
                    title="Mark all displayed as read"
                 >
                    <IoCheckmarkCircle className="mr-2 text-lg" />
                    Mark All Read
                 </button>
             </div>
          </div>

          {/* List Content */}
          <div className="p-6 bg-alabaster-grey-50/30 min-h-[400px]">
              {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                       <FaSpinner className="animate-spin text-gunmetal-500 text-3xl mb-3" />
                       <p className="text-slate-grey-500 font-medium">Loading notifications...</p>
                  </div>
              ) : filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-platinum-200 rounded-2xl bg-white/50">
                       <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-platinum-100">
                           <FaInbox size={24} className="text-slate-grey-300" />
                       </div>
                       <h3 className="text-lg font-bold text-gunmetal-800">No notifications found</h3>
                       <p className="text-slate-grey-500 text-sm mt-1">
                           {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications.`}
                       </p>
                  </div>
              ) : (
                  <div className="space-y-3">
                      {visibleNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`group p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col sm:flex-row gap-4 ${
                                notification.status === "unread"
                                  ? "bg-white border-gunmetal-200 shadow-md shadow-gunmetal-100/50 hover:border-gunmetal-300"
                                  : "bg-white border-platinum-200 hover:border-gunmetal-200 hover:shadow-sm opacity-80 hover:opacity-100"
                            }`}
                          >
                               {/* Status Indicator Bar */}
                               {notification.status === "unread" && (
                                   <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gunmetal-900"></div>
                               )}

                               <div className="flex-1 pl-2">
                                   <div className="flex justify-between items-start mb-2">
                                       <h3 className={`font-bold text-base line-clamp-1 ${
                                           notification.status === "unread" ? "text-gunmetal-900" : "text-slate-grey-600"
                                       }`}>
                                           {notification.title}
                                       </h3>
                                       <span className="text-xs font-medium text-slate-grey-400 flex items-center gap-1 shrink-0 ml-4 bg-alabaster-grey-50 px-2 py-1 rounded">
                                           <IoTimeOutline />
                                           {new Date(notification.timestamp).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                           })}
                                       </span>
                                   </div>
                                    <div className="flex justify-between items-end mt-3">
                                        <button
                                            onClick={(e) => toggleStatus(e, notification.id, notification.status as any)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 z-10 ${
                                                notification.status === "unread"
                                                ? "bg-white border-platinum-200 text-slate-grey-500 hover:border-gunmetal-300 hover:text-gunmetal-700"
                                                : "bg-platinum-50 border-transparent text-slate-grey-400 hover:bg-white hover:border-platinum-200 hover:text-gunmetal-600"
                                            }`}
                                        >
                                            {notification.status === "unread" ? <IoMailOpenOutline /> : <IoMailUnreadOutline />}
                                            {notification.status === "unread" ? "Mark read" : "Mark unread"}
                                        </button>
                                    </div>
                               </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-white border-t border-platinum-200 flex justify-between items-center">
               <button
                 onClick={() => navigate("/dashboard")}
                 className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-slate-grey-500 hover:text-gunmetal-900 transition-colors"
               >
                  <FaArrowLeft size={12} /> Back to Dashboard
               </button>

               {canExpand && (
                   <div>
                       {showMore && (
                           <button
                             onClick={() => setExpanded(true)}
                             className="flex items-center gap-2 px-5 py-2.5 bg-alabaster-grey-50 border border-platinum-200 rounded-xl text-gunmetal-900 text-sm font-bold hover:bg-platinum-100 transition-all shadow-sm"
                           >
                              Show More <FaChevronDown size={10} />
                           </button>
                       )}
                       {showLess && (
                            <button
                             onClick={() => setExpanded(false)}
                             className="flex items-center gap-2 px-5 py-2.5 bg-alabaster-grey-50 border border-platinum-200 rounded-xl text-gunmetal-900 text-sm font-bold hover:bg-platinum-100 transition-all shadow-sm"
                           >
                              Show Less <FaChevronUp size={10} />
                           </button>
                       )}
                   </div>
               )}
          </div>

       </div>

    </div>
  );
};

export default FullNotificationsPage;
