import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const UserState = (props) => {
  const [user, setUser] = useState(cookies.get("user") || {});

  useEffect(() => {
    cookies.set("user", user);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
