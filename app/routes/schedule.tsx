import { useRef, useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { TimePickerInput } from "~/components/ui/time-picker-input"

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

const initialSchedule = {
    Monday: [
        { id: 1, subject: "Mathematics", time: "09:00 - 10:30", room: "Room 101", teacher: "Dr. Smith" },
        { id: 2, subject: "Physics", time: "11:00 - 12:30", room: "Room 203", teacher: "Prof. Johnson" },
    ],
    Tuesday: [
        { id: 3, subject: "Computer Science", time: "09:00 - 10:30", room: "Lab 3", teacher: "Ms. Davis" },
        { id: 4, subject: "English Literature", time: "11:00 - 12:30", room: "Room 105", teacher: "Mr. Wilson" },
    ],
    Wednesday: [
        { id: 5, subject: "Chemistry", time: "09:00 - 10:30", room: "Lab 1", teacher: "Dr. Brown" },
        { id: 6, subject: "History", time: "14:00 - 15:30", room: "Room 202", teacher: "Ms. Taylor" },
    ],
    Thursday: [
        { id: 7, subject: "Biology", time: "11:00 - 12:30", room: "Lab 2", teacher: "Prof. Anderson" },
        { id: 8, subject: "Art", time: "14:00 - 15:30", room: "Art Studio", teacher: "Ms. Martinez" },
    ],
    Friday: [
        { id: 9, subject: "Physical Education", time: "09:00 - 10:30", room: "Gymnasium", teacher: "Coach Thompson" },
        { id: 10, subject: "Music", time: "11:00 - 12:30", room: "Music Room", teacher: "Mr. Garcia" },
    ],
}

interface ClassItem {
    id: number
    subject: string
    time: string
    room: string
    teacher: string
}

export default function Schedule() {
    const [schedule, setSchedule] = useState<Record<string, ClassItem[]>>(initialSchedule)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState("Monday")
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)
    const [formData, setFormData] = useState({
        subject: "",
        startTime: "09:00",
        endTime: "10:30",
        room: "",
        teacher: "",
    })

    const handleAddClass = () => {
        setSelectedClass(null)
        setFormData({
            subject: "",
            startTime: "09:00",
            endTime: "10:30",
            room: "",
            teacher: "",
        })
        setIsDialogOpen(true)
    }

    const handleEditClass = (day: string, classItem: ClassItem) => {
        setSelectedDay(day)
        setSelectedClass(classItem)

        const [startTime, endTime] = classItem.time.split(" - ")

        setFormData({
            subject: classItem.subject,
            startTime,
            endTime,
            room: classItem.room,
            teacher: classItem.teacher,
        })

        setIsDialogOpen(true)
    }

    const handleDeleteClass = (day: string, id: number) => {
        const updatedSchedule = { ...schedule }
        updatedSchedule[day] = updatedSchedule[day].filter((item) => item.id !== id)
        setSchedule(updatedSchedule)
    }

    const handleSaveClass = () => {
        const { subject, startTime, endTime, room, teacher } = formData
        const time = `${startTime} - ${endTime}`

        const updatedSchedule = { ...schedule }

        if (selectedClass) {
            updatedSchedule[selectedDay] = updatedSchedule[selectedDay].map((item) =>
                item.id === selectedClass.id ? { ...item, subject, time, room, teacher } : item,
            )
        } else {
            const newId =
                Math.max(
                    0,
                    ...Object.values(schedule)
                        .flat()
                        .map((item) => item.id),
                ) + 1
            const newClass = { id: newId, subject, time, room, teacher }

            if (!updatedSchedule[selectedDay]) {
                updatedSchedule[selectedDay] = []
            }

            updatedSchedule[selectedDay] = [...updatedSchedule[selectedDay], newClass]
        }

        setSchedule(updatedSchedule)
        setIsDialogOpen(false)
    }

    const minuteRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLInputElement>(null);

    const [dateStart, setDateStart] = useState<Date>();
    const [dateEnd, setDateEnd] = useState<Date>();

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
                                    {schedule[day].map((classItem) => (
                                        <div
                                            key={classItem.id}
                                            className="flex items-start p-4 rounded-lg border bg-card transition-all hover:ring ring-cyan-900/50"
                                        >
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">{classItem.subject}</h3>
                                                    <div className="flex space-x-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEditClass(day, classItem)}>
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClass(day, classItem.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {classItem.time} • {classItem.room} • {classItem.teacher}
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
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveClass}>{selectedClass ? "Save Changes" : "Add Class"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

