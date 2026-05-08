"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Calendar, 
  Users, 
  Package, 
  Settings, 
  LogOut,
  Scissors,
  Menu,
  Bell,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pos", label: "Billing & POS", icon: ShoppingCart },

  { href: "/customers", label: "Customers", icon: Users },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <Image src="/salon-logo.png" alt="Duke & Duchess Logo" width={180} height={40} className="h-10 w-auto object-contain" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {routes.map((route) => {
            const active = pathname === route.href || pathname.startsWith(route.href + '/');
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-border p-4">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col fixed inset-y-0 z-50 md:flex">
        <SidebarContent />
      </aside>

      <div className="flex flex-col md:pl-64 flex-1">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
          <Sheet>
            <SheetTrigger className="md:hidden shrink-0 inline-flex items-center justify-center rounded-lg border border-border bg-background h-10 w-10 hover:bg-muted text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            {/* Can put a global search here */}
          </div>

          <Button variant="ghost" size="icon" className="text-muted-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="User avatar" />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name || "Admin User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email || "admin@duke.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
