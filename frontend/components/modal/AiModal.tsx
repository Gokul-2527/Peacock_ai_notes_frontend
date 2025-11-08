"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Note {
  _id: string;
  title: string;
  content: string;
  aiSummary?: string;
  aiImprovedContent?: string;
  tags?: string[];
}

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  aiLoading: boolean;
  aiResult: string;
  handleAIAction: (type: "summary" | "improve" | "tags") => void;
}

const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  onClose,
  note,
  aiLoading,
  aiResult,
  handleAIAction,
}) => {
  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
          <DialogDescription className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {note.content}
          </DialogDescription>
        </DialogHeader>

        {/* AI Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Button
            className="cursor-pointer"
            disabled={aiLoading}
            onClick={() => handleAIAction("summary")}
          >
            🧠 Generate Summary
          </Button>
          <Button
            className="cursor-pointer"
            disabled={aiLoading}
            onClick={() => handleAIAction("improve")}
          >
            ✨ Improve Note
          </Button>
          <Button
            className="cursor-pointer"
            disabled={aiLoading}
            onClick={() => handleAIAction("tags")}
          >
            🏷️ Generate Tags
          </Button>
        </div>

        {aiLoading && (
          <p className="mt-4 text-sm text-gray-500 animate-pulse">
            AI is thinking...
          </p>
        )}

        {/* AI Results */}
        <div className="mt-5 space-y-4">
          {note.aiSummary && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <h3 className="font-semibold text-sm mb-1">🧠 Summary</h3>
              <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {note.aiSummary}
              </p>
            </div>
          )}

          {note.aiImprovedContent && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <h3 className="font-semibold text-sm mb-1">
                ✨ Improved Version
              </h3>
              <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {note.aiImprovedContent}
              </p>
            </div>
          )}

          {note.tags && note.tags.length > 0 && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <h3 className="font-semibold text-sm mb-1">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {aiResult && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <h3 className="font-semibold text-sm mb-1">💡 New AI Result</h3>
              <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {aiResult}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIModal;
