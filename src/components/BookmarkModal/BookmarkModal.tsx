import React, { useState } from 'react';

//Props expected by the BookmarkModal component
interface BookmarkModalProps {
  onClose: () => void;
  onSave: (name: string, notes: string) => void;
}

//Modal for saving a bookmark with an optional note
const BookmarkModal: React.FC<BookmarkModalProps> = ({ onClose, onSave }) => {
  //Controlled input for bookmark name
  const [name, setName] = useState('');

  //Controlled input for optional notes
  const [notes, setNotes] = useState('');

  return (
    //Full-screen backdrop with centered modal
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">

      {/* Modal card container */}
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg border border-gray-300">

        {/* Modal title */}
        <h2 className="text-xl font-semibold text-custom-red mb-4 text-center">Save as Bookmark</h2>

        {/* Input for bookmark name */}
        <input
          type="text"
          placeholder="Bookmark name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3"
        />

        {/* Textarea for optional notes */}
        <textarea
          placeholder="Add notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded resize-y min-h-[80px] mb-4"
        />

        {/* Action buttons: Cancel and Save */}
        <div className="flex justify-end gap-2">
          <button
            className="text-gray-600 hover:text-black"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            onClick={() => onSave(name, notes)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkModal;
