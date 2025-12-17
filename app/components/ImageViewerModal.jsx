"use client";

import React from 'react';

export default function ImageViewerModal({ viewingFile, onClose }) {
  if (!viewingFile) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Viewing: {viewingFile.name}</h3>
          <button className="text-2xl" onClick={onClose}>
            ×
          </button>
        </div>
        <div>
          {viewingFile.fileType === 'image' && (
            <img src={viewingFile.content} alt={viewingFile.name} className="max-w-full max-h-screen" />
          )}
        </div>
      </div>
    </div>
  );
}
