import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { updateTaskThunk, deleteTaskThunk } from "@/features/task/taskSlice";
import { Trash2 } from "lucide-react";

export default function TaskDetailModal({ task, isOpen, onClose }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || "");
        }
    }, [task]);

    const handleSave = () => {
        if (title.trim() === "") return;

        dispatch(
            updateTaskThunk({
                taskId: task.$id,
                data: {
                    title,
                    description,
                },
            })
        );
        onClose();
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            dispatch(deleteTaskThunk(task.$id));
            onClose();
        }
    };

    if (!task) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a more detailed description..."
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleDelete}
                        className="mr-auto"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
