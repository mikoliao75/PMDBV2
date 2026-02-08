
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
// Correct: Import the new hook
import { useAuthGuard } from "@/firebase/auth/use-user"; 
import type { Project, User, Comment as CommentType } from "@/lib/types";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useState, useEffect }from "react";
import { toast } from "@/hooks/use-toast";

interface ProjectDetailSheetProps {
  project: Project | null;
  users: User[];
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailSheet({ project, users, isOpen, onClose }: ProjectDetailSheetProps) {
  // Correct: Use the new hook to get the currently logged-in user
  const { currentUser } = useAuthGuard(); 
  const [newComment, setNewComment] = useState("");
  // Use an effect to update progress when the project changes
  const [progress, setProgress] = useState(project?.progress || 0);
  useEffect(() => {
    setProgress(project?.progress || 0);
  }, [project]);


  const assignee = users.find(u => u.id === project?.assigneeId);

  // Correct: Use currentUser for authorization checks
  const canEdit = currentUser?.role === 'Manager' || currentUser?.id === project?.assigneeId;

  const handleProgressChange = async (newProgress: number[]) => {
    if (!project || !canEdit) return;
    const finalProgress = newProgress[0];
    setProgress(finalProgress);
    const projectRef = doc(db, "projects", project.id);
    try {
      await updateDoc(projectRef, { progress: finalProgress });
      toast({ title: "Success", description: "Project progress updated." });
    } catch (error) {
      console.error("Error updating progress: ", error);
      toast({ title: "Error", description: "Failed to update progress.", variant: "destructive" });
    }
  };
  
  const handleAddComment = async () => {
    // Correct: Use currentUser to add the comment
    if (!project || !currentUser || newComment.trim() === "") return;

    const comment: CommentType = {
      id: `COMMENT-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name || "Unknown User",
      timestamp: Timestamp.now(),
      text: newComment,
    };

    const projectRef = doc(db, "projects", project.id);
    try {
      await updateDoc(projectRef, {
        comments: arrayUnion(comment)
      });
      setNewComment("");
      toast({ title: "Success", description: "Comment added." });
    } catch (error) {
      console.error("Error adding comment: ", error);
      toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{project?.name}</SheetTitle>
          <SheetDescription>
            {project?.status} - Due by {project?.endDate}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-6">
          {assignee && (
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={assignee.avatarUrl} />
                <AvatarFallback>{assignee.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{assignee.name}</p>
                <p className="text-sm text-muted-foreground">Assignee</p>
              </div>
            </div>
          )}
          
          <div>
            <h4 className="font-medium mb-2">Progress</h4>
            <div className="flex items-center gap-4">
              <Slider
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                onValueCommit={handleProgressChange}
                max={100}
                step={1}
                disabled={!canEdit}
              />
              <span className="font-semibold">{progress}%</span>
            </div>
          </div>
          
          <Separator />

          <div>
            <h4 className="font-medium mb-2">Comments</h4>
            <div className="space-y-4">
              {/* Correct: Use currentUser for the avatar */}
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Textarea 
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)} 
                />
              </div>
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>Add Comment</Button>
              
              <div className="space-y-4 pt-4">
                {project?.comments && [...project.comments].sort((a, b) => b.timestamp.seconds - a.timestamp.seconds).map(comment => {
                   const commentUser = users.find(u => u.id === comment.userId);
                   return (
                    <div key={comment.id} className="flex gap-3 text-sm">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={commentUser?.avatarUrl} />
                        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-semibold">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
                        </span>
                        <p className="mt-1">{comment.text}</p>
                      </div>
                    </div>
                   )
                })}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
