import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

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

  return (
    <div className="bg-white p-8 rounded-lg w-full mx-auto relative">
      <button
        onClick={toggleEdit}
        className="absolute top-5 right-8 text-blue-600 hover:text-blue-500 transition-all"
        aria-label="Edit Bank Account Details"
      >
        <FaEdit size={24} />
      </button>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="institute"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Institute
          </label>
          <input
            type="text"
            id="institute"
            name="institute"
            value={formData.institute}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="degree"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Degree
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="fieldOfStudy"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Field of Study
          </label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* GPA */}
        <div className="mb-6">
          <label
            htmlFor="GPA"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            GPA
          </label>
          <input
            type="text"
            id="GPA"
            name="GPA"
            value={formData.GPA}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Year of Completion */}
        <div className="mb-6">
          <label
            htmlFor="yearOfCompletion"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Year of Completion
          </label>
          <select
            id="yearOfCompletion"
            name="yearOfCompletion"
            value={formData.yearOfCompletion}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          >
            <option value="">-- Select Year --</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {isEditing && (
          <div className="flex justify-start">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all text-lg font-semibold"
            >
              Update
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Education;
