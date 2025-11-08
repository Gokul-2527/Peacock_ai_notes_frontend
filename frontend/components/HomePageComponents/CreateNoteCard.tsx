import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface CreateNoteCardProps {
  onSave: (note: { title: string; content: string }) => Promise<void> | void;
  initialTitle?: string;
  initialContent?: string;
  editingNote?: boolean;
}

export default function CreateNoteCard({
  onSave,
  initialTitle = "",
  initialContent = "",
  editingNote = false,
}: CreateNoteCardProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content cannot be empty!");
      return;
    }

    setSaving(true);
    try {
      await onSave({ title: title.trim(), content: content.trim() });
      toast.success(editingNote ? "Note updated!" : "Note added!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mb-6 shadow-md rounded-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {editingNote ? "Edit Note" : "Create New Note"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-gray-300 focus:border-[#CC0001] focus:ring-[#CC0001]"
        />
        <Textarea
          placeholder="Write your note here..."
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-gray-300 focus:border-[#CC0001] focus:ring-[#CC0001]"
        />
        <Button
          onClick={handleSave}
          disabled={saving}
          className={`w-fit px-4 py-1 rounded-md cursor-pointer text-white ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#CC0001] hover:bg-[#a80000] transition"
          }`}
        >
          {saving ? "Saving..." : editingNote ? "Update Note" : "Add Note"}
        </Button>
      </CardContent>
    </Card>
  );
}
