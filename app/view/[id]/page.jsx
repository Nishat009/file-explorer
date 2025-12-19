"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useFiles from "@/app/hooks/useFiles";
import Sidebar from "@/app/components/Sidebar";
import { ArrowLeft, Save, X, Menu } from "lucide-react";
import toast from "react-hot-toast";

export default function FileViewerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fs, currentFolder, actions } = useFiles();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentContent, setCurrentContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Start collapsed (mobile default)
  const [justSaved, setJustSaved] = useState(false);

  // Handle responsive sidebar: always open on desktop, collapsed on mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      // On desktop, always open sidebar; on mobile, keep it collapsed
      if (isDesktop) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  /* ---------------- Load file ---------------- */
  useEffect(() => {
    if (!fs) return;

    setIsLoading(true);

    const found = id ? actions.find(id) : null;

    if (!found || found.type === "folder") {
      // Reset file state if no file is found or folder is selected
      setItem(null);
      setCurrentContent("");
      setOriginalContent("");
      setIsLoading(false);
      return;
    }

    // File found - only update content if it's a different file
    const isNewFile = !item || item.id !== found.id;
    
    setItem(found);
    
    // Only update content if it's a new file
    // For the same file, preserve current edits unless explicitly reset
    if (isNewFile) {
      setCurrentContent(found.content || "");
      setOriginalContent(found.content || "");
    } else {
      // Same file - update originalContent to match fs, but preserve currentContent if user is editing
      // This handles external updates (like from another tab/window)
      setOriginalContent(found.content || "");
    }
    
    setIsLoading(false);
  }, [fs, id]); // Only primitive dependencies

  /* ---------------- Track unsaved changes ---------------- */
//   useEffect(() => {
//     if (!item) return;
//     setHasUnsavedChanges(currentContent !== originalContent);
//   }, [currentContent, originalContent, item?.id]);
const hasUnsavedChanges = item ? currentContent !== originalContent : false;
  /* ---------------- Actions ---------------- */
  const handleManualSave = () => {
  if (!item) return;

  // Save the content to FS
  actions.saveFile(item.id, currentContent);

  // Update local reference of saved content
  setOriginalContent(currentContent);
  setHasUnsavedChanges(false);

  // Show temporary saved indicator
  setJustSaved(true);
  setTimeout(() => setJustSaved(false), 1500);
};


  const handleCancel = () => {
    setCurrentContent(originalContent);
    setHasUnsavedChanges(false);
  };

  const handleBack = () => router.back();

  /* ---------------- Loading / Not Found ---------------- */
  if (isLoading || !fs) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          fs={fs || {}}
          currentFolder={currentFolder}
          actions={actions}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          fs={fs}
          currentFolder={currentFolder}
          actions={actions}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-2xl text-gray-600 mb-8">Select a file to view</p>
        </div>
      </div>
    );
  }

  /* ---------------- File Editor ---------------- */
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        fs={fs}
        currentFolder={currentFolder}
        actions={actions}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => {
          // On desktop, prevent manual collapse (always open)
          const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
          if (!isDesktop) {
            setSidebarCollapsed(!sidebarCollapsed);
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

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate max-w-md">
              {item.name}
            </h1>
          </div>

          {justSaved && (
            <span className="text-emerald-600 font-medium animate-fade-in">
              Saved
            </span>
          )}
        </div>

        {/* Text Editor */}
        {item.fileType === "text" && (
          <div className="flex-1 flex flex-col bg-white">
           <textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            className="flex-1 w-full p-4 lg:p-12 font-mono text-base lg:text-lg leading-loose resize-none focus:outline-none"
            spellCheck={false}
          />


            <div className="border-t border-gray-200 bg-gray-50 px-4 lg:px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className={`text-sm font-medium ${
                hasUnsavedChanges ? "text-amber-600" : "text-green-600"
              }`}>
                {hasUnsavedChanges ? "● Unsaved changes" : "✓ All changes saved"}
              </span>

              <div className="flex gap-3 w-full sm:w-auto">
                {hasUnsavedChanges && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2 font-medium shadow-sm"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleManualSave}
                  disabled={!hasUnsavedChanges}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-medium shadow-md ${
                    hasUnsavedChanges
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer */}
        {item.fileType === "image" && (
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
            <img
              src={item.content}
              alt={item.name}
              className="max-w-lg max-h-xl object-contain rounded-2xl shadow-2xl border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}
