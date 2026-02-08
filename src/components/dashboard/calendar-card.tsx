"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CalendarEvent } from "@/lib/data";
import { Briefcase, Calendar as CalendarIcon, Plane, Users, Plus } from "lucide-react";
import { Button } from "../ui/button";


type CalendarCardProps = {
  events: CalendarEvent[];
  onAddNew: () => void;
};

const EventIcon = ({ type }: { type: CalendarEvent["type"] }) => {
  const commonClasses = "h-8 w-8 p-2 rounded-full";
  if (type === "business") {
    return (
      <div className={`bg-primary/10 text-primary ${commonClasses}`}>
        <Briefcase className="h-4 w-4" />
      </div>
    );
  }
  if (type === "meeting") {
    return (
      <div className={`bg-purple-500/10 text-purple-500 ${commonClasses}`}>
        <Users className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className={`bg-accent/10 text-accent ${commonClasses}`}>
      <Plane className="h-4 w-4" />
    </div>
  );
};

export default function CalendarCard({ events, onAddNew }: CalendarCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarIcon className="h-5 w-5" />
          近期行程
        </CardTitle>
         <Button size="sm" variant="outline" onClick={onAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            新增行程
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {events.map((event) => (
          <div key={event.title} className="flex items-center gap-4">
            <EventIcon type={event.type} />
            <div className="grid gap-1">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">
                {event.date} &middot; {event.location}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
