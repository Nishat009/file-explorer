import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FileTree({ node, actions, depth = 0 }) {
  const router = useRouter();
  const [opened, setOpened] = useState(node.opened || false);

  const handleClick = () => {
    if (node.type === 'folder') {
      setOpened(!opened);
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

  return (
    <div className={`${depth > 0 ? 'ml-3' : ''}`}>
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors select-none"
        onClick={handleClick}
      >
        {node.type === 'folder' && hasChildren && (
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${opened ? 'rotate-90' : ''}`}
          />
        )}
        {/* Add empty space if no chevron to align icons */}
        {node.type !== 'folder' || !hasChildren && <span className="w-4" />}

        <span className="text-2xl">{getIcon()}</span>
        <span className="text-sm font-medium truncate">{node.name}</span>
      </div>

      {node.type === 'folder' && opened && node.children?.length > 0 && (
        <div className="mt-1">
          {node.children.map((child) => (
            <FileTree
              key={child.id}
              node={child}
              actions={actions}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}