import React from 'react';

const ChangeLogs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">

      {/* Page title */}
      <h2 className="text-2xl font-bold mb-4 text-custom-red">Change Logs</h2>

      {/* Entry for version 1.0.0 */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-900">v1.0.0 — April 2025</h3>
        <ul className="list-disc list-inside pl-4 text-l text-gray-700">
          <li>Initial public release of Coptic Scribe</li>
        </ul>
      </div>

      {/* More versions added here */}
    </div>
  );
};

export default ChangeLogs;
