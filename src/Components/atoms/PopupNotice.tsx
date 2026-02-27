import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoCloseCircle } from "react-icons/io5";
import { formatDate } from "../../utils/formatDate"; // Ensure this utility exists
import announcement from "../../assets/announcement.png";

interface Notice {
  _id: string;
  date: string;
  subject: string;
  status: "Read" | "Unread";
  paragraph: string;
}

const PopupNotice: React.FC = () => {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUnreadNotices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/notices`, {
          withCredentials: true,
          params: {
            status: "Unread",
            limit: 1,
            sort: "-date",
          },
        });

        const unreadNotices: Notice[] = response.data.notices;

        if (unreadNotices.length > 0) {
          setNotice(unreadNotices[0]);
          setIsVisible(true);

          await axios.patch(
            `${backendUrl}/api/notices/${unreadNotices[0]._id}/status`,
            { status: "Read" },
            { withCredentials: true }
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch unread notices", err);
        setLoading(false);
      }
    };

    fetchUnreadNotices();
  }, [backendUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        initiateCloseModal();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  const initiateCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 500);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      initiateCloseModal();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    const focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = modalRef.current;
    const firstFocusableElement = modal?.querySelectorAll(
      focusableElements
    )[0] as HTMLElement;
    const focusableContent = modal?.querySelectorAll(
      focusableElements
    ) as NodeListOf<HTMLElement>;
    const lastFocusableElement = focusableContent
      ? (focusableContent[focusableContent.length - 1] as HTMLElement)
      : null;

    const handleTabKey = (e: KeyboardEvent) => {
      if (!focusableContent) return;

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement?.focus();
          }
        }
      }
    };

    if (isVisible) {
      firstFocusableElement?.focus();
      document.addEventListener("keydown", handleTabKey);
    }

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isVisible]);

  if (loading || (!isVisible && !isClosing)) {
    return null;
  }

  const scrollbarStyles = {
    overflowY: "auto",
    maxHeight: "65vh",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  } as React.CSSProperties;

  const hideScrollbarStyles = {
    "::-webkit-scrollbar": {
      display: "none",
    },
  } as React.CSSProperties;

  return (
    <>
      {notice && (isVisible || isClosing) && (
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-notice-title"
        >
          <div
            ref={modalRef}
            className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-3xl relative transform transition-transform duration-500 ease-in-out ${
              isVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-4 scale-95 opacity-0"
            }`}
          >
            <button
              onClick={initiateCloseModal}
              className="absolute top-4 right-4 text-blue-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
              aria-label="Close popup"
            >
              <IoCloseCircle size={28} />
            </button>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={announcement}
                alt="Announcement Icon"
                className="w-8 h-8 object-contain"
              />
              <h2
                id="popup-notice-title"
                className="text-2xl font-semibold text-gray-800 dark:text-gray-100"
              >
                {notice.subject}
              </h2>
            </div>

            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <strong>Date:</strong> {formatDate(notice.date)}
            </p>

            <div
              className="text-gray-700 dark:text-gray-200 break-words space-y-2"
              style={{ ...scrollbarStyles, ...hideScrollbarStyles }}
              dangerouslySetInnerHTML={{ __html: notice.paragraph }}
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={initiateCloseModal}
                className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <IoCloseCircle size={20} />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupNotice;
