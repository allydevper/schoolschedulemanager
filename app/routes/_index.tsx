import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function Index() {
    return (

        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Today's Schedule */}
                <Card className="col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Today&apos;s Schedule</CardTitle>
                            <CardDescription>Your classes for today</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/schedule">View Full Schedule</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* {todayClasses.map((classItem) => (
                                <div
                                    key={classItem.id}
                                    className="flex items-start p-4 rounded-lg border bg-card transition-all hover:shadow-md"
                                >
                                    <div className="mr-4 rounded-full bg-primary/10 p-3">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">{classItem.subject}</h3>
                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="mr-1 h-4 w-4" />
                                                <span className="text-sm">{classItem.time}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {classItem.room} • {classItem.teacher}
                                        </p>
                                    </div>
                                </div>
                            ))} */}
                        </div>
                    </CardContent>
                </Card>

                {/* Calendar Widget */}
                <Card>
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                        <CardDescription>Plan your month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" /> */}
                    </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card className="col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Upcoming Tasks</CardTitle>
                            <CardDescription>Tasks that need your attention</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/tasks">View All Tasks</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* {upcomingTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-start p-4 rounded-lg border bg-card transition-all hover:shadow-md"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">{task.title}</h3>
                                            <Badge
                                                variant={
                                                    task.priority === "high"
                                                        ? "destructive"
                                                        : task.priority === "medium"
                                                            ? "default"
                                                            : "secondary"
                                                }
                                            >
                                                {task.priority}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">{task.subject}</span>
                                            <span className="text-muted-foreground">Due: {task.deadline}</span>
                                        </div>
                                    </div>
                                </div>
                            ))} */}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                        <CardDescription>Your academic progress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Attendance Rate</span>
                                <span className="font-medium">95%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-full w-[95%] rounded-full bg-primary" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Completed Tasks</span>
                                <span className="font-medium">24/30</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-full w-[80%] rounded-full bg-primary" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Current GPA</span>
                                <span className="font-medium">3.8/4.0</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-full w-[95%] rounded-full bg-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        // <div>
        //     <h1>Bienvenido a la Aplicación de Gestión Escolar</h1>
        //     <nav>
        //         <ul>
        //             <li>
        //                 <Link to="/login">Iniciar Sesión</Link>
        //             </li>
        //             <li>
        //                 <Link to="/register">Registrarse</Link>
        //             </li>
        //         </ul>
        //     </nav>
        // </div>
    );
}
