"use client";

import React, { useState } from 'react';

export default function Toolbar({ actions, view, onViewChange, selectedItem, setModalConfig }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCreate = (mode) => {
    setModalConfig({ mode });
    setDropdownOpen(false);
  };

  const handleRename = () => {
    if (!selectedItem) return alert('Please select an item to rename.');
    setModalConfig({ mode: 'rename', item: selectedItem });
  };

  const handleDelete = () => {
    if (!selectedItem) return alert('Please select an item to delete.');
    setModalConfig({ mode: 'delete', item: selectedItem });
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            + Create
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              <button className="w-full text-left px-5 py-3 hover:bg-gray-100 transition" onClick={() => handleCreate('create-folder')}>
                📁 New Folder
              </button>
              <button className="w-full text-left px-5 py-3 hover:bg-gray-100 transition" onClick={() => handleCreate('create-text')}>
                📄 New Text File
              </button>
              <button className="w-full text-left px-5 py-3 hover:bg-gray-100 transition" onClick={() => handleCreate('upload-image')}>
                🖼️ Upload Image
              </button>
            </div>
          )}
        </div>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium transition" onClick={handleRename}>
          Rename
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
        <button
          className={`px-4 py-2 rounded-md font-medium transition ${view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
          onClick={() => onViewChange('grid')}
        >
          Grid
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium transition ${view === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
          onClick={() => onViewChange('list')}
        >
          List
        </button>
      </div>
    </div>
  );
}