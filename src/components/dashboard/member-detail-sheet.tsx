"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/lib/data";
import { ListTodo } from "lucide-react";
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from "../ui/badge";

type MemberDetailSheetProps = {
  memberName: string | null;
  projects: Project[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MemberDetailSheet({ memberName, projects, open, onOpenChange }: MemberDetailSheetProps) {
  if (!memberName) return null;

  const memberProjects = projects.filter(p => p.manager === memberName);
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full p-0">
        <ScrollArea className="h-full">
            <div className="p-6">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl">{memberName} 的工作負載</SheetTitle>
                    <SheetDescription>
                        目前負責 {memberProjects.length} 個專案。
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ListTodo />負責專案列表</h3>
                        <div className="space-y-4">
                        {memberProjects.length > 0 ? memberProjects.map(project => (
                            <div key={project.id} className="p-4 rounded-lg border bg-card/50">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium">{project.name}</p>
                                    {project.isBossOrder && <Badge variant="destructive" className="shadow-none">老闆插單</Badge>}
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-muted-foreground">進度</span>
                                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground text-center py-4">目前沒有分配任何專案。</p>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
