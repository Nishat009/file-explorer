import FileCard from "./FileCard";

export default function FileGrid({ items, onItemClick, onItemDoubleClick, selectedItem, view = 'grid' }) {
  if (view === 'list') {
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${
              selectedItem?.id === item.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onItemClick(item.id)}
            onDoubleClick={() => onItemDoubleClick(item.id)}
          >
            <div className="text-3xl">
              {item.type === 'folder' ? '📁' : item.fileType === 'image' ? '🖼️' : '📄'}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-500">
                {item.type === 'folder' ? 'Folder' : item.fileType.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6  gap-8">
      {items.map((item) => (
        <FileCard
          key={item.id}
          item={item}
          onClick={() => onItemClick(item.id)}
          onDoubleClick={() => onItemDoubleClick(item.id)}
          isSelected={selectedItem?.id === item.id}
        />
      ))}
    </div>
  );
}