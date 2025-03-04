import { Link, useNavigate } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import { Models } from "appwrite";
import { Bell, Calendar, CheckSquare, Home, LogOut, Menu, Moon, Settings, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { account } from "~/appwrite";
import { Button } from "~/components/ui/button";

export default function MainLayout({ children }: { children: React.ReactNode }) {

    const [theme, setTheme] = useState("light")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

    const navItems = [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Schedule", href: "/schedule", icon: Calendar },
        { name: "Tasks", href: "/tasks", icon: CheckSquare },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Settings", href: "/settings", icon: Settings },
    ]

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        document.documentElement.classList.toggle("dark")
        localStorage.setItem("theme", newTheme)
    }

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await account.get();
                setUser(userData);
            } catch {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, [navigate]);

    if (loading || user === null) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    const logOutUser = async () => {
        try {
            await account.deleteSession("current");
            navigate("/login");
        } catch (error: any) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="flex h-screen bg-secondary">
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed top-4 left-4 z-50 md:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X /> : <Menu />}
                </Button>

                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 bg-card shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                            <h1 className="text-xl font-semibold text-primary">School Schedule</h1>
                        </div>

                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                                            }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="p-4 border-t">
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleTheme}
                                    aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                                >
                                    {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                </Button>

                                <Button variant="ghost" size="icon" aria-label="Logout" onClick={logOutUser}>
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 md:ml-64 p-4 overflow-auto">{children}</main>
            </div>
        </>
    );
}