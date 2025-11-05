import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = {};

const ScrollRestoration = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType(); 

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions[pathname] = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const restore = () => {
      if (navigationType === "POP" && scrollPositions[pathname] !== undefined) {
        window.scrollTo(0, scrollPositions[pathname]);
      } else {
        window.scrollTo(0, 0);
      }
    };

    const id = requestAnimationFrame(() => setTimeout(restore, 50));
    return () => cancelAnimationFrame(id);
  }, [pathname, navigationType]);

  return null;
};

export default ScrollRestoration;




