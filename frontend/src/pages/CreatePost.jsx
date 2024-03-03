import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  console.log(formData);

  const navigate = useNavigate();

  // Maneja la subida de una imagen al almacenamiento
  const handleUpdloadImage = () => {
    try {
      // Verifica si no se ha seleccionado ningún archivo.
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      // Limpia el mensaje de error de carga de imagen.
      setImageUploadError(null);
      // Obtiene una referencia al servicio de almacenamiento.
      const storage = getStorage(app);
      // Genera un nombre de archivo único basado en la marca de tiempo y el nombre original del archivo.
      const fileName = new Date().getTime() + "-" + file.name;
      // Crea una referencia al archivo en el almacenamiento.
      const storageRef = ref(storage, fileName);
      // Inicia una tarea de carga de bytes resumible.
      const uploadTask = uploadBytesResumable(storageRef, file);
      // Configura oyentes para el cambio de estado durante la carga del archivo.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calcula y actualiza el progreso de carga en porcentaje.
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          // En caso de error durante la carga, muestra un mensaje de error y reinicia el progreso.
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          // Cuando la carga se completa, obtiene la URL de descarga del archivo.
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Limpia el progreso y los mensajes de error, y actualiza el estado del formulario con la URL de descarga.
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      // En caso de error general durante el proceso, muestra un mensaje de error y reinicia el progreso.
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  // Maneja el envío del formulario.
  const handleSubmit = async (e) => {
    // Evitar el comportamiento predeterminado de envío del formulario
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Convertir los datos del formulario a JSON y enviarlos como cuerpo de la solicitud
        body: JSON.stringify(formData),
      });

      // Analizar la respuesta como JSON
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
