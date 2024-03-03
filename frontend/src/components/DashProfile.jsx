import { Alert, Button, Modal, ModalBody, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  // Función para manejar el cambio de imagen
  const handleImageChange = (e) => {
    // Obtener el archivo de imagen seleccionado
    const file = e.target.files[0];

    // Verificar si se ha seleccionado un archivo
    if (file) {
      // Actualizar el estado 'imageFile' con el archivo
      setImageFile(file);

      // Generar la URL del objeto del archivo y actualizar el estado 'imageFileUrl'
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // Hook useEffect para manejar la carga de la imagen cuando cambia 'imageFile'
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // Función para cargar la imagen a Firebase Storage
  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // Listener para rastrear el progreso de la carga
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        // Obtener la URL de descarga después de una carga exitosa
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  //Maneja el cambio en los campos de un formulario y actualiza el estado de los datos del formulario.
  const handleChange = (e) => {
    // Actualiza el estado del formulario con el nuevo valor del campo modificado
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Maneja la presentación del formulario para actualizar el perfil de usuario.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    // Verifica si no se han realizado cambios en el formulario
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    try {
      dispatch(updateStart());
      // Envía una solicitud PUT para actualizar el perfil del usuario
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Analiza los datos de respuesta
      const data = await res.json();

      // Verifica si la solicitud fue exitosa
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        // Actualiza el estado del usuario y muestra un mensaje de éxito
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      // Maneja cualquier error durante el proceso de actualización
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  //Maneja la eliminación de un usuario.
  const handleDeleteUser = async () => {
    // Oculta el modal de confirmación de eliminación.
    setShowModal(false);
    try {
      // Iniloadingcia la acción de eliminación de usuario.
      dispatch(deleteUserStart());
      // Realiza una solicitud DELETE al servidor para eliminar el usuario.
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      // Lee la respuesta del servidor como JSON.
      const data = await res.json();

      // Verifica si la respuesta indica un error.
      if (!res.ok) {
        // Actualiza el estado con un mensaje de error.
        dispatch(deleteUserFailure(data.message));
      } else {
        // Actualiza el estado con la confirmación exitosa.
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      // Captura cualquier error durante el proceso y actualiza el estado con el mensaje de error.
      dispatch(deleteUserFailure(error.message));
    }
  };

  //Maneja la acción de cerrar sesión de un usuario.
  const handleSignout = async () => {
    try {
      // Realiza una solicitud POST al servidor para cerrar sesión.
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
  
      // Lee la respuesta del servidor como JSON.
      const data = await res.json();
  
      // Verifica si la respuesta indica un error.
      if (!res.ok) {
        // En caso de error, imprime el mensaje de error en la consola.
        console.log(data.message);
      } else {
        // En caso de éxito, despacha la acción de cierre de sesión.
        dispatch(signoutSuccess());
      }
    } catch (error) {
      // Captura cualquier error durante el proceso y lo imprime en la consola.
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          required
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          required
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
