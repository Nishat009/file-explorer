"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import FileGrid from './FileGrid';
import Toolbar from './Toolbar';
import UniversalModal from './UniversalModal';
import useFiles from '../hooks/useFiles';

export default function ClientApp() {
  const { fs, currentFolder, selectedItem, actions } = useFiles();
  const [view, setView] = useState('grid');
  const [modalConfig, setModalConfig] = useState(null);

  const handleItemClick = (id) => {
    actions.select(id); // single click → select only
  };

  const handleItemDoubleClick = (id) => {
    const item = actions.find(id);
    if (!item) return;

    if (item.type === 'folder') {
      actions.setCurrent(id); // navigate to folder
    } else if (item.fileType === 'text') {
      setModalConfig({ mode: 'edit-text', item, initialContent: item.content || '' });
    } else if (item.fileType === 'image') {
      setModalConfig({ mode: 'view-file', item });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar fs={fs} currentFolder={currentFolder} actions={actions} />

      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <Toolbar
          actions={actions}
          view={view}
          onViewChange={setView}
          selectedItem={selectedItem}
          setModalConfig={setModalConfig}
        />

        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {currentFolder?.name || 'My Files'}
        </h2>

        <FileGrid
          items={currentFolder?.children || []}
          onItemClick={handleItemClick}
          onItemDoubleClick={handleItemDoubleClick}
          selectedItem={selectedItem}
          view={view}
        />
      </div>

      <UniversalModal
        config={modalConfig}
        onClose={() => setModalConfig(null)}
        actions={actions}
      />
    </div>
  );
}