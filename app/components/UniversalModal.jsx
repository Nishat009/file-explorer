"use client";

import React, { useState, useEffect, useMemo } from 'react';

export default function UniversalModal({ config, onClose, actions }) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const mode = config?.mode;
  const item = config?.item;

  // Properly reset state when config changes (modal opens/changes mode)
  // We use a ref to avoid direct setState in effect body
  useEffect(() => {
    if (!config) {
      // Modal closed
      return;
    }

    // Reset for create modes
    if (['create-folder', 'create-text', 'upload-image'].includes(mode)) {
      // eslint-disable-next-line
      setName('');
      setFile(null);
      setContent('');
    }

    // Pre-fill for rename
    if (mode === 'rename' && item?.name) {
      setName(item.name);
    }

    // Load content for edit
    if (mode === 'edit-text' && config.initialContent != null) {
      setContent(config.initialContent);
    }
  }, [config, mode, item?.name]); // Include mode and item.name as dependencies

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!config) return null;

  const handleAction = () => {
    switch (mode) {
      case 'create-folder':
        if (name.trim()) actions.createFolder(name.trim());
        break;
      case 'create-text':
        if (name.trim()) actions.createTextFile(name.trim());
        break;
      case 'upload-image':
        if (file) actions.uploadFile(file);
        break;
      case 'rename':
        if (name.trim()) actions.renameItem(item.id, name.trim());
        break;
      case 'delete':
        actions.deleteItem(item.id);
        break;
      case 'edit-text':
        actions.saveFile(item.id, content);
        break;
      case 'view-file':
        break;
    }
    onClose();
  };

  const title = {
    'create-folder': 'Create New Folder',
    'create-text': 'Create New Text File',
    'upload-image': 'Upload Image',
    'rename': `Rename ${item?.type === 'folder' ? 'Folder' : 'File'}`,
    'delete': `Delete ${item?.type === 'folder' ? 'Folder' : 'File'}`,
    'edit-text': `Edit ${item?.name}`,
    'view-file': `View ${item?.name}`,
  }[mode];

  const renderContent = () => {
    switch (mode) {
      case 'create-folder':
      case 'create-text':
      case 'rename':
        return (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              mode === 'create-text' ? 'newfile.txt' :
              mode === 'rename' ? item?.name || '' :
              'New Folder'
            }
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        );

      case 'upload-image':
        return (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg mb-6 text-center cursor-pointer hover:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto mt-4 rounded-lg shadow-lg border"
                  />
                )}
              </div>
            )}
          </div>
        );

      case 'delete':
        return (
          <p className="text-lg mb-6 text-red-600">
            Are you sure you want to delete &quot;<strong>{item?.name}</strong>&quot;?<br />
            This action cannot be undone.
          </p>
        );

      case 'edit-text':
        return (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg mb-6 font-mono text-sm bg-gray-50"
            autoFocus
            spellCheck={false}
          />
        );

      case 'view-file':
        return (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item?.content}
              alt={item?.name}
              className="max-w-full max-h-[80vh] rounded-lg shadow-xl"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const actionLabel = {
    'create-folder': 'Create',
    'create-text': 'Create',
    'upload-image': 'Upload',
    'rename': 'Rename',
    'delete': 'Delete',
    'edit-text': 'Save',
  }[mode];

  const actionColor = mode === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  const isDisabled =
    (mode === 'upload-image' && !file) ||
    (['create-folder', 'create-text', 'rename'].includes(mode) && !name.trim());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 overflow-auto ${
          mode === 'view-file' || mode === 'edit-text'
            ? 'max-w-5xl max-h-[95vh]'
            : 'max-w-lg'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-4xl text-gray-400 hover:text-gray-600 transition"
          >
            ×
          </button>
        </div>

        {renderContent()}

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            {mode === 'delete' ? 'Cancel' : 'Close'}
          </button>

          {mode !== 'view-file' && (
            <button
              onClick={handleAction}
              disabled={isDisabled}
              className={`px-6 py-3 text-white rounded-lg transition font-medium ${
                isDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : actionColor
              }`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}