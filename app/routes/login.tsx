import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <Form method="post">
        <label>
          Correo Electrónico:
          <input type="email" name="email" required />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" name="password" required />
        </label>
        <br />
        <button type="submit">Iniciar Sesión</button>
      </Form>
    </div>
  );
}
