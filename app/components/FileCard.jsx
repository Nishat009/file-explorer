"use client";

import React from 'react';

export default function FileCard({ item, onClick, onDoubleClick, isSelected }) {
  return (
    <div
      className={`group flex flex-col items-center p-6 bg-white border-2 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="text-6xl mb-4 text-gray-600">
        {item.type === 'folder' ? '📁' : item.fileType === 'image' ? '🖼️' : '📄'}
      </div>
      <div className="text-sm font-medium text-gray-800 text-center break-all" title={item.name}>
        {item.name}
      </div>
      {item.type === 'folder' && (
        <div className="text-xs text-gray-500 mt-1">Folder</div>
      )}
    </div>
  );
}