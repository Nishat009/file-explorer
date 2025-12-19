"use client";

import { useState, useEffect } from "react";
import FileTree from "./FileTree";
import { Menu, X } from "lucide-react";

export default function Sidebar({ fs, currentFolder, actions, onOpenFile, isCollapsed, onToggleCollapse }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.matchMedia('(min-width: 1024px)').matches);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // On desktop, sidebar is always visible (not collapsed)
  const shouldShow = isDesktop || !isCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      {shouldShow && !isDesktop && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-slate-900 text-slate-100 border-r border-slate-700/50
          transition-transform duration-300 ease-in-out
          ${shouldShow ? 'translate-x-0' : '-translate-x-full'}
          ${shouldShow ? 'w-64' : 'w-0'}
          overflow-hidden shadow-xl
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header with toggle button */}
          <div className="p-5 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-wide uppercase">File Explorer</h3>
            {!isDesktop && (
              <button
                onClick={onToggleCollapse}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* File tree */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="space-y-0.5">
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-slate-800/70 cursor-pointer transition-all duration-150 ${
                  currentFolder?.id === fs.id ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500' : ''
                }`}
                onClick={() => actions.setCurrent(fs.id)}
              >
                <span className="text-xl">📁</span>
                <span className="font-medium text-sm">{fs.name}</span>
              </div>
              {(fs.children || []).map((child) => (
                <FileTree
                  key={child.id}
                  node={child}
                  actions={actions}
                  currentFolderId={currentFolder?.id}
                  depth={1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}