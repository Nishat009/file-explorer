"use client";

import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import toast from 'react-hot-toast';

export default function FileCard({ item, onClick, isSelected, onRename, onDelete }) {
  return (
    <div
      className={`group flex flex-col items-center py-6 px-4 bg-white border rounded-md shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer ${
        isSelected ? 'border-blue-500 shadow-lg bg-blue-50/30' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="relative w-full">
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1.5 bg-white shadow-md hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onRename} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600 cursor-pointer focus:text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="text-6xl mb-3 text-gray-700 filter drop-shadow-sm">
        {item.type === 'folder' ? '📁' :
          item.fileType === 'image' ? '🖼️' :
            item.fileType === 'text' ? '📄' : '📄'}
      </div>

      <div className="text-sm font-semibold text-gray-900 text-center break-all px-2" title={item.name}>
        {item.name}
      </div>
      {item.type === 'folder' ? (
        <div className="text-xs text-gray-500 mt-1 font-medium">Folder</div>
      ) : (
        <div className="text-xs text-gray-500 mt-1 font-medium tracking-wide">
          {item.fileType === 'image' ? 'Image' : item.fileType === 'text' ? 'Text File' : 'File'}
        </div>
      )}
    </div>
  );
}