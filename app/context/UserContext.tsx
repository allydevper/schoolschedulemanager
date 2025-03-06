import React, { createContext, useContext, useState, useEffect } from "react";
import { Models } from "appwrite";
import { account } from "~/appwrite";
import { useNavigate } from "@remix-run/react";

interface UserContextType {
    user: Models.User<Models.Preferences> | null;
    setUser: React.Dispatch<React.SetStateAction<Models.User<Models.Preferences> | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await account.get();
                setUser(userData);
            } catch {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};