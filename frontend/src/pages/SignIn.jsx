import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { OAuth } from "../components";

export default function SignIn() {
  // Estado local para gestionar datos del formulario
  const [formData, setFormData] = useState({});

  // Obtener estado global del usuario desde Redux
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  // Dispatch para despachar acciones de Redux
  const dispatch = useDispatch();

  // Hook de navegación
  const navigate = useNavigate();

  // Función para manejar cambios en los campos de entrada del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Función para manejar el envío del formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si los campos requeridos no están vacíos
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }

    try {
      // Iniciar la acción de inicio de sesión
      dispatch(signInStart());

      // Realizar solicitud POST al servidor para iniciar sesión
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Obtener datos de la respuesta
      const data = await res.json();

      // Manejar la respuesta del servidor
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        // Despachar acción de éxito y redirigir al usuario
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      // Manejar errores durante el proceso
      dispatch(signInFailure(error.message));
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
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                required
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" disabled="">
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont Have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
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
