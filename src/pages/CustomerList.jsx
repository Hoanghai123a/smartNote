import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useUser } from "../stores/UserContext";
import ChangePass from "../assets/Components/change_pass.jsx";
import ClientManager from "../assets/Components/client.jsx";
import CategoryManager from "../assets/Components/Category.jsx";

const CustomerList = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showMenu, setShowMenu] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    try {
      document.cookie = "token=; Max-Age=0; path=/";
    } catch (e) {
      console.error("Clear cookie error:", e);
    }
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    message.success("Đã đăng xuất");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      id: 1,
      label: "Khách hàng",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/7c0615cd87af4ed23f1019999f704496735e54af?width=60",
      component: ClientManager,
    },
    {
      id: 2,
      label: "Phân nhóm",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/f7f95bd488bbe40a9590f42e6c0b488856294021?width=46",
      component: CategoryManager,
    },
    {
      id: 3,
      label: "Đổi mật khẩu",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/013365e535092f67bc2bf84bce18d96091eb1e76?width=56",
      component: ChangePass,
    },
    {
      id: 4,
      label: "Về chúng tôi",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/dfd97ef3f5c0ea1db6f90f69ce77986472094f7b?width=56",
      action: () => message.info("Về chúng tôi"),
    },
    {
      id: 5,
      label: "Đăng xuất",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/e5b3cb8a2903ac0db6559536a0b5d7bb5a65b17c?width=54",
      action: handleLogout,
    },
    {
      id: 6,
      label: "Hướng dẫn",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/82d10d735fab4a750e804a3f52877d4cbd9321fe?width=56",
      action: () => message.info("Hướng dẫn sử dụng"),
    },
  ];

  return (
    <div className="customer-list-container">
      {/* Header with back button and menu */}
      <div className="header-section">
        <button className="back-button" onClick={handleBack}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z"
              fill="#1D1B20"
            />
          </svg>
        </button>

        <button className="menu-button" onClick={handleMenuToggle}>
          <svg
            width="34"
            height="38"
            viewBox="0 0 34 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.25 28.5V25.3333H29.75V28.5H4.25ZM4.25 20.5833V17.4167H29.75V20.5833H4.25ZM4.25 12.6667V9.5H29.75V12.6667H4.25Z"
              fill="#1D1B20"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="dropdown-menu">
          <div className="menu-container">
            {menuItems.map((item) => {
              const MenuComponent = item.component;

              if (MenuComponent) {
                return (
                  <MenuComponent key={item.id}>
                    <div className="menu-item">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="menu-icon"
                      />
                      <span className="menu-text">{item.label}</span>
                    </div>
                  </MenuComponent>
                );
              }

              return (
                <button
                  key={item.id}
                  className="menu-item"
                  onClick={item.action}
                >
                  <img src={item.icon} alt={item.label} className="menu-icon" />
                  <span className="menu-text">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .customer-list-container {
          width: 430px;
          height: 932px;
          background: #fff;
          position: relative;
        }

        .header-section {
          position: relative;
          height: 80px;
        }

        .back-button {
          width: 54px;
          height: 45px;
          border-radius: 17px;
          background: #fff;
          box-shadow: 0 3px 3.3px 0 rgba(0, 0, 0, 0.25);
          position: absolute;
          left: 15px;
          top: 16px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .back-button:hover {
          background: #f5f5f5;
        }

        .menu-button {
          width: 54px;
          height: 45px;
          border-radius: 17px;
          background: #fff;
          box-shadow: 0 3px 3.3px 0 rgba(0, 0, 0, 0.25);
          position: absolute;
          right: 25px;
          top: 16px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .menu-button:hover {
          background: #f5f5f5;
        }

        .dropdown-menu {
          position: absolute;
          top: 80px;
          right: 25px;
          z-index: 1000;
        }

        .menu-container {
          width: 189px;
          height: 315px;
          border-radius: 17px;
          background: #fff;
          box-shadow: 0 0 3.3px 2px rgba(0, 0, 0, 0.25);
          padding: 20px 0;
          display: flex;
          flex-direction: column;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s;
          width: 100%;
        }

        .menu-item:hover {
          background: #f5f5f5;
        }

        .menu-icon {
          width: 28px;
          height: 28px;
          margin-right: 11px;
          object-fit: contain;
        }

        .menu-text {
          color: #767676;
          font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: normal;
        }

        @media (max-width: 430px) {
          .customer-list-container {
            width: 100vw;
            height: 100vh;
          }

          .dropdown-menu {
            right: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerList;
