import React, { useEffect, useState } from 'react';

//Bookmark object shape
interface Bookmark {
  id: number;
  name: string;
  notes?: string;
}

//Props expected by the SearchDropdown component
interface SearchDropdownProps {
  bookmarks: Bookmark[]; //list of all bookmarks
  onSelect: (bookmark: Bookmark) => void;
  onRename: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({bookmarks, onSelect, onRename, onDelete, onClose,}) => {

  //Text typed in the search field
  const [search, setSearch] = useState('');

  //Filtered list of bookmarks based on search
  const [filtered, setFiltered] = useState<Bookmark[]>(bookmarks);

  //Tracks currently edited bookmark ID
  const [editingId, setEditingId] = useState<number | null>(null);

  //Tracks the new name while editing
  const [editingName, setEditingName] = useState('');

  //Updates filtered list whenever search input or bookmarks change
  useEffect(() => {
    setFiltered(
      bookmarks.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, bookmarks]);

  //Submit new name to parent on blur or Enter
  const handleRenameSubmit = (id: number) => {
    if (editingName.trim()) {
      onRename(id, editingName.trim());
    }
    setEditingId(null);
  };

  //Confirm deletion with user before triggering parent handler
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      onDelete(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">My Bookmarks</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm"
          >
            ✖ Close
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookmarks..."
          className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none text-sm"
        />

        {/* If no results found */}
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500">No bookmarks found.</div>
        )}

        {/* Bookmark List */}
        <div className="space-y-2">
          {filtered.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2 flex-1">
                {/* Rename Icon */}
                <button
                  onClick={() => {
                    setEditingId(bookmark.id);
                    setEditingName(bookmark.name);
                  }}
                  className="text-orange-600 hover:bg-orange-300 rounded-full"
                >
                  ✏️
                </button>

                {/* Rename Input OR Bookmark Text */}
                {editingId === bookmark.id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleRenameSubmit(bookmark.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(bookmark.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 px-2 py-0.5 text-sm border border-gray-300 rounded"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => onSelect(bookmark)}
                    className="text-left text-sm text-gray-800 flex-1 cursor-pointer"
                  >

                    {/* Bookmark Name */}
                    <div className="font-medium truncate">{bookmark.name}</div>

                    {/* Optional Notes Preview (2-line clamp) */}
                    {bookmark.notes && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {bookmark.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(bookmark.id)}
                className="text-red-600 hover:bg-red-700 rounded-full"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
