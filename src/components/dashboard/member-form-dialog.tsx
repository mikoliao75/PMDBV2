
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserManagement, type UserData } from "@/lib/user-management";
import { useEffect, useState } from "react";
import type { User } from "@/lib/types";

interface MemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: User | null;
  onSubmit: (formData: UserData) => Promise<void>;
}

// Define the role type outside of the component to avoid JSX parsing issues
type UserRole = "Manager" | "Member";

export function MemberFormDialog({ isOpen, onClose, member, onSubmit }: MemberFormDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Member");
  const [position, setPosition] = useState("");
  const [weeklyHoursLimit, setWeeklyHoursLimit] = useState(40);

  useEffect(() => {
    if (member) {
      setName(member.name || "");
      setEmail(member.email || "");
      setRole(member.role || "Member");
      setPosition(member.position || "");
      setWeeklyHoursLimit(member.weeklyHoursLimit || 40);
    } else {
      setName("");
      setEmail("");
      setRole("Member");
      setPosition("");
      setWeeklyHoursLimit(40);
    }
  }, [member, isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: UserData = { 
        name, 
        email, 
        role, 
        position, 
        weeklyHoursLimit, 
        // Default values for fields not in the form
        avatarUrl: member?.avatarUrl || `https://i.pravatar.cc/150?u=${email}`,
        projects: member?.projects || [],
        createdAt: member?.createdAt || new Date(), // This might be handled by backend
    };
    await onSubmit(formData);
  };

  // Explicit handler for the Select component
  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
          <DialogDescription>
            {member ? "Update the details of the team member." : "Enter the details of the new team member."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required disabled={!!member} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">Position</Label>
              <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weeklyHoursLimit" className="text-right">Weekly Hours</Label>
              <Input id="weeklyHoursLimit" type="number" value={weeklyHoursLimit} onChange={(e) => setWeeklyHoursLimit(Number(e.target.value))} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
