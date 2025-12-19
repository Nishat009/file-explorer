import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FileTree({ node, actions, currentFolderId, depth = 0 }) {
  const router = useRouter();
  const [opened, setOpened] = useState(node.opened || false);

  // Sync opened state with node.opened from parent
  useEffect(() => {
    setOpened(node.opened || false);
  }, [node.opened]);

  const handleClick = () => {
    if (node.type === 'folder') {
      const newOpened = !opened;
      setOpened(newOpened);
      actions.toggleOpen(node.id);
      actions.setCurrent(node.id); // Navigate main view
    } else {
      // File clicked → open in dedicated viewer page
      router.push(`/view/${node.id}`);
    }
  };

  const getIcon = () => {
    if (node.type === 'folder') {
      return opened ? '📂' : '📁';
    } else if (node.fileType === 'image') {
      return '🖼️';
    } else if (node.fileType === 'text') {
      return '📄';
    }
    return '📄';
  };

  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

  const isActive = currentFolderId === node.id;

  return (
    <div className={`${depth > 0 ? 'ml-4' : ''}`}>
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-slate-800/70 cursor-pointer transition-all duration-150 select-none ${
          isActive ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500' : 'text-slate-300'
        }`}
        onClick={handleClick}
      >
        
        {/* Add empty space if no chevron to align icons */}
        {(!node.type === 'folder' || !hasChildren)}

        <span className="text-lg">{getIcon()}</span>
        <span className="text-sm font-medium truncate">{node.name}</span>
        {node.type === 'folder' && hasChildren && (
          <ChevronRight
            size={14}
            className={`absolute right-8 transition-transform duration-200 text-slate-400 ${opened ? 'rotate-90' : ''}`}
          />
        )}
      </div>

      {node.type === 'folder' && opened && node.children?.length > 0 && (
        <div className="mt-0.5 ml-1 border-l border-slate-700/30 pl-2">
          {node.children.map((child) => (
            <FileTree
              key={child.id}
              node={child}
              actions={actions}
              currentFolderId={currentFolderId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}