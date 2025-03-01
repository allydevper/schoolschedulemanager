import { createContext, useContext, createSignal, onMount } from 'solid-js';
import { account } from '../appwrite';
import { Models, } from 'appwrite';
interface AuthContextType {
    currentUser: Models.User<Models.Preferences> | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: any) {
    const [currentUser, setCurrentUser] = createSignal<Models.User<Models.Preferences> | null>(null);

    const login = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            setCurrentUser(user);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setCurrentUser(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    onMount(async () => {
        try {
            debugger
            const user = await account.get();
            setCurrentUser(user);
        } catch {
            setCurrentUser(null);
        }
    });
    return (
        <AuthContext.Provider value={{ currentUser: currentUser(), login, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    return useContext(AuthContext);
}
