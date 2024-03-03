import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

   //Maneja la acción de cerrar sesión de un usuario.
   const handleSignout = async () => {
    try {
      // Realiza una solicitud POST al servidor para cerrar sesión.
      const res = await fetch("/api/user/signout", {
        method: "POST",
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
    <Sidebar className='w-full md:w-56'>
    <Sidebar.Items>
      <Sidebar.ItemGroup className='flex flex-col gap-1'>
        {currentUser && currentUser.isAdmin && (
          <Link to='/dashboard?tab=dash'>
            <Sidebar.Item
              active={tab === 'dash' || !tab}
              icon={HiChartPie}
              as='div'
            >
              Dashboard
            </Sidebar.Item>
          </Link>
        )}
        <Link to='/dashboard?tab=profile'>
          <Sidebar.Item
            active={tab === 'profile'}
            icon={HiUser}
            label={currentUser.isAdmin ? 'Admin' : 'User'}
            labelColor='dark'
            as='div'
          >
            Profile
          </Sidebar.Item>
        </Link>
        {currentUser.isAdmin && (
          <Link to='/dashboard?tab=posts'>
            <Sidebar.Item
              active={tab === 'posts'}
              icon={HiDocumentText}
              as='div'
            >
              Posts
            </Sidebar.Item>
          </Link>
        )}
        {currentUser.isAdmin && (
          <>
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Users
              </Sidebar.Item>
            </Link>
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item
                active={tab === 'comments'}
                icon={HiAnnotation}
                as='div'
              >
                Comments
              </Sidebar.Item>
            </Link>
          </>
        )}
        <Sidebar.Item
          icon={HiArrowSmRight}
          className='cursor-pointer'
          onClick={handleSignout}
        >
          Sign Out
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
  );
}
