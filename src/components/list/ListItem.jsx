import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Plus, Trash2, X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    createTaskThunk,
    deleteTaskThunk,
    getTasksThunk,
    updateTaskThunk,
} from "@/features/task/taskSlice";
import { deleteListThunk, updateListThunk } from "@/features/list/listSlice";
import TaskCard from "../task/TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

function ListItem({ list }) {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.tasks[list.$id] || []);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [isEditingList, setIsEditingList] = useState(false);
    const [listTitle, setListTitle] = useState(list.title);

    const { setNodeRef } = useDroppable({
        id: list.$id,
        data: {
            type: "List",
            list,
        },
    });

    useEffect(() => {
        dispatch(getTasksThunk(list.$id));
    }, [list.$id, dispatch]);

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;
        const order = tasks.length + 1;
        await dispatch(
            createTaskThunk({
                title: newTaskTitle,
                description: newTaskDescription,
                listId: list.$id,
                order: order,
            })
        );
        setNewTaskTitle("");
        setNewTaskDescription("");
        setIsAddingTask(false);
    };

    const handleDeleteList = () => {
        if (confirm("Are you sure you want to delete this list?")) {
            dispatch(deleteListThunk(list.$id));
        }
    };

    const handleUpdateList = () => {
        if (listTitle.trim() !== list.title) {
            dispatch(updateListThunk({ listId: list.$id, data: { title: listTitle } }));
        }
        setIsEditingList(false);
    };

    return (
        <Card className="w-80 shrink-0 rounded-xl bg-muted/40 flex flex-col max-h-full">
            {/* List Header */}
            <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-start justify-between space-y-0">
                {isEditingList ? (
                    <div className="flex gap-2 w-full">
                        <Input
                            value={listTitle}
                            onChange={(e) => setListTitle(e.target.value)}
                            className="h-8 text-sm font-semibold"
                            autoFocus
                            onBlur={handleUpdateList}
                            onKeyDown={(e) => e.key === "Enter" && handleUpdateList()}
                        />
                    </div>
                ) : (
                    <CardTitle
                        className="text-sm font-semibold uppercase tracking-wide cursor-pointer w-full"
                        onClick={() => setIsEditingList(true)}
                    >
                        {list.title}
                    </CardTitle>
                )}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1" align="end">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-destructive hover:text-destructive"
                            onClick={handleDeleteList}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete List
                        </Button>
                    </PopoverContent>
                </Popover>
            </CardHeader>

            {/* Tasks */}
            <CardContent className="space-y-3 flex-1 overflow-y-auto min-h-0 px-4 pb-2">
                <SortableContext
                    items={tasks.map((t) => t.$id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div ref={setNodeRef} className="space-y-3 min-h-[50px]">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.$id}
                                task={task}
                                onEdit={(taskId, data) =>
                                    dispatch(updateTaskThunk({ taskId, data }))
                                }
                                onDelete={(taskId) => dispatch(deleteTaskThunk(taskId))}
                            />
                        ))}
                    </div>
                </SortableContext>

                {isAddingTask ? (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <Input
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Enter task title..."
                            className="mb-2 h-8 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddTask();
                                if (e.key === "Escape") setIsAddingTask(false);
                            }}
                        />
                        <Textarea
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            placeholder="Enter description..."
                            className="mb-2 text-sm min-h-[60px]"
                        />
                        <div className="flex gap-2">
                            <Button size="xs" onClick={handleAddTask} className="h-7 px-2">
                                Add Task
                            </Button>
                            <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => setIsAddingTask(false)}
                                className="h-7 px-2"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => setIsAddingTask(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add a Task
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default ListItem;
