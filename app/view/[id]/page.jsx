"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useFiles from "@/app/hooks/useFiles";
import Sidebar from "@/app/components/Sidebar";
import { ArrowLeft, Save, X } from "lucide-react";
import toast from "react-hot-toast";

export default function FileViewerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fs, currentFolder, actions } = useFiles();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentContent, setCurrentContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

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
      setHasUnsavedChanges(false);
      setIsLoading(false);
      return;
    }

    // File found
    setItem(found);
    setCurrentContent(found.content || "");
    setOriginalContent(found.content || "");
    setHasUnsavedChanges(false);
    setIsLoading(false);
  }, [fs, id]); // Only primitive dependencies

  /* ---------------- Track unsaved changes ---------------- */
  useEffect(() => {
    if (!item) return;
    setHasUnsavedChanges(currentContent !== originalContent);
  }, [currentContent, originalContent, item?.id]);

  /* ---------------- Actions ---------------- */
  const handleManualSave = () => {
    if (!item) return;
    actions.saveFile(item.id, currentContent);
    setOriginalContent(currentContent);
    setHasUnsavedChanges(false);
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
      <div className="flex h-screen">
        <Sidebar fs={fs || {}} currentFolder={currentFolder} actions={actions} />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-screen">
        <Sidebar fs={fs} currentFolder={currentFolder} actions={actions} />
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <p className="text-2xl text-gray-600 mb-8">Select a file to view</p>
        </div>
      </div>
    );
  }

  /* ---------------- File Editor ---------------- */
  return (
    <div className="flex h-screen">
      <Sidebar fs={fs} currentFolder={currentFolder} actions={actions} />

      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-8 py-5 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <h1 className="text-xl font-bold text-gray-900 truncate max-w-md">
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
              className="flex-1 w-full p-12 font-mono text-lg leading-loose resize-none focus:outline-none"
              spellCheck={false}
            />

            <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
              </span>

              <div className="flex gap-3">
                {hasUnsavedChanges && (
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleManualSave}
                  disabled={!hasUnsavedChanges}
                  className={`px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-md ${
                    hasUnsavedChanges
                      ? "bg-blue-600 text-white hover:bg-blue-700"
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
