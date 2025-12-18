"use client";

import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import toast from 'react-hot-toast';

export default function FileCard({ item, onClick, onDoubleClick, isSelected, onRename, onDelete }) {
  return (
    <div
      className={`group flex flex-col items-center py-6  px-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
        }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="relative w-full">
        <div className="absolute -top-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onRename}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="text-6xl mb-4 text-gray-600">
        {item.type === 'folder' ? '📁' :
          item.fileType === 'image' ? '🖼️' :
            item.fileType === 'text' ? '📄' : '📄'}
      </div>

      <div className="text-sm font-medium text-gray-800 text-center break-all" title={item.name}>
        {item.name}
      </div>
      {item.type === 'folder' ? (
        <div className="text-xs text-gray-500 mt-1">Folder</div>
      ) : (
        <div className="text-xs text-gray-500 mt-1">
          {item.fileType === 'image' ? 'IMAGE' : item.fileType === 'text' ? 'TEXT' : 'FILE'}
        </div>
      )}
    </div>
  );
}