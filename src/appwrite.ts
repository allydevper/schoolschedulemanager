import { Client, Account } from 'appwrite';

//cambiar por privado
const client = new Client()
    .setEndpoint(import.meta.env.VITE_API_URL)
    .setProject(import.meta.env.VITE_PUBLIC_KEY);

const account = new Account(client);
export { client, account };
