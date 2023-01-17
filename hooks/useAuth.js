import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";

// Own Dependencies
import { auth } from "../firebase/config";

export const useAuth = () => {
  const [authStateFetching, setAuthStateFetching] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setAuthStateFetching(false);
    });
  });

  return {
    authStateFetching,
    user,
  };
};
