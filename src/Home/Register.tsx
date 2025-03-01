import { createSignal } from 'solid-js';
import { account } from '../appwrite';
import { useNavigate } from '@solidjs/router';
import { ID } from 'appwrite';

function Register() {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            debugger
            
            await account.create(ID.unique(), email(), password());
            await account.createEmailPasswordSession(email(), password());
            alert('Registro exitoso');
            navigate('/login');
        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Hubo un problema con el registro');
        }
    };

    return (
        <div>
            <input
                type="email"
                placeholder="Correo electrónico"
                onInput={(e) => setEmail(e.currentTarget.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <button onClick={handleRegister}>Registrarse</button>
        </div>
    );
}

export default Register;
