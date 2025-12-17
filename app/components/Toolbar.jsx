"use client";

import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderPlus, FileText, Image, Grid, List } from "lucide-react";
import toast from 'react-hot-toast';

export default function Toolbar({ actions, view, onViewChange, selectedItem, setModalConfig }) {
  const handleCreate = (mode) => {
    setModalConfig({ mode });
  };

  const handleRename = () => {
    if (!selectedItem) return toast.error('Please select an item to rename.');
    setModalConfig({ mode: 'rename', item: selectedItem });
  };

  const handleDelete = () => {
    if (!selectedItem) return toast.error('Please select an item to delete.');
    setModalConfig({ mode: 'delete', item: selectedItem });
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              <span className="text-lg">+ Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => handleCreate('create-folder')}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreate('create-text')}>
              <FileText className="mr-2 h-4 w-4" />
              New Text File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreate('upload-image')}>
              <Image className="mr-2 h-4 w-4" />
              Upload Image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="secondary" onClick={handleRename}>
          Rename
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      {/* Grid / List View Toggle using shadcn Tabs */}
      <Tabs value={view} onValueChange={onViewChange}>
        <TabsList>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}