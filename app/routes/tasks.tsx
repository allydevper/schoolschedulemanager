import { format } from "date-fns";
import { CalendarIcon, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUser } from "~/context/UserContext";
import { showToast } from "~/lib/customToast";
import { getSubjects } from "~/lib/schedule";
import { createTask, getTask, Task, updateTask } from "~/lib/tasks";
import { cn } from "~/lib/utils";

export default function TasksPage() {

    const { user } = useUser();

    const [tasks, setTasks] = useState<Task[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [activeTab, setActiveTab] = useState("all")
    const [formData, setFormData] = useState<Partial<Task>>({
        id: "",
        userId: "",
        title: "",
        description: "",
        subject: "",
        deadline: "",
        priority: "",
    })
    const [isSaving, setIsSaving] = useState(false)
    const [date, setDate] = useState<Date>(new Date())

    const handleSelectDate = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;
        setDate(selectedDate);
    };

    const [subjects, setSubjects] = useState<string[]>([])

    useEffect(() => {

        const fetchTask = async () => {
            try {
                const response = await getTask(user?.$id!);
                const TaskData = response.documents.map((doc) => {
                    return {
                        id: doc.$id,
                        userId: user?.$id,
                        title: doc.title,
                        description: doc.description,
                        subject: doc.subject,
                        deadline: doc.deadline,
                        priority: doc.priority,
                        completed: doc.completed
                    } as Task
                });
                setTasks(TaskData)
            } catch (error: any) {
                console.error(error);
                showToast(error?.message, "danger");
            }
        }

        fetchTask()

        const fetchSubjects = async () => {
            try {
                const response = await getSubjects(user?.$id!);
                setSubjects(response)
            } catch (error: any) {
                console.error(error);
                showToast(error?.message, "danger");
            }
        }

        fetchSubjects()
    }, []);

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
            subject: "default",
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

    const handleSaveTask = async () => {
        setIsSaving(true);
        try {

            const taskData = {
                ...formData,
                userId: user?.$id,
                deadline: date?.toISOString(),
            } as Task

            if (selectedTask) {
                await updateTask(taskData.id!, taskData);
                setTasks(tasks.map((task) => (task.id === taskData.id ? taskData : task)))
            } else {
                const taskResponse = await createTask(taskData);
                setTasks([...tasks, { ...taskData, id: taskResponse.$id }])
            }

            setIsDialogOpen(false)
        } catch (error: any) {
            console.error(error);
            showToast(error?.message, "danger");
        } finally {
            setIsSaving(false);
        }
    }

    const validateForm = () => {
        return (
            formData.title?.trim() &&
            formData.description?.trim() &&
            date
        );
    }

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
                <DialogContent className="bg-card">
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
                                maxLength={20}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Math Assignment"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                maxLength={50}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g. Complete exercises 1-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Select
                                value={formData.subject || "default"}
                                onValueChange={(value) => setFormData({ ...formData, subject: value })}
                            >
                                <SelectTrigger id="subject">
                                    <SelectValue placeholder="Choose a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default" disabled>
                                        Choose a subject
                                    </SelectItem>

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
                            <Popover>
                                <PopoverTrigger asChild className="bg-card">
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={handleSelectDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
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

                    <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTask} disabled={isSaving || !validateForm()} className="w-full sm:w-auto">
                            {selectedTask ? "Save Changes" : "Add Task"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>)
}