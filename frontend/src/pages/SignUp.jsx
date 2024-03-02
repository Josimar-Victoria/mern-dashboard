import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Maneja los cambios en los campos del formulario.
   * @param {Event} e - Objeto de evento del cambio.
   */
  const handleChange = (e) => {
    // Actualiza el estado del formulario con el nuevo valor del campo.
    // Elimina espacios en blanco alrededor del valor.
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    //console.log(e.target.value);
  };

  /**
   * Maneja el envío del formulario de registro.
   * @param {Event} e - Objeto de evento del envío del formulario.
   */
  const handleSubmit = async (e) => {
    // Evita el comportamiento predeterminado de envío del formulario.
    e.preventDefault();

    // Establece el estado de carga a true para mostrar un indicador de carga.
    setLoading(true);

    // Restablece cualquier mensaje de error previo.
    setErrorMessage(null);

    // Verifica que todos los campos requeridos estén completos.
    if (!formData.username || !formData.password || !formData.email) {
      // Muestra un mensaje de error si algún campo está incompleto.
      return setErrorMessage("Por favor, completa todos los campos requeridos");
    }

    try {
      // Realiza una solicitud al endpoint de registro del servidor.
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Convierte el estado del formulario a una cadena JSON para enviarlo.
        body: JSON.stringify(formData),
      });

      // Parsea la respuesta JSON de la solicitud.
      const data = await response.json();

      // console.log(data);

      // Verifica el estado de la respuesta.
      if (response.status === 201) {
        // Redirige al usuario al dashboard si el registro es exitoso.
        navigate("/");
      } else {
        // Establece el mensaje de error si la respuesta no es exitosa.
        setErrorMessage(data.message);
      }

      // Establece el mensaje de error si la propiedad 'success' en los datos es falsa.
      if (data.success === false) {
        setErrorMessage(data.message);
      }

      // Establece el estado de carga a false después de completar la solicitud.
      setLoading(false);
    } catch (err) {
      // Maneja errores de la solicitud y establece el mensaje de error correspondiente.
      console.log(err);
      setErrorMessage(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-green-200 via-green-500 to-blue-500 rounded-lg text-white">
              Dashboard
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            {/* <OAuth /> */}
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
