import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
        <div
          className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${
            checked ? 'transform translate-x-full bg-[#ff6600]' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;