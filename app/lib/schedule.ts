import { ID, Databases, Query } from "appwrite";
import { client } from "~/appwrite";

const database = new Databases(client);
const dbId = "school_manager";
const collection = "schedules";

export const createSchedule = async (userId: string, subject: string, dayOfWeek: number, startTime: string, endTime: string) => {
    return await database.createDocument(dbId, collection, ID.unique(), {
        userId, subject, dayOfWeek, startTime, endTime
    });
};

export const getSchedules = async (userId: string) => {
    return await database.listDocuments(dbId, collection, [
        Query.equal('users', userId)
    ]);
};
