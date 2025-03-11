import { ID, Databases, Query } from "appwrite";
import { client } from "~/appwrite";

const database = new Databases(client);
const dbId = "67c271e2003631f25454";
const collection = "67c91d040016f78333be";

export interface Schedule {
    id?: string;
    userId?: string;
    dayOfWeek: string;
    subject: string;
    startTime: string;
    endTime: string;
    room: string;
    teacher: string;
}

export const getSchedule = async (userId: string) => {
    return await database.listDocuments(dbId, collection, [
        Query.equal('userId', userId)
    ]);
};

export const createSchedule = async (schedule: Schedule) => {
    delete schedule.id;
    return await database.createDocument(dbId, collection, ID.unique(), schedule);
};

export const updateSchedule = async (scheduleId: string, schedule: Partial<Schedule>) => {
    delete schedule.id;
    return await database.updateDocument(dbId, collection, scheduleId, schedule);
};

export const deleteSchedule = async (scheduleId: string) => {
    return await database.deleteDocument(dbId, collection, scheduleId);
};