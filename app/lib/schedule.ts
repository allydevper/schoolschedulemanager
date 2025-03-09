import { ID, Databases, Query } from "appwrite";
import { client } from "~/appwrite";

const database = new Databases(client);
const dbId = "school_manager";
const collection = "schedules";

export interface Schedule {
    id: string;
    userId: string;
    dayOfWeek: string;
    subject: string;
    startTime: string;
    endTime: string;
    room: string;
    teacher: string;
}

export const createSchedule = async (schedule: Schedule) => {
    return await database.createDocument(dbId, collection, ID.unique(), schedule);
};

export const getSchedule = async (userId: string) => {
    return await database.listDocuments(dbId, collection, [
        Query.equal('users', userId)
    ]);
};

export const updateSchedule = async (scheduleId: string, schedule: Partial<Schedule>) => {
    return await database.updateDocument(dbId, collection, scheduleId, schedule);
};

export const deleteSchedule = async (scheduleId: string) => {
    return await database.deleteDocument(dbId, collection, scheduleId);
};