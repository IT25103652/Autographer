import { Client, Account, Databases, Storage, Functions } from "appwrite";

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

// Toggle live backend if variables are supplied
export const isAppwriteConfigured = !!(endpoint && projectId);

if (isAppwriteConfigured) {
  client
    .setEndpoint(endpoint as string)
    .setProject(projectId as string);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export { client };
