import React from 'react';

const EditButton: React.FC = () => {
  return (
    <button className="px-6 py-3 my-auto font-semibold text-black bg-white rounded-[30px] hover:bg-gray-100 transition-colors duration-300 max-md:px-4 max-md:py-2">
      Edit Profile
    </button>
  );
};

export default EditButton;