import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DashComments, DashPosts, DashProfile, DashSidebar, DashUsers, DashboardComp } from "../components";

export default function Dashboard() {
  const location = useLocation();
  // Estado para almacenar la pestaña actual
  const [tab, setTab] = useState("");

  // Efecto para gestionar la pestaña desde la URL
  useEffect(() => {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    console.log(tabFromUrl);

    // Actualizar el estado 'tab' si se obtiene un valor de la URL
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}
      {/* posts... */}
      {tab === "posts" && <DashPosts />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* comments  */}
      {tab === "comments" && <DashComments />}
      {/* dashboard comp */}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
}
