import { useState } from "react";

export default function FileTree({ node, actions, depth = 0 }) {
  const [opened, setOpened] = useState(node.opened || false);

  // Hide files in the tree – only folders
  if (node.type !== 'folder') return null;

  const handleToggle = () => {
    setOpened(!opened);
    actions.toggleOpen(node.id);
    actions.setCurrent(node.id); // clicking a folder navigates + selects
  };

  return (
    <div className={`${depth > 0 ? 'ml-6' : ''}`}>
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
        onClick={handleToggle}
      >
        <span className="text-2xl">
          {opened ? '📂' : '📁'}
        </span>
        <span className="text-sm font-medium">{node.name}</span>
      </div>

      {opened && node.children?.length > 0 && (
        <div className="mt-1">
          {node.children.map((child) => (
            <FileTree key={child.id} node={child} actions={actions} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}