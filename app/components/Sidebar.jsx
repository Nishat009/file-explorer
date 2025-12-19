"use client";

import { useState, useEffect } from "react";
import FileTree from "./FileTree";
import { X } from "lucide-react";

export default function Sidebar({
  fs,
  currentFolder,
  actions,
  onItemClick,
  isCollapsed,
  onToggleCollapse,
}) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const handler = () => setIsDesktop(media.matches);

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Desktop: always visible
  const showSidebar = isDesktop || !isCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      {!isDesktop && showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-slate-900 text-slate-100
          border-r border-slate-700/50
          transition-transform duration-300
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-700/50 flex justify-between">
            <h3 className="font-bold uppercase text-sm">File Explorer</h3>

            {!isDesktop && (
              <button
                onClick={onToggleCollapse}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-y-auto p-4">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer
                ${currentFolder?.id === fs.id
                  ? "bg-blue-600/20 text-blue-300"
                  : "hover:bg-slate-800"
                }`}
              onClick={() => actions.setCurrent(fs.id)}
            >
              📁 {fs.name}
            </div>

            {(fs.children || []).map(child => (
              <FileTree
                key={child.id}
                node={child}
                actions={actions}
                currentFolderId={currentFolder?.id}
                depth={1}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
