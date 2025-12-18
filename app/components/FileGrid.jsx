import FileCard from "./FileCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import toast from 'react-hot-toast';

export default function FileGrid({ items, onItemClick, onItemDoubleClick, selectedItem, view = 'grid', setModalConfig }) {
  const handleRename = (item) => {
    if (!item) return toast.error('Item not found');
    setModalConfig({ mode: 'rename', item });
  };

  const handleDelete = (item) => {
    if (!item) return toast.error('Item not found');
    setModalConfig({ mode: 'delete', item });
  };

  if (view === 'list') {
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${selectedItem?.id === item.id ? 'bg-blue-50' : ''
              }`}
            onClick={() => onItemClick(item.id)}
            onDoubleClick={() => onItemDoubleClick(item.id)}
          >
            <div className="text-3xl">
              {item.type === 'folder' ? '📁' :
                item.fileType === 'image' ? '🖼️' :
                  item.fileType === 'text' ? '📄' : '📄'}
            </div>

            <div className="flex-1">
              <div className="font-medium text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-500">
                {item.type === 'folder'
                  ? 'Folder'
                  : item.fileType === 'image'
                    ? 'IMAGE'
                    : item.fileType === 'text'
                      ? 'TEXT'
                      : 'FILE'}
              </div>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleRename(item)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {items.map((item) => (
        <FileCard
          key={item.id}
          item={item}
          onClick={() => onItemClick(item.id)}
          onDoubleClick={() => onItemDoubleClick(item.id)}
          isSelected={selectedItem?.id === item.id}
          onRename={() => handleRename(item)}
          onDelete={() => handleDelete(item)}
        />
      ))}
    </div>
  );
}