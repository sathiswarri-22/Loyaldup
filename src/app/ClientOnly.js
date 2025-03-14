"use client"; // Ensure this runs only on the client side

import { useEffect, useState } from "react";

const ClientOnly = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [ mounted , setMounted ] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  if (!isClient && !mounted) return null; // Prevents rendering on the server

  return <>{children}</>;
};

export default ClientOnly;