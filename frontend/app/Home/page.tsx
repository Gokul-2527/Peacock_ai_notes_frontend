"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import axiosInstance from "@/envfile/axiosSetup";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import { useSearch } from "@/context/HeaderSearch";
import Image from "next/image";
import DeleteDialog from "@/components/modal/DeleteModal";
import AIModal from "@/components/modal/AiModal";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  aiSummary?: string;
  aiImprovedContent?: string;
  tags?: string[];
}

export default function NotesPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [token, setToken] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string>("");
  const { search } = useSearch();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axiosInstance.get(`${api}/notes/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
        setFilteredNotes(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredNotes(notes);
    } else {
      const lower = search.toLowerCase();
      setFilteredNotes(
        notes.filter(
          (note) =>
            note.title?.toLowerCase().includes(lower) ||
            note.content?.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, notes]);

  useEffect(() => {
    const jwtToken = getCookie("jwtToken") as string | undefined;
    if (jwtToken) {
      setToken(jwtToken);
      fetchNotes(jwtToken);
    }
  }, []);

  const fetchNotes = async (jwtToken: string) => {
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const res = await axiosInstance.get(`${api}/notes/get`, { headers });
      setNotes(res.data);
    } catch (error) {
      toast.error("Failed to fetch notes");
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { title, content };

      if (editingNote) {
        await axiosInstance.put(
          `${api}/notes/update/${editingNote._id}`,
          body,
          { headers }
        );
        toast.success("Note updated successfully!");
      } else {
        await axiosInstance.post(`${api}/notes/create`, body, { headers });
        toast.success("Note created successfully!");
      }

      setTitle("");
      setContent("");
      setEditingNote(null);
      fetchNotes(token);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save note");
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axiosInstance.delete(`${api}/notes/delete/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Note deleted!");
      setIsDialogOpen(false);
      fetchNotes(token);
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setAiResult("");
  };

  const closeAIModal = () => {
    setSelectedNote(null);
    setAiResult("");
  };

  const handleAIAction = async (type: "summary" | "improve" | "tags") => {
    if (!selectedNote) {
      toast.error("No note selected");
      return;
    }

    const noteId = selectedNote._id;
    if (!noteId) {
      toast.error("Invalid note ID");
      return;
    }

    if (!selectedNote.content || selectedNote.content.trim() === "") {
      toast.error("Note content is empty");
      return;
    }

    setAiLoading(true);
    setAiResult("");

    try {
      const endpoint = `${api}/api/ai/${type}/${noteId}`;
      const res = await axiosInstance.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let updatedNote = { ...selectedNote };

      if (type === "summary" && res.data.summary) {
        setAiResult(`🧠 Summary:\n${res.data.summary}`);
        updatedNote.aiSummary = res.data.summary;
      } else if (type === "improve" && res.data.improved) {
        setAiResult(`✨ Improved Version:\n${res.data.improved}`);
        updatedNote.aiImprovedContent = res.data.improved;
      } else if (type === "tags" && res.data.tags) {
        setAiResult(`🏷️ Tags:\n${res.data.tags.join(", ")}`);
        updatedNote.tags = res.data.tags;
      } else {
        setAiResult("⚠️ No AI output received.");
      }

      setSelectedNote(updatedNote);

      setNotes((prevNotes) =>
        prevNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
      );

      toast.success(`AI ${type} generated successfully!`);
    } catch (error: any) {
      console.error("AI API Error:", error.response?.data || error.message);
      toast.error(`Failed to generate AI ${type}`);
    } finally {
      setAiLoading(false);
    }
  };
  const notesToDisplay = filteredNotes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#212121]">
      <Header />

      <div className="max-w-4xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingNote ? "Edit Note" : "Create New Note"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Write your note here..."
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleSave} className="gradient-border-btn w-fit cursor-pointer">
              {editingNote ? "Update Note" : "Add Note"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {notesToDisplay.map((note) => (
            <Card
              key={note._id}
              className="relative cursor-pointer dark:hover:shadow-white ease-in-out hover:shadow-[#4b97da] hover:shadow-md transition-all"
              onClick={() => handleNoteClick(note)}
            >
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {note.content}
                </p>
                <div className="flex justify-end gap-3 mt-4">
                  <Button className="cursor-pointer"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(note);
                    }}
                  >
                    Edit
                  </Button>
                  <Button className="cursor-pointer"
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(note._id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {notesToDisplay.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full mt-10 p-6 bg-gray-100 dark:bg-[#262626] rounded-lg shadow-md">
            <Image
              src={require("../../assests/no-data-found.png")}
              alt="no data found"
              width={100}
              height={100}
            />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No Notes Found
            </h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
              You don't have any notes yet. Start by creating a new note!
            </p>
          </div>
        )}
      </div>

      <AIModal
        isOpen={!!selectedNote}
        onClose={closeAIModal}
        note={selectedNote}
        aiLoading={aiLoading}
        aiResult={aiResult}
        handleAIAction={handleAIAction}
      />

      <DeleteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
