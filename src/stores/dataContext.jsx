import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
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
export const DataProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState(null);
  return (
    <DataContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useGlobalData = () => useContext(DataContext);
