import { ID, Databases, Query } from "appwrite";
import { client } from "~/appwrite";

const database = new Databases(client);
const dbId = "school_manager";
const collection = "tasks";

export const createTask = async (userId: string, description: string, dueDate: string, status: string) => {
    return await database.createDocument(dbId, collection, ID.unique(), {
        userId, description, dueDate, status
    });
};

export const getTasks = async (userId: string) => {
    return await database.listDocuments(dbId, collection, [
        Query.equal('users', userId)
    ]);
};

export const updateTaskStatus = async (taskId: string, status: string) => {
    return await database.updateDocument(dbId, collection, taskId, { status });
};
