import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function FileTree({ node, actions, depth = 0 }) {
  const [opened, setOpened] = useState(node.opened || false);

  const handleToggle = () => {
    if (node.type === 'folder') {
      setOpened(!opened);
      actions.toggleOpen(node.id);
      actions.setCurrent(node.id); // clicking a folder navigates + selects
    } else {
      actions.setCurrent(node.id); // clicking a file selects it
    }
  };

  const getIcon = () => {
    if (node.type === 'folder') {
      return opened ? '📂' : '📁';
    } else if (node.fileType === 'image') {
      return '🖼️';
    } else {
      return '📄';
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-3' : ''}`}>
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
        onClick={handleToggle}
      >
        {node.type === 'folder' && node.children && node.children.length > 0 && (
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${opened ? 'rotate-90' : ''}`}
          />
        )}
        <span className="text-2xl">
          {getIcon()}
        </span>
        <span className="text-sm font-medium break-all">{node.name}</span>
      </div>

      {node.type === 'folder' && opened && node.children?.length > 0 && (
        <div className="mt-1 transition-all duration-300 ease-in-out">
          {node.children.map((child) => (
            <FileTree key={child.id} node={child} actions={actions} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}