import { Link } from "@remix-run/react";

export default function Index() {
    return (
        <div>
            <h1>Bienvenido a la Aplicación de Gestión Escolar</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/login">Iniciar Sesión</Link>
                    </li>
                    <li>
                        <Link to="/register">Registrarse</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
