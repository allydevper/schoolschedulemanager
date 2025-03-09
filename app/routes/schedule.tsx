import { useRef, useState } from "react"
import { format } from "date-fns"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { TimePickerInput } from "~/components/ui/time-picker-input"
import { Schedule } from "~/lib/schedule"
import { useUser } from "~/context/UserContext"

const _weekdays = {
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday",
    Sunday: "Sunday",
}

const weekdays = Object.keys(_weekdays);

export default function SchedulePage() {

    const { user } = useUser();

    const [schedule, setSchedule] = useState<Record<string, Schedule[]>>({})
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState("Monday")
    const [selectedClass, setSelectedClass] = useState<Schedule | null>(null)
    const [formData, setFormData] = useState<Partial<Schedule>>({
        id: "",
        userId: "",
        dayOfWeek: "",
        subject: "",
        startTime: "",
        endTime: "",
        room: "",
        teacher: ""
    })

    const handleAddClass = async () => {

        const newDateStart = new Date();
        newDateStart.setHours(9, 0, 0, 0);
        setDateStart(newDateStart);

        const newDateEnd = new Date();
        newDateEnd.setHours(10, 30, 0, 0);
        setDateEnd(newDateEnd);

        setSelectedClass(null)
        setFormData({
            id: "",
            userId: "",
            dayOfWeek: "",
            subject: "",
            startTime: "",
            endTime: "",
            room: "",
            teacher: ""
        })
        setIsDialogOpen(true)
    }

    const handleEditClass = (day: string, schedule: Schedule) => {
        setSelectedDay(day)
        setSelectedClass(schedule)

        const [startTime, endTime] = schedule.startTime

        setFormData({
            ...schedule,
            startTime,
            endTime,
        })

        setIsDialogOpen(true)
    }

    const handleDeleteClass = (day: string, id: string) => {
        const updatedSchedule = { ...schedule }
        updatedSchedule[day] = updatedSchedule[day].filter((item) => item.id !== id)
        setSchedule(updatedSchedule)
    }

    const handleSaveClass = () => {
        try {
            const { subject, startTime, endTime, room, teacher } = formData
            const time = `${startTime} - ${endTime}`

            const updatedSchedule = { ...schedule }

            if (selectedClass) {
                updatedSchedule[selectedDay] = updatedSchedule[selectedDay].map((item) =>
                    item.id === selectedClass.id ? { ...item, subject, room, teacher } as Schedule : item,
                )
            } else {
                // const newId =
                //     Math.max(
                //         0,
                //         ...Object.values(schedule)
                //             .flat()
                //             .map((item) => item.id),
                //     ) + 1
                // const newClass = { id: "1", subject, time, room, teacher }

                if (!updatedSchedule[selectedDay]) {
                    updatedSchedule[selectedDay] = []
                }

                updatedSchedule[selectedDay] = [...updatedSchedule[selectedDay],
                {
                    ...formData,
                    dayOfWeek: selectedDay,
                    id: (updatedSchedule[selectedDay].length + 1).toString(),
                    startTime: dateStart?.toISOString(),
                    endTime: dateEnd?.toISOString()
                } as Schedule]
                console.log(updatedSchedule[selectedDay])
            }

            setSchedule(updatedSchedule)
            setIsDialogOpen(false)
            // const scheduleData = await createSchedule({
            //     id: "",
            //     userId: user?.$id ?? "",
            //     dayOfWeek: "",
            //     subject: "",
            //     startTime: "",
            //     endTime: "",
            //     room: "",
            //     teacher: ""
            // });

            // setSchedules(scheduleData.documents);

            // const taskData = await getTasks(userData.$id);
            // setTasks(taskData.documents);
        } catch (error: any) {
            console.error(error);
            // navigate("/login");
        }
    }

    const minuteRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLInputElement>(null);

    const [dateStart, setDateStart] = useState<Date>();
    const [dateEnd, setDateEnd] = useState<Date>();

    const parseDateISO = (date: string) => {
        return format(new Date(date), "HH:mm");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Weekly Schedule</h1>
                <Button onClick={handleAddClass}>
                    <Plus className="mr-2 h-4 w-4" /> Add Class
                </Button>
            </div>

            <div className="grid gap-6">
                {weekdays.map((day) => (
                    <Card key={day}>
                        <CardHeader>
                            <CardTitle>{day}</CardTitle>
                            <CardDescription>Your classes for {day}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {schedule[day]?.length ? (
                                <div className="space-y-4">
                                    {schedule[day].map((schedule) => (
                                        <div
                                            key={schedule.id}
                                            className="flex items-start p-4 rounded-lg border bg-card transition-all hover:ring ring-cyan-900/50"
                                        >
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">{schedule.subject}</h3>
                                                    <div className="flex space-x-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEditClass(day, schedule)}>
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClass(day, schedule.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {parseDateISO(schedule.startTime)} • {schedule.room} • {schedule.teacher}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                                    <p className="text-sm text-muted-foreground">No classes scheduled for {day}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>{selectedClass ? "Edit Class" : "Add New Class"}</DialogTitle>
                        <DialogDescription>
                            {selectedClass ? "Make changes to your class schedule here." : "Add a new class to your schedule."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="day">Day</Label>
                            <Select value={selectedDay} onValueChange={setSelectedDay}>
                                <SelectTrigger id="day">
                                    <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {weekdays.map((day) => (
                                        <SelectItem key={day} value={day}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="e.g. Mathematics"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <div className="flex space-x-2 w-full">
                                    <TimePickerInput
                                        picker="hours"
                                        date={dateStart}
                                        setDate={setDateStart}
                                        ref={hourRef}
                                        onLeftFocus={() => hourRef.current?.focus()}
                                        className="w-full"
                                    />
                                    <TimePickerInput
                                        picker="minutes"
                                        date={dateStart}
                                        setDate={setDateStart}
                                        ref={minuteRef}
                                        onLeftFocus={() => minuteRef.current?.focus()}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <div className="flex space-x-2 w-full">
                                    <TimePickerInput
                                        picker="hours"
                                        date={dateEnd}
                                        setDate={setDateEnd}
                                        ref={hourRef}
                                        onLeftFocus={() => hourRef.current?.focus()}
                                        className="w-full"
                                    />
                                    <TimePickerInput
                                        picker="minutes"
                                        date={dateEnd}
                                        setDate={setDateEnd}
                                        ref={minuteRef}
                                        onLeftFocus={() => minuteRef.current?.focus()}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="room">Room</Label>
                            <Input
                                id="room"
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                placeholder="e.g. Room 101"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="teacher">Teacher</Label>
                            <Input
                                id="teacher"
                                value={formData.teacher}
                                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                placeholder="e.g. Dr. Smith"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveClass}>{selectedClass ? "Save Changes" : "Add Class"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

