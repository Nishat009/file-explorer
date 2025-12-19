"use client";

import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderPlus, FileText, Image, Grid, List } from "lucide-react";

export default function Toolbar({ actions, view, onViewChange, selectedItem, setModalConfig }) {
  const handleCreate = (mode) => {
    setModalConfig({ mode });
  };

  return (
    <div className="ml-10 md:ml-0 flex items-center justify-between mb-6 bg-white rounded-lg p-2 md:p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <span className="font-medium">+ Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => handleCreate('create-folder')} className="cursor-pointer">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreate('create-text')} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              New Text File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreate('upload-image')} className="cursor-pointer">
              <Image className="mr-2 h-4 w-4" />
              Upload Image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid / List View Toggle using shadcn Tabs */}
      <Tabs value={view} onValueChange={onViewChange}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="grid" className="flex items-center gap-2 data-[state=active]:bg-white">
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-white">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}