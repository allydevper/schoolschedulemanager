import { Form } from "@remix-run/react";

export default function Register() {
  return (
    <div>
      <h1>Registrarse</h1>
      <Form method="post">
        <label>
          Nombre Completo:
          <input type="text" name="name" required />
        </label>
        <br />
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
        <button type="submit">Registrarse</button>
      </Form>
    </div>
  );
}
