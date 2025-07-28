import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
// State chứa thông tin của người dùng xuyên suốt quá trình dùng app
// Các components có chứa dữ liệu của người dùng
// khi được set lại thì sẽ load lại DOM
// các dùng
// const {user,setUsuer} = useUser();
// user là dữ liệu của user
// setUser là hàm gán lại biến cho user
// useEffect(()=>{
//   // Update lại DOM
// },[user])
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
