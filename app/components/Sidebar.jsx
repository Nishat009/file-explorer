import FileTree from "./FileTree";

export default function Sidebar({ fs, currentFolder, actions, onOpenFile }) {
  return (
    <div className="w-64 bg-gray-900 text-gray-100 p-6 overflow-y-auto border-r border-gray-800">
      <h3 className="text-lg font-semibold mb-6 text-white">Files</h3>
      <div className="space-y-1">
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors ${
            currentFolder?.id === fs.id ? 'bg-gray-800' : ''
          }`}
          onClick={() => actions.setCurrent(fs.id)}
        >
          <span className="text-2xl">📁</span>
          <span className="font-medium">{fs.name}</span>
        </div>
        {(fs.children || []).map((child) => (
          <FileTree
            key={child.id}
            node={child}
            actions={actions}
            depth={1}
            
          />
        ))}
      </div>
    </div>
  );
}