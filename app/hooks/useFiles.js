"use client";

import { useState, useEffect } from 'react';

const defaultRoot = {
  id: 'root',
  name: 'My Files',
  type: 'folder',
  children: [],
  opened: true,
};

const uuid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export default function useFiles() {
  const [fs, setFs] = useState(defaultRoot);
  const [currentFolder, setCurrentFolder] = useState(defaultRoot);
  const [selectedItem, setSelectedItem] = useState(null);

  // Load from server → fallback to localStorage
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/fs');
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (mounted) {
          setFs(data);
          setCurrentFolder(data);
        }
      } catch (e) {
        const saved = localStorage.getItem('miniFileExplorer');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setFs(parsed);
            setCurrentFolder(findNode(parsed, parsed.id) || parsed);
          } catch (_) {}
        }
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (fs && fs.id) {
      const data = JSON.stringify(fs);
      // Check if data size exceeds ~4MB to avoid quota error
      if (data.length < 4 * 1024 * 1024) {
        try {
          localStorage.setItem('miniFileExplorer', data);
        } catch (e) {
          // Quota exceeded, skip saving to localStorage
          console.warn('Failed to save to localStorage: quota exceeded');
        }
      }
    }
  }, [fs]);

  // Save to server (fire and forget)
  const saveFs = async (mutateFn) => {
    const copy = JSON.parse(JSON.stringify(fs));
    mutateFn(copy);
    setFs(copy);
    try {
      await fetch('/api/fs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
      });
    } catch (_) {
      // Server down? No problem — localStorage already saved
    }
  };

  function findNode(root, id) {
    if (!root) return null;
    if (root.id === id) return root;
    if (!root.children) return null;
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  }

  const actions = {
    find: (id) => findNode(fs, id),

    setCurrent: (id) => {
      const node = findNode(fs, id);
      if (node) {
        setCurrentFolder(node);
        setSelectedItem(node); // important: navigating selects the folder
      }
    },

    select: (id) => {
      const node = findNode(fs, id);
      if (node) setSelectedItem(node);
    },

    open: (id) => {
      const node = findNode(fs, id);
      if (!node) return;
      setSelectedItem(node);
      // UI will handle modal opening for edit/view
    },

    createFolder: (name) => {
  if (!name.trim()) return;
  const newFolder = {
    id: uuid(),
    name: name.trim(),
    type: 'folder',
    children: [],
    opened: false,
  };
  saveFs((root) => {
    const target = findNode(root, currentFolder.id) || root;
    if (!target.children) target.children = [];
    target.children.push(newFolder);
  });
},

   createTextFile: (name) => {
  if (!name.trim()) return;
  const finalName = name.trim().endsWith('.txt') ? name.trim() : `${name.trim()}.txt`;
  const newFile = {
    id: uuid(),
    name: finalName,
    type: 'file',
    fileType: 'text',
    content: '',
  };
  saveFs((root) => {
    const target = findNode(root, currentFolder.id) || root;
    if (!target.children) target.children = [];
    target.children.push(newFile);
  });
},

   uploadFile: (rawFile) => {
  if (!rawFile || !rawFile.type.startsWith('image/')) {
    alert('Please upload a valid image');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const newFile = {
      id: uuid(),
      name: rawFile.name,
      type: 'file',
      fileType: 'image',
      content: e.target.result,
      size: rawFile.size,
    };
    saveFs((root) => {
      const target = findNode(root, currentFolder.id) || root;
      if (!target.children) target.children = [];
      target.children.push(newFile);
    });
  };
  reader.readAsDataURL(rawFile);
},

    renameItem: (id, newName) => {
      if (!id || !newName) return;
      saveFs((root) => {
        const walk = (node) => {
          if (node.id === id) {
            node.name = newName;
            return true;
          }
          if (node.children) {
            for (const c of node.children) if (walk(c)) return true;
          }
          return false;
        };
        walk(root);
      });
    },

    deleteItem: (id) => {
      if (!id) return;
      saveFs((root) => {
        const remove = (node, targetId) => {
          if (!node.children) return false;
          const idx = node.children.findIndex((c) => c.id === targetId);
          if (idx !== -1) {
            node.children.splice(idx, 1);
            return true;
          }
          for (const c of node.children) {
            if (remove(c, targetId)) return true;
          }
          return false;
        };
        remove(root, id);
      });
      setSelectedItem(null);
      if (currentFolder.id === id) {
        setCurrentFolder(findNode(fs, 'root') || fs);
      }
    },

    saveFile: (id, content) => {
      if (!id) return;
      saveFs((root) => {
        const walk = (node) => {
          if (node.id === id) {
            node.content = content;
            return true;
          }
          if (node.children) {
            for (const c of node.children) if (walk(c)) return true;
          }
          return false;
        };
        walk(root);
      });
    },

    toggleOpen: (id) => {
      saveFs((root) => {
        const walk = (node) => {
          if (node.id === id) {
            node.opened = !node.opened;
            return true;
          }
          if (node.children) {
            for (const c of node.children) if (walk(c)) return true;
          }
          return false;
        };
        walk(root);
      });
    },
  };

  return {
    fs,
    currentFolder,
    selectedItem,
    actions,
  };
}