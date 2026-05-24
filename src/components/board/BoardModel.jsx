import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBoardThunk } from "@/features/board/boardSlice";
import toast from "react-hot-toast";

function BoardModel({ isOpen = false, setIsOpen }) {
  const user = useSelector((state) => state.auth.user);
  const { loading } = useSelector((state) => state.board);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  function handleInputChange(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleCreateSubmit(event) {
    event.preventDefault();
    console.log(formData);

    if (formData.name === "" || formData.description === "") return;

    await dispatch(
      createBoardThunk({ data: formData, ownerId: user.$id })
    ).unwrap();

    toast.success("Board created successfully !", { id: "board-created" });

    setIsOpen(false);

    setFormData({
      name: "",
      description: "",
    }); 
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Board
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a board to organize tasks, ideas, or workflows.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleCreateSubmit} className="mt-6 space-y-5">
          {/* Board Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Board Name</Label>
            <Input
              onChange={handleInputChange}
              value={formData.name}
              name="name"
              id="name"
              placeholder="e.g. Product Roadmap"
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              onChange={handleInputChange}
              value={formData.description}
              name="description"
              id="description"
              placeholder="Briefly describe this board..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit" className="px-6">
              {loading ? "Creating..." : "Create Board"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default BoardModel;
