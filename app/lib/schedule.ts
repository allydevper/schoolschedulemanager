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
        Query.equal('userId', userId),
        Query.limit(30)
    ]);
};

export const getSubjects = async (userId: string) => {
    const response = await database.listDocuments(dbId, collection, [
        Query.equal('userId', userId),
        Query.select(['subject']),
        Query.limit(30)
    ]);
    return response.documents.map((doc: any) => doc.subject);
};

export const createSchedule = async (schedule: Schedule) => {
    const { id, ...scheduleData } = schedule;
    return await database.createDocument(dbId, collection, ID.unique(), scheduleData);
};

export const updateSchedule = async (scheduleId: string, schedule: Partial<Schedule>) => {
    const { id, ...scheduleData } = schedule;
    return await database.updateDocument(dbId, collection, scheduleId, scheduleData);
};

export const deleteSchedule = async (scheduleId: string) => {
    return await database.deleteDocument(dbId, collection, scheduleId);
};