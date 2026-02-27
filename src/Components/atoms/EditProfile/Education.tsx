import React, { useState } from "react";
import { FaEdit, FaUniversity, FaGraduationCap, FaBookOpen, FaStar, FaCalendarAlt } from "react-icons/fa";

interface EducationProps {
  institute: string;
  degree: string;
  fieldOfStudy: string;
  GPA: string;
  yearOfCompletion: string;
  onUpdate: (details: {
    institute: string;
    degree: string;
    fieldOfStudy: string;
    GPA: string;
    yearOfCompletion: string;
  }) => void;
}

const Education: React.FC<EducationProps> = ({
  institute,
  degree,
  fieldOfStudy,
  GPA,
  yearOfCompletion,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    institute,
    degree,
    fieldOfStudy,
    GPA,
    yearOfCompletion,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  );

  const renderField = (label: string, icon: React.ReactNode, content: React.ReactNode) => (
      <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200">
          <div className="flex items-center gap-2 mb-2">
              <span className="text-gunmetal-400 text-sm">{icon}</span>
              <p className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide">{label}</p>
          </div>
          {content}
      </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden relative">
        <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">Education Details</h2>
            {!isEditing && (
                <button
                onClick={toggleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-platinum-200 text-gunmetal-700 text-sm font-bold rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm"
                >
                <FaEdit /> Edit Details
                </button>
            )}
        </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {renderField("Institute Name", <FaUniversity />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="institute"
                        value={formData.institute}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.institute || "N/A"}</p>
                 )
             )}

             {renderField("Degree Title", <FaGraduationCap />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.degree || "N/A"}</p>
                 )
             )}

             {renderField("Field of Study", <FaBookOpen />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.fieldOfStudy || "N/A"}</p>
                 )
             )}

             {renderField("CGPA / Grade", <FaStar />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="GPA"
                        value={formData.GPA}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.GPA || "N/A"}</p>
                 )
             )}

             {renderField("Completion Year", <FaCalendarAlt />, 
                 isEditing ? (
                    <select
                        name="yearOfCompletion"
                        value={formData.yearOfCompletion}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.yearOfCompletion || "N/A"}</p>
                 )
             )}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-platinum-200">
             <button
              type="button"
              onClick={toggleEdit}
              className="px-6 py-2.5 bg-white border border-platinum-200 text-slate-grey-600 rounded-lg text-sm font-bold hover:bg-alabaster-grey-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gunmetal-900 text-white rounded-lg text-sm font-bold hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Education;
