import { z } from "zod";

const publicEnvSchema = z.object({
    VITE_API_URL: z.string().min(1),
    VITE_PUBLIC_KEY: z.string().min(1),
});

function getPublicEnv() {
    return publicEnvSchema.parse(import.meta.env);
}

export { getPublicEnv };
