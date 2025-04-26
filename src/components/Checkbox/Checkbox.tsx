import React from 'react';

//Props for the custom Checkbox component
interface CheckboxProps {
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ text, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer select-none">
      {/* Hidden native checkbox for accessibility and logical control */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />

      {/* Styled box shown instead of the default checkbox */}
      <div
        className={`w-5 h-5 flex items-center justify-center border-2 rounded border-gray-400 text-sm font-bold ${
          checked ? 'bg-custom-red text-white' : 'bg-white'
        } hover:scale-105 transition-transform duration-150`}
      >
        {checked ? '✠' : ''}
      </div>

      {/* Checkbox label text, clicking this also toggles the checkbox */}
      <span className="text-sm font-semibold">{text}</span>
    </label>
  );
};

export default Checkbox;
