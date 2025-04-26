import React from 'react';

//Represents a single navigation item
interface NavItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean; //for GitHub/email links
  comingSoon?: boolean; //for placeholder links
}

//Props passed to the NavBar component
interface NavBarProps {
  items: NavItem[];
}

const NavBar: React.FC<NavBarProps> = ({ items }) => {
  return (
    <nav className="bg-custom-red_2 py-2 px-4 text-center border-t border-black">
      <ul className="flex flex-wrap justify-center gap-6 text-sm sm:text-base">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 text-custom-red font-semibold">

            {/* Optional icon shown to the left of the label */}
            {item.icon && (
              <img src={item.icon} alt={`${item.label} icon`} className="w-5 h-5" />
            )}

            {/* If marked as "coming soon", render grayed-out static text */}
            {item.comingSoon ? (
              <span className="opacity-50 cursor-default">{item.label} (soon)</span>
            ) : (
              //Otherwise, render as a working link
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="hover:underline hover:text-red-800 transition"
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
