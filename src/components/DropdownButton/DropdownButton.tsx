import React, { useState } from 'react';

//Props for the DropdownButton component
interface DropdownButtonProps {
    text?: string; //optional text for the button
    icon?: string; //optional icon for the button
    iconWidth?: number; //optional determining icon's width
    menuItems: string[]; //array of items to display in the dropdown
    onItemClick?: (item: string) => void; //handle menu item click
}

const DropdownButton: React.FC<DropdownButtonProps> = ({text, icon,
                                                           iconWidth, menuItems,
                                                           onItemClick,}) => {
    //Local state to track whether the dropdown is open
    const [isOpen, setIsOpen] = useState(false);

    //Toggle dropdown open/close
    const handleClick = () => {
        setIsOpen((prev) => !prev);
    };

    //Close the dropdown
    const handleClose = () => {
        setIsOpen(false);
    };

    return (
      <div className="relative inline-block text-left">
        {/* Trigger Button */}
        <button
          onClick={handleClick}
          className="flex flex-col items-center bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 transition"
        >
          {icon && <img src={icon} alt="icon" width={iconWidth} className="mb-1" />}

          {/* Optional label below the icon */}
          <span className="text-sm font-semibold">{text}</span>
        </button>

        {/* Dropdown menu — shown only when open */}
        {isOpen && (
          <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  //Trigger callback with selected item
                  onItemClick?.(item);
                  //Close the dropdown afterward
                  handleClose();
                }}
                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export default DropdownButton;
