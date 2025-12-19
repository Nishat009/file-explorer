import FileCard from "./FileCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import toast from 'react-hot-toast';

export default function FileGrid({ items, onItemClick, selectedItem, view = 'grid', setModalConfig }) {
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
      <div className="space-y-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0 ${
              selectedItem?.id === item.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => onItemClick(item.id)}
          >
            <div className="text-3xl shrink-0">
              {item.type === 'folder' ? '📁' :
                item.fileType === 'image' ? '🖼️' :
                  item.fileType === 'text' ? '📄' : '📄'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">{item.name}</div>
              <div className="text-sm text-gray-500 font-medium">
                {item.type === 'folder'
                  ? 'Folder'
                  : item.fileType === 'image'
                    ? 'Image File'
                    : item.fileType === 'text'
                      ? 'Text File'
                      : 'File'}
              </div>
            </div>
            <div className="flex items-center shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-200">
                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => handleRename(item)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600 cursor-pointer focus:text-red-600">
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6">
      {items.map((item) => (
        <FileCard
          key={item.id}
          item={item}
          onClick={() => onItemClick(item.id)}
          isSelected={selectedItem?.id === item.id}
          onRename={() => handleRename(item)}
          onDelete={() => handleDelete(item)}
        />
      ))}
    </div>
  );
}