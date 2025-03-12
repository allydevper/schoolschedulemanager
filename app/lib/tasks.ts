import { ID, Databases, Query } from "appwrite";
import { client } from "~/appwrite";

const database = new Databases(client);
const dbId = "67c271e2003631f25454";
const collection = "67c91d6d001fd23ef663";

export interface Task {
    id?: string;
    userId?: string;
    title: string;
    description: string;
    subject: string;
    deadline: string;
    priority: string;
    completed: boolean;
}

export const getTask = async (userId: string) => {
    return await database.listDocuments(dbId, collection, [
        Query.equal('userId', userId)
    ]);
};

export const createTask = async (task: Task) => {
    delete task.id;
    return await database.createDocument(dbId, collection, ID.unique(), task);
};

export const updateTask = async (taskId: string, task: Partial<Task>) => {
    delete task.id;
    return await database.updateDocument(dbId, collection, taskId, task);
};

export const deleteTask = async (taskId: string) => {
    return await database.deleteDocument(dbId, collection, taskId);
};