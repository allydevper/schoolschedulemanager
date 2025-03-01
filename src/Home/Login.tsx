import { createSignal } from 'solid-js';
import { account } from '../appwrite';
import { useNavigate } from '@solidjs/router';

function Login() {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [error, setError] = createSignal('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await account.createEmailPasswordSession(email(), password());
            navigate('/');
        } catch (err) {
            setError('Error al iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            {error() && <p style={{ color: 'red' }}>{error()}</p>}
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <button onClick={handleLogin}>Iniciar Sesión</button>
        </div>
    );
}

export default Login;
