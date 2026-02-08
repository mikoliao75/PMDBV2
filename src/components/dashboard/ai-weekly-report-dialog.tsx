
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useCollection } from "@/firebase/firestore/use-collection";
import type { Project, Member, Assignment } from "@/lib/types";
import { Typewriter } from "@/components/ui/typewriter";

export function AIWeeklyReportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState("");
  const { toast } = useToast();
  const db = useFirestore();

  // Data fetching hooks
  const { data: projects } = useCollection<Project>(
    db ? collection(db, "projects") : null
  );
  const { data: members } = useCollection<Member>(
    db ? collection(db, "users") : null
  );
  const { data: assignments } = useCollection<Assignment>(
    db ? collection(db, "assignments") : null
  );

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReport("");

    // 1. Data Injection Logic
    const redLightProjects =
      projects?.filter((p) => p.status === "已延遲") || [];
    const yellowLightProjects =
      projects?.filter((p) => p.status === "有風險") || [];
    const bossOrders =
      assignments?.filter((a) => a.isBossOrder) || [];
    const memberWorkload =
      members?.map((m) => ({
        name: m.name,
        workload: m.workload,
      })) || [];

    const schedule = [
      { date: "2/9-2/12", event: "台北出差" },
      { date: "3/25-3/29", event: "新加坡旅遊" },
    ];

    const firestoreData = {
      redLightProjects,
      yellowLightProjects,
      bossOrders,
      memberWorkload,
      schedule,
    };

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(firestoreData),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();
      setReport(result.report);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "生成失敗",
        description: "無法生成週報，請稍後再試。",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    toast({
      title: "已複製",
      description: "週報內容已成功複製到剪貼簿。",
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
        <Sparkles className="h-4 w-4 mr-2" />
        生成週報
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>AI 週報生成</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none h-[400px] overflow-y-auto">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-lg font-semibold">AI 正在努力撰寫中...</p>
                  <p className="text-sm text-muted-foreground">請稍候片刻</p>
                </div>
              </div>
            ) : report ? (
              <Typewriter text={report} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>點擊下方按鈕開始生成您的週報。</p>
              </div>
            )}
          </div>
          <DialogFooter>
            {report && !isGenerating && (
              <Button onClick={handleCopy}>一鍵複製</Button>
            )}
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? "生成中..." : "重新生成"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
