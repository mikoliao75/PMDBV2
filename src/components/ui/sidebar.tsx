"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  Home,
  Users,
  ClipboardList,
  LogOut,
  ChevronsRight,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "./button";
import { SidebarLink } from "./sidebar-link";
import { signOut } from "@/firebase/auth/auth";
import { useUser } from "@/firebase/auth/use-user";
import { useSidebar } from "@/hooks/use-sidebar";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
];

export function Sidebar() {
  const { user } = useUser();
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <nav
      className={cn(
        "relative flex h-full flex-col bg-card px-2 py-4 transition-all duration-300 ease-in-out",
        isOpen ? "w-52" : "w-16"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-9"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
      </Button>
      <div className="flex-1">
        {links.map(({ href, label, icon: Icon }) => (
          <SidebarLink
            key={href}
            href={href}
            label={label}
            icon={<Icon />}
            isActive={pathname === href}
            isExpanded={isOpen}
          />
        ))}
      </div>

      {user && (
        <div className="border-t pt-4">
          <SidebarLink
            href="/profile"
            label={user.displayName || "Profile"}
            imageUrl={user.photoURL}
            isExpanded={isOpen}
          >
            <Button
              variant="ghost"
              size="icon"
              className="mt-2"
              onClick={handleSignOut}
            >
              <LogOut />
            </Button>
          </SidebarLink>
        </div>
      )}
    </nav>
  );
}
