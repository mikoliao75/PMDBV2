import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Assignment } from "@/lib/data";
import { ArrowUpDown, ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { GoogleLogoIcon } from "../icons/google-logo";

type AssignmentsListProps = {
  assignments: Assignment[];
  onSync: () => void;
  onAddNew: () => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
};

const statusVariant: { [key in Assignment["status"]]: "default" | "secondary" | "outline" } = {
  "已完成": "default",
  "進行中": "secondary",
  "未開始": "outline",
};


export function AssignmentsList({ assignments, onSync, onAddNew, onEdit, onDelete }: AssignmentsListProps) {
  return (
    <Card className="shadow-primary/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
            <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                主管交辦
            </CardTitle>
          <CardDescription>
            高層主管指派的高優先度任務。
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Button size="sm" onClick={onAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                新增交辦
            </Button>
            <Button size="sm" variant="outline" onClick={onSync}>
                <GoogleLogoIcon className="mr-2 h-4 w-4" />
                同步 Google 日曆
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任務</TableHead>
              <TableHead className="hidden sm:table-cell">
                <Button variant="ghost" size="sm" className="-ml-4 h-8">
                    指派者 <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button variant="ghost" size="sm" className="-ml-4 h-8">
                    截止日期 <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>狀態</TableHead>
              <TableHead className="text-right w-[120px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>
                  <div className="font-medium">{assignment.task}</div>
                  <div className="text-sm text-muted-foreground md:hidden">{assignment.dueDate}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{assignment.assignedBy}</TableCell>
                <TableCell className="hidden md:table-cell">{assignment.dueDate}</TableCell>
                <TableCell>
                    <Badge variant={statusVariant[assignment.status]} className="capitalize">{assignment.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(assignment)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(assignment.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
