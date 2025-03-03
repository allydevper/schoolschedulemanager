import { Client, Account } from 'appwrite';
import { getPublicEnv } from 'env.common';

//cambiar por privado
const client = new Client()
    .setEndpoint(getPublicEnv().VITE_API_URL)
    .setProject(getPublicEnv().VITE_PUBLIC_KEY);

const account = new Account(client);
export { client, account };
