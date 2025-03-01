import { createEffect } from 'solid-js';
import { account } from '../appwrite';
import { useNavigate } from '@solidjs/router';

function Home() {
    const navigate = useNavigate();

    createEffect(async () => {
        try {
            await account.get();
        } catch (err) {
            navigate('/login');
        }
    });

    return (
        <div>
            <h1>Bienvenido al Administrador de Horarios</h1>
        </div>
    );
}

export default Home;
