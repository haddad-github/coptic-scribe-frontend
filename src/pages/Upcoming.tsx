import React from 'react';

const Upcoming: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-custom-red">Upcoming Changes</h2>

      <ul className="list-disc list-inside pl-4 space-y-2 text-l text-gray-700">
        <li>Language changer to Arabic, for Arabic speakers</li>
        <li>Search the actual dictionary itself</li>
        <li>Adding Jinkim support</li>
        <li>Adding Sahidic Coptic</li>
        <li>Fix PDF export formatting</li>
        <li>Make bookmarks shareable across users</li>
      </ul>
    </div>
  );
};

export default Upcoming;
