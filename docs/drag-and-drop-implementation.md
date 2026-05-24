# Drag and Drop Implementation Documentation

This document details the implementation of the drag-and-drop functionality in the MyTrello application. We use the **@dnd-kit** library, a lightweight, performant, and accessible drag-and-drop toolkit for React.

## 1. Technology Stack

-   **Library**: `@dnd-kit/core`, `@dnd-kit/sortable`
-   **State Management**: Redux Toolkit (`taskSlice.js`)
-   **Backend**: Appwrite (Database)

## 2. Core Components

The implementation is primarily contained within two components: `List.jsx` (the container) and `ListItem.jsx` (the droppable list).

### 2.1 `List.jsx` (The Context Provider)
This component wraps the entire board area with the `DndContext`. It manages the drag lifecycle events.

-   **`DndContext`**: The root provider that shares data between draggable and droppable components.
-   **`DragOverlay`**: Renders a visual preview of the item being dragged. It follows the cursor.
-   **`Sensors`**: We use `PointerSensor` with an `activationConstraint` (distance: 10px) to prevent accidental drags when clicking.

### 2.2 `ListItem.jsx` (The Droppable Container)
Each list acts as a droppable container.

-   **`useDroppable`**: Hooks the list into the dnd system. It allows tasks to be dropped onto the list itself (useful when the list is empty).
-   **`SortableContext`**: Wraps the list of tasks. It provides the sorting strategy (`verticalListSortingStrategy`) which calculates positions for reordering.

### 2.3 `TaskCard.jsx` (The Draggable Item)
(Not fully shown in the provided snippets, but implied)
-   **`useSortable`**: Makes the task card draggable. It provides `attributes`, `listeners`, `setNodeRef`, `transform`, and `transition` to control the DOM element.

## 3. Drag Lifecycle & Logic

The logic handles three main stages: Start, Over, and End.

### 3.1 `handleDragStart`
Triggered when the user starts dragging a task.

```javascript
const handleDragStart = (event) => {
  const { active } = event;
  const { task } = active.data.current;
  setActiveTask(task); // Set the task for DragOverlay
  setOriginalListId(findContainer(active.id)); // Track where the task started
};
```
-   **Purpose**: Store the initial state to detect changes later. `originalListId` is crucial for determining if a task moved to a different list.

### 3.2 `handleDragOver`
Triggered continuously as the draggable item moves over other droppable containers.

```javascript
const handleDragOver = (event) => {
  // ... (collision detection logic)

  // Optimistic Update
  dispatch(
    moveTask({
      sourceListId: activeContainer,
      destListId: overContainer,
      sourceIndex: activeIndex,
      destIndex: newIndex,
    })
  );
};
```
-   **Purpose**: Provide immediate visual feedback.
-   **Optimistic UI**: We dispatch `moveTask` to Redux *during* the drag. This updates the local state instantly, making the task appear to "snap" into the new position/list before the user even drops it. This creates a very smooth experience.

### 3.3 `handleDragEnd`
Triggered when the user drops the item.

```javascript
const handleDragEnd = (event) => {
  // ... (cleanup)

  // Persistence Logic
  if (originalListId && originalListId !== overContainer) {
    // Case 1: Task moved to a different list
    dispatch(
      updateTaskThunk({ taskId: task.$id, data: { listId: overContainer } })
    );
  } else if (activeIndex !== overIndex) {
    // Case 2: Task reordered within the same list
    // (Optional: Persist new order if backend supports it)
    dispatch(moveTask(...));
  }
};
```
-   **Purpose**: Persist the changes to the database.
-   **Logic**:
    1.  We compare `originalListId` (captured at start) with `overContainer` (where it was dropped).
    2.  If they are different, we know the task changed lists. We dispatch `updateTaskThunk` to update the `listId` in the database.
    3.  If they are the same, but indices differ, it's a reorder. Currently, we update Redux; backend reordering would be implemented here.

## 4. Helper Functions

### `findContainer(id)`
A utility function to locate which list a task belongs to. It searches the `tasks` object in Redux (where keys are list IDs and values are arrays of tasks).

## 5. Summary of Flow

1.  **User starts drag**: `handleDragStart` records the starting list.
2.  **User moves cursor**: `handleDragOver` calculates the new position and updates Redux *instantly* (visual only).
3.  **User drops**: `handleDragEnd` checks if the list changed. If yes, it calls the API (`updateTaskThunk`) to save the new `listId`.

This approach combines the responsiveness of optimistic UI updates with the reliability of backend persistence.
