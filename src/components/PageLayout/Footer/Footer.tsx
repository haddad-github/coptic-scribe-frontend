import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-300 text-center text-sm py-4 mt-8 bg-gray-200">
      {/* Copyright notice */}
      <div className="text-white-600">
        © 2025 Rafic Haddad. All rights reserved.
      </div>

      {/* Links to legal pages */}
      <div className="text-blue-500 mt-1">
        <a href="/terms" className="hover:underline">Terms of Service</a> | <a href="/privacy" className="hover:underline">Privacy Policy</a>
      </div>
    </footer>
  );
};


export default Footer;