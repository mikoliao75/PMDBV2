"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data";
import { Package, Plus, Pencil, Trash2 } from "lucide-react";

type ProjectStatusTableProps = {
  projects: Project[];
  onAddNew: () => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onSelectProject: (project: Project) => void;
};

const statusClasses: { [key in Project["status"]]: string } = {
    "進行中": "bg-accent shadow-[0_0_12px_2px] shadow-accent",
    "有風險": "bg-amber-500 shadow-[0_0_12px_2px] shadow-amber-500",
    "已延遲": "bg-destructive shadow-[0_0_12px_2px] shadow-destructive",
}

// Component to defer date formatting to the client-side to prevent hydration mismatch.
const ClientFormattedDate = ({ dateString }: { dateString: string }) => {
    const [formatted, setFormatted] = useState('');
    
    useEffect(() => {
        // The `toLocaleDateString` can produce different results on server and client
        // based on their respective locales. We run it only on the client inside
        // useEffect to avoid a hydration mismatch.
        // The date string 'YYYY-MM-DD' is parsed as UTC, so we create a new Date
        // from its UTC parts to ensure it's rendered in the user's local timezone correctly.
        const date = new Date(dateString);
        const correctedDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        setFormatted(correctedDate.toLocaleDateString( 'zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric' }));
    }, [dateString]);
    
    // Return empty on server, then the formatted date on client.
    return <>{formatted}</>;
};


export function ProjectStatusTable({ projects, onAddNew, onEdit, onDelete, onSelectProject }: ProjectStatusTableProps) {
  return (
    <Card className="shadow-primary/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
            <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                專案狀態快覽
            </CardTitle>
            <CardDescription>
                所有進行中專案的即時狀態與關鍵指令。
            </CardDescription>
        </div>
        <Button size="sm" onClick={onAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            新增專案
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">燈號</TableHead>
              <TableHead>專案名稱</TableHead>
              <TableHead className="hidden lg:table-cell">最新指令</TableHead>
              <TableHead className="hidden sm:table-cell">負責人</TableHead>
              <TableHead>預計完工日</TableHead>
              <TableHead className="text-right w-[120px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="text-center">
                    <div className={cn("h-3 w-3 rounded-full mx-auto animate-pulse", statusClasses[project.status])} />
                </TableCell>
                <TableCell>
                  <Button variant="link" className="p-0 h-auto font-medium" onClick={() => onSelectProject(project)}>
                    {project.name}
                  </Button>
                  <div className="text-sm text-muted-foreground md:hidden">{project.manager}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{project.latestDirective || 'N/A'}</TableCell>
                <TableCell className="hidden sm:table-cell">{project.manager}</TableCell>
                <TableCell>
                    <ClientFormattedDate dateString={project.endDate} />
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(project.id)}>
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
