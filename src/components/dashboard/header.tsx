
import type { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { NotificationBell } from "@/components/ui/notification-bell";
import { AIWeeklyReportDialog } from "./ai-weekly-report-dialog";
// Import the new hook
import { useAuthGuard } from "@/firebase/auth/use-user";

interface HeaderProps {
  user: User; // User is guaranteed to be non-null when this component is rendered
  onSwitchView: (view: 'dashboard' | 'team') => void;
  notificationCount: number;
}

export default function Header({ user, onSwitchView, notificationCount }: HeaderProps) {
  // Get the signOut function from the new hook
  const { signOut } = useAuthGuard();
  const isManager = user.role === 'Manager';

  return (
    <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Project Dashboard</h1>
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <Button variant="link" onClick={() => onSwitchView('dashboard')}>Dashboard</Button>
          {isManager && <Button variant="link" onClick={() => onSwitchView('team')}>Team</Button>}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {isManager && <AIWeeklyReportDialog />}
        <NotificationBell count={notificationCount} />
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {/* The signOut button now uses the function from the hook */}
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
}
