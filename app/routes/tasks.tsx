import { Calendar, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Task } from "~/lib/tasks";

export default function TasksPage() {

    const [tasks, setTasks] = useState<Task[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [activeTab, setActiveTab] = useState("all")
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "Mathematics",
        deadline: "",
        priority: "medium",
    })

    const filteredTasks = tasks.filter((task) => {
        if (activeTab === "all") return true
        if (activeTab === "completed") return task.completed
        if (activeTab === "pending") return !task.completed
        if (activeTab === "high") return task.priority === "high" && !task.completed
        return true
    })

    const handleAddTask = () => {
        setSelectedTask(null)
        setFormData({
            title: "",
            description: "",
            subject: "Mathematics",
            deadline: "",
            priority: "medium",
        })
        setIsDialogOpen(true)
    }

    const handleEditTask = (task: Task) => {
        setSelectedTask(task)
        setFormData({
            title: task.title,
            description: task.description,
            subject: task.subject,
            deadline: task.deadline,
            priority: task.priority,
        })
        setIsDialogOpen(true)
    }

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    const handleToggleComplete = (id: string) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    }

    const handleSaveTask = () => {
        const { title, description, subject, deadline, priority } = formData

        if (selectedTask) {
            // Edit existing task
            setTasks(
                tasks.map((task) =>
                    task.id === selectedTask.id ? { ...task, title, description, subject, deadline, priority } : task,
                ),
            )
        } else {
            // Add new task
            // const newId = Math.max(0, ...tasks.map((task) => task.id)) + 1
            // const newTask = {
            //     id: newId,
            //     title,
            //     description,
            //     subject,
            //     deadline,
            //     priority,
            //     completed: false,
            // }

            // setTasks([...tasks, newTask])
        }

        setIsDialogOpen(false)
    }

    const subjects = [
        "Mathematics",
        "Physics",
        "Computer Science",
        "English Literature",
        "Chemistry",
        "History",
        "Biology",
        "Art",
        "Music",
        "Physical Education",
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                <Button onClick={handleAddTask}>
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 md:w-auto">
                    <TabsTrigger value="all" className="data-[state=active]:text-white">All</TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:text-white">Pending</TabsTrigger>
                    <TabsTrigger value="high" className="data-[state=active]:text-white">High Priority</TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:text-white">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filteredTasks.length > 0 ? (
                        <div className="space-y-4">
                            {filteredTasks.map((task) => (
                                <Card key={task.id} className={task.completed ? "opacity-70" : ""}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <Checkbox
                                                id={`task-${task.id}`}
                                                checked={task.completed}
                                                onCheckedChange={() => handleToggleComplete(task.id!)}
                                                className="mt-1"
                                            />

                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className={`font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{task.subject}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
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

                                                        <div className="flex">
                                                            <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                                                                <Edit className="h-4 w-4" />
                                                                <span className="sr-only">Edit</span>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id!)}>
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Delete</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-sm">{task.description}</p>

                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                            <p className="text-sm text-muted-foreground">No tasks found</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>{selectedTask ? "Edit Task" : "Add New Task"}</DialogTitle>
                        <DialogDescription>
                            {selectedTask ? "Make changes to your task here." : "Add a new task to your list."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Math Assignment"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g. Complete exercises 1-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                                <SelectTrigger id="subject">
                                    <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject} value={subject}>
                                            {subject}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger id="priority">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTask}>{selectedTask ? "Save Changes" : "Add Task"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>)
}