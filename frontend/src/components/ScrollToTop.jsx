import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Este componente no renderiza nada en el DOM.
const ScrollToTop = () => {
  const { pathname } = useLocation();

   // Efecto que se ejecuta cada vez que la ubicación cambia
  useEffect(() => {
    // Hacer scroll hacia la parte superior de la página
    window.scrollTo(0, 0);
  }, [pathname]);

   // Este componente no renderiza nada en el DOM
  return null;
};

export default ScrollToTop;