import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskDetailModal from "./TaskDetailModal";

function TaskCard({ task, onEdit, onDelete }) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.$id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <>
            <TaskDetailModal
                task={task}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />

            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onClick={() => setIsDetailOpen(true)}
                className="group relative rounded-lg border bg-background p-3 text-sm shadow-sm transition hover:shadow-md cursor-grab active:cursor-grabbing"
            >
                {/* Title */}
                <p className="pr-8 break-words font-medium">{task.title}</p>
                {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                        {task.description}
                    </p>
                )}

                {/* Actions */}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100 bg-background/80 backdrop-blur-sm rounded-md">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start
                            setIsDetailOpen(true);
                        }}
                        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    );
}

export default TaskCard;
