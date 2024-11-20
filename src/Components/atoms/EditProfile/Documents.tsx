import React, { useState } from 'react';
import { FaFileUpload, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';

interface DocumentProps {
  documents: {
    name: string;
    type: 'image' | 'pdf';
    fileUrl: string | null;
  }[];
  onUpdate: (name: string, file: File) => void;
}

const Documents: React.FC<DocumentProps> = ({ documents, onUpdate }) => {
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (name: string) => {
    if (selectedFile) {
      onUpdate(name, selectedFile);
      setSelectedFile(null);
      setEditingDocument(null);
    }
  };

  const toggleEdit = (name: string) => {
    setEditingDocument((prev) => (prev === name ? null : name));
  };

  return (
    <div className="bg-white p-14 rounded-lg w-full mx-auto">
      {documents.map((doc, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-100 p-4 mb-4 mt-4 rounded-full border border-gray-300"
        >
          <div className="flex items-center gap-4">
            {doc.fileUrl ? (
              <FaCheckCircle className="text-green-500" size={24} />
            ) : (
              <FaTimesCircle className="text-red-500" size={24} />
            )}
            <p className="text-lg font-medium text-gray-700">{doc.name}</p>
          </div>
          <div className="flex items-center gap-4">
            {doc.fileUrl && (
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all uppercase"
                  aria-label={`View ${doc.name}`}
                >
                  <FaEye size={16} />
                  View
                </button>
              </a>
            )}
            <button
              onClick={() => toggleEdit(doc.name)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-black transition-all uppercase"
              aria-label={`Upload ${doc.name}`}
            >
              <FaFileUpload size={16} />
              Upload
            </button>
          </div>

          {editingDocument === doc.name && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-700 mb-4">
                  Upload New {doc.name}
                </h3>
                <input
                  type="file"
                  accept={doc.type === 'pdf' ? 'application/pdf' : 'image/*'}
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-900 mb-4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setEditingDocument(null)}
                    className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpload(doc.name)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Documents;