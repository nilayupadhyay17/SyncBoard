import { getListsThunk, createListThunk } from "@/features/list/listSlice";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../ui/spinner";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import ListItem from "./ListItem";
import { Input } from "../ui/input";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { moveTask, updateTaskThunk } from "@/features/task/taskSlice";
import TaskCard from "../task/TaskCard";
import { createPortal } from "react-dom";

function List() {
  const { lists, loading, error } = useSelector((state) => state.list);
  const tasks = useSelector((state) => state.task.tasks);
  const dispatch = useDispatch();
  const selectedBoard = useSelector((state) => state.board.selectedBoard);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [originalListId, setOriginalListId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    if (selectedBoard) {
      dispatch(getListsThunk(selectedBoard.$id));
    }
  }, [selectedBoard, dispatch]);

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    await dispatch(
      createListThunk({
        title: newListTitle,
        boardId: selectedBoard.$id,
      })
    );
    setNewListTitle("");
    setIsAddingList(false);
  };

  const findContainer = (id) => {
    if (tasks[id]) return id;
    return Object.keys(tasks).find((key) =>
      tasks[key].find((t) => t.$id === id)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const { task } = active.data.current;
    setActiveTask(task);
    setOriginalListId(findContainer(active.id));
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer =
      over.data.current?.type === "List"
        ? over.id
        : findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    // Move task to new container in Redux state (optimistic)
    // We need to calculate indices
    const activeItems = tasks[activeContainer];
    const overItems = tasks[overContainer] || [];

    const activeIndex = activeItems.findIndex((t) => t.$id === activeId);
    const overIndex =
      over.data.current?.type === "List"
        ? overItems.length + 1
        : overItems.findIndex((t) => t.$id === overId);

    let newIndex;
    if (over.data.current?.type === "List") {
      newIndex = overItems.length;
    } else {
      const isBelowOverItem =
        over &&
        active.rect.current.translated &&
        active.rect.current.translated.top >
        over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;
      newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    }

    dispatch(
      moveTask({
        sourceListId: activeContainer,
        destListId: overContainer,
        sourceIndex: activeIndex,
        destIndex: newIndex,
      })
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const { task } = active.data.current;
    setActiveTask(null);
    setOriginalListId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer =
      over.data.current?.type === "List"
        ? over.id
        : findContainer(over.id);

    if (activeContainer && overContainer) {
      const activeItems = tasks[activeContainer];
      const overItems = tasks[overContainer] || [];

      const activeIndex = activeItems.findIndex((t) => t.$id === active.id);
      const overIndex = overItems.findIndex((t) => t.$id === over.id);

      // Check if task moved to a different list
      if (originalListId && originalListId !== overContainer) {
        dispatch(
          updateTaskThunk({ taskId: task.$id, data: { listId: overContainer } })
        );
      } else if (activeIndex !== overIndex) {
        // Reorder in same list
        dispatch(
          moveTask({
            sourceListId: activeContainer,
            destListId: overContainer,
            sourceIndex: activeIndex,
            destIndex: overIndex,
          })
        );
      }
    }
  };

  if (loading && !lists) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Spinner />
      </div>
    );
  }

  if (!selectedBoard) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a board to view its lists
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col">
        {error && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Board Lists */}
        <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
          {lists?.rows?.map((list) => (
            <ListItem key={list.$id} list={list} />
          ))}

          {/* Add List Button */}
          <div className="w-80 shrink-0">
            {isAddingList ? (
              <div className="rounded-xl bg-muted/40 p-3 border border-border">
                <Input
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                  className="mb-2 bg-background"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                    if (e.key === "Escape") setIsAddingList(false);
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddList}>
                    Add List
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsAddingList(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start bg-muted/40 hover:bg-muted/60 h-12 border-dashed"
                onClick={() => setIsAddingList(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add another list
              </Button>
            )}
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  );
}

export default List;
