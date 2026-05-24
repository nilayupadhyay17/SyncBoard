import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBoards } from "@/features/board/boardSlice";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { setSelectedBoard } from "@/features/board/boardSlice";
function BoardList({ setModelOpen }) {
  const dispatch = useDispatch();

  const { boards, loading, error, selectedBoard } = useSelector(
    (state) => state.board
  );
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.$id) {
      dispatch(getBoards(user.$id));
    }
  }, [dispatch, user?.$id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">Failed to load boards.</div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
          Boards
        </h2>
      </div>

      {/* Board List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {boards?.rows?.length > 0 ? (
          boards.rows.map((board) => (
            <Button
              onClick={() =>
                dispatch(
                  setSelectedBoard({
                    ...board,
                  })
                )
              }
              key={board.$id}
              variant={selectedBoard?.$id === board.$id ? "secondary" : "ghost"}
              className={`w-full justify-start font-normal text-sm ${selectedBoard?.$id === board.$id ? "bg-secondary" : ""
                }`}
            >
              {board.name}
            </Button>
          ))
        ) : (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            No boards yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t">
        <Button
          onClick={() => setModelOpen(true)}
          variant="outline"
          className="w-full text-sm"
        >
          + Create Board
        </Button>
      </div>
    </div>
  );
}

export default BoardList;
