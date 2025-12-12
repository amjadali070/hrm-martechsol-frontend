import React, { useState } from "react";
import { FaEdit, FaFilePdf, FaUpload, FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";

interface ResumeProps {
  resumeUrl: string | null;
  onUpdate: (file: File) => void;
}

const Resume: React.FC<ResumeProps> = ({ resumeUrl, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setSelectedFile(null); 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onUpdate(selectedFile);
      setSelectedFile(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden relative">
      <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">Resume Management</h2>
            {resumeUrl && !isEditing && (
                <button
                onClick={toggleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-platinum-200 text-gunmetal-700 text-sm font-bold rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm"
                >
                <FaEdit /> Update Resume
                </button>
            )}
        </div>

      <div className="p-8">
        {resumeUrl && !isEditing ? (
             <div className="bg-alabaster-grey-50 rounded-xl border border-platinum-200 p-1">
                <div className="w-full h-[600px] rounded-lg overflow-hidden bg-white">
                    <object
                    data={resumeUrl}
                    type="application/pdf"
                    className="w-full h-full"
                    >
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                         <FaFilePdf size={48} className="text-rose-500 mb-4" />
                        <h3 className="text-lg font-bold text-gunmetal-900">PDF Preview Not Available</h3>
                        <p className="text-slate-grey-500 text-sm mb-6 max-w-sm mx-auto">
                        Your browser doesn't support embedding PDFs. You can view or download the file directly using the link below.
                        </p>
                        <a 
                            href={resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-gunmetal-900 text-white rounded-lg text-sm font-bold hover:bg-gunmetal-800 transition-all shadow-lg"
                        >
                        Download PDF
                        </a>
                    </div>
                </object>
                </div>
            </div>
        ) : (
             <div className="max-w-xl mx-auto py-12">
                 {!isEditing && !resumeUrl && (
                     <div className="text-center mb-8">
                         <div className="w-16 h-16 bg-alabaster-grey-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-platinum-200">
                             <FaFileAlt size={24} className="text-gunmetal-400" />
                         </div>
                         <h3 className="text-lg font-bold text-gunmetal-900">No Resume Uploaded</h3>
                         <p className="text-slate-grey-500 text-sm mb-6">Upload your resume to complete your profile.</p>
                         <button
                            onClick={toggleEdit}
                            className="px-6 py-2.5 bg-gunmetal-900 text-white rounded-lg text-sm font-bold hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20"
                        >
                            Upload Resume
                        </button>
                     </div>
                 )}

                 {isEditing && (
                    <div className="bg-white rounded-2xl shadow-sm border border-platinum-200 overflow-hidden">
                        <div className="px-6 py-4 bg-alabaster-grey-50 border-b border-platinum-200">
                            <h3 className="font-bold text-gunmetal-900">Upload New Resume</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="border-2 border-dashed border-platinum-300 rounded-xl p-8 text-center hover:bg-alabaster-grey-50 transition-colors relative mb-6">
                                <input
                                    type="file"
                                    id="resumeUpload"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="pointer-events-none">
                                    {selectedFile ? (
                                        <div className="flex flex-col items-center">
                                            <FaFilePdf size={40} className="text-rose-500 mb-2" />
                                            <span className="text-gunmetal-900 font-bold mb-1">{selectedFile.name}</span>
                                            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">PDF Selected</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-grey-500">
                                            <FaCloudUploadAlt className="text-4xl mb-3 text-platinum-400" />
                                            <span className="text-sm font-medium">Click to upload or drag & drop</span>
                                            <span className="text-xs mt-1 text-slate-grey-400">PDF only (Max 5MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                             <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={toggleEdit}
                                    className="px-5 py-2 bg-white border border-platinum-200 text-slate-grey-600 rounded-lg text-sm font-bold hover:bg-alabaster-grey-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedFile}
                                    className={`px-5 py-2 bg-gunmetal-900 text-white rounded-lg text-sm font-bold transition-all shadow-lg ${!selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gunmetal-800 shadow-gunmetal-500/20'}`}
                                >
                                    Upload File
                                </button>
                            </div>
                        </form>
                    </div>
                 )}
             </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
