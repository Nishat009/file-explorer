"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import FileGrid from './FileGrid';
import Toolbar from './Toolbar';
import UniversalModal from './UniversalModal';
import useFiles from '../hooks/useFiles';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

export default function ClientApp() {
  const { fs, currentFolder, selectedItem, actions } = useFiles();
  const [view, setView] = useState('grid');
  const [modalConfig, setModalConfig] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Start collapsed (mobile default)
  const router = useRouter();

  // Handle responsive sidebar: always open on desktop, collapsed on mobile
  useEffect(() => {
    // Set initial state based on screen size
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    setSidebarCollapsed(!isDesktop);

    // Only update on actual screen size category changes (mobile ↔ desktop)
    const handleResize = () => {
      const isDesktopNow = window.matchMedia('(min-width: 1024px)').matches;
      // Only update if transitioning between mobile and desktop
      setSidebarCollapsed((prev) => {
        // If switching to desktop, always open
        if (isDesktopNow) return false;
        // If switching to mobile, keep current state (don't force collapse)
        return prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const handleItemClick = (id) => {
    const item = actions.find(id);
    if (!item) return;

    // Single click to open files/folders
    if (item.type === 'folder') {
      actions.setCurrent(id);
    } else {
      // Open files
      if (item.fileType === 'text') {
        router.push(`/view/${id}`);
      } else if (item.fileType === 'image') {
        router.push(`/view/${id}`);
      }
    }
  };

  // Central handler for opening files (used by both grid and sidebar)
  const handleOpenFile = (id) => {
    const item = actions.find(id);
    if (!item || item.type === 'folder') return;

    if (item.fileType === 'text') {
      setModalConfig({
        mode: 'edit-text',
        item,
        initialContent: item.content || '',
      });
    } else if (item.fileType === 'image') {
      setModalConfig({
        mode: 'view-file',
        item,
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        fs={fs}
        currentFolder={currentFolder}
        actions={actions}
        onOpenFile={handleOpenFile}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => {
          // On desktop, prevent manual collapse (always open)
          const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
          if (!isDesktop) {
            setSidebarCollapsed(!sidebarCollapsed);
          }
        }}
        onItemClick={() => {
          // Close sidebar on mobile when item is clicked
          const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
          if (!isDesktop) {
            setSidebarCollapsed(true);
          }
        }}
      />

      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Mobile menu button - only show when sidebar is collapsed on mobile */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Toolbar
            actions={actions}
            view={view}
            onViewChange={setView}
            selectedItem={selectedItem}
            setModalConfig={setModalConfig}
          />

        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          {currentFolder?.name || 'My Files'}
        </h2>

        <FileGrid
          items={currentFolder?.children || []}
          onItemClick={handleItemClick}
          selectedItem={selectedItem}
          view={view}
          setModalConfig={setModalConfig}
        />
        </div>
      </div>

      <UniversalModal
        config={modalConfig}
        onClose={() => setModalConfig(null)}
        actions={actions}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}