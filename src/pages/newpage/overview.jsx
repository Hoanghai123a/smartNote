import React, { useState } from "react";

const OverView = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Sample data for client cards
  const pinnedClients = [
    {
      id: 1,
      name: "Khách hàng 1",
      transactions: [
        { period: "Hôm nay", amount: "1.000.000đ", trend: "up" },
        { period: "Hôm qua", amount: "1.000.000đ", trend: "up" },
        { period: "Hôm kia", amount: "1.000.000đ", trend: "down" },
      ],
    },
    {
      id: 2,
      name: "Khách hàng 2",
      transactions: [
        { period: "Hôm nay", amount: "1.000.000đ", trend: "up" },
        { period: "Hôm qua", amount: "1.000.000đ", trend: "up" },
        { period: "Hôm kia", amount: "1.000.000đ", trend: "down" },
      ],
    },
  ];

  const otherClients = [
    {
      id: 3,
      name: "Khách hàng 3",
      transactions: [
        { period: "Hôm nay", amount: "1.000.000đ", trend: "up" },
        { period: "Hôm qua", amount: "1.000.000đ", trend: "up" },
        { period: "Hôm kia", amount: "1.000.000đ", trend: "down" },
      ],
    },
  ];

  const TrendArrow = ({ trend }) => (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={trend === "up" ? "-rotate-90" : "rotate-90"}
      style={{
        transform: trend === "up" ? "rotate(-89.576deg)" : "rotate(90.747deg)",
      }}
    >
      <path
        d="M5.51684 8.74882L5.56434 2.33233M5.56434 2.33233L2.33235 5.51682M5.56434 2.33233L8.74884 5.56433"
        stroke={trend === "up" ? "#14AE5C" : "#EC221F"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ClientCard = ({ client }) => (
    <div className="w-[164px] h-[165px] flex-shrink-0">
      <div className="w-[164px] h-[165px] rounded-[17px] bg-white shadow-[0_3px_3.3px_0_rgba(0,0,0,0.25)] p-2.5 relative">
        <div className="flex justify-between items-start mb-[39px]">
          <h4 className="text-black text-[13px] font-bold">{client.name}</h4>
          <span className="text-[#0084FF] text-[18px] font-bold">+</span>
        </div>

        <div className="flex gap-2.5 mb-4">
          <div className="flex flex-col gap-3 w-[51px]">
            {client.transactions.map((transaction, index) => (
              <div
                key={index}
                className="text-[#767676] text-[12px] font-normal"
              >
                {transaction.period}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 w-[11px] mt-[3px]">
            {client.transactions.map((transaction, index) => (
              <TrendArrow key={index} trend={transaction.trend} />
            ))}
          </div>

          <div className="flex flex-col gap-[11px] w-[69px]">
            {client.transactions.map((transaction, index) => (
              <div key={index} className="text-black text-[13px] font-normal">
                {transaction.amount}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-[15px] right-2 text-[#0084FF] text-[11px] font-normal">
          Xem thêm &gt;&gt;
        </div>
      </div>
    </div>
  );

  const MenuOverlay = () => (
    <div className="absolute top-[106px] left-[168px] w-[189px] h-[304px] z-10">
      <div className="w-[189px] h-[304px] rounded-[17px] bg-white shadow-[0_0_3.3px_2px_rgba(0,0,0,0.25)] p-5 flex flex-col gap-[21px]">
        <div className="flex items-center gap-2.5">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/11700a9f30b3dd4633eb003c5a089bce18660efe?width=59"
            alt=""
            className="w-[29px] h-[26px]"
          />
          <span className="text-[#767676] text-base font-normal">
            Khách hàng
          </span>
        </div>
        <div className="flex items-center gap-[13px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/9e079c3d325a93fa2d3da88f2c24fe503155a133?width=45"
            alt=""
            className="w-[23px] h-[23px]"
          />
          <span className="text-[#767676] text-base font-normal">
            Phân nhóm
          </span>
        </div>
        <div className="flex items-end gap-[9px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/b6a7dd569554ab7de384a06070aca7e8f20b07fe?width=55"
            alt=""
            className="w-[28px] h-[28px]"
          />
          <span className="text-[#767676] text-base font-normal">
            Đổi mật khẩu
          </span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/02c5f60b62c57dc1fa6f5da383521558560619c1?width=55"
            alt=""
            className="w-[28px] h-[28px]"
          />
          <span className="text-[#767676] text-base font-normal">
            Về chúng tôi
          </span>
        </div>
        <div className="flex items-center gap-[9px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/e2a4de25c93c4461583103f392cc19b0e51b203d?width=53"
            alt=""
            className="w-[27px] h-[27px]"
          />
          <span className="text-[#767676] text-base font-normal">
            Đăng xuất
          </span>
        </div>
        <div className="flex items-center gap-[7px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/0f395103c2ecb0a9de1b1fb1f87fda3bf0757cbe?width=55"
            alt=""
            className="w-[28px] h-[28px]"
          />
          <span className="text-[#767676] text-base font-normal">
            Hướng dẫn
          </span>
        </div>
      </div>
    </div>
  );

  const InfoModal = () => (
    <div className="absolute top-[106px] left-20 w-[260px] h-[347px] z-10">
      <div className="w-[260px] h-[347px] rounded-lg border border-black bg-white p-[22px]">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/cf5be2f918dc8b1094c97b348f378bd21e74ae61?width=234"
          alt="Client avatar"
          className="w-[117px] h-[127px] rounded-[11px] mx-auto mb-[14px] block"
        />
        <div className="flex items-center gap-[5px] mb-[41px]">
          <span className="text-black text-[12px] font-normal">
            Họ tên: Hoàng Văn A
          </span>
          <div className="w-[17px] h-[17px]">
            <svg
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8.5" cy="8.84" r="8.5" fill="#0084FF" />
              <path
                d="M7.27395 12.732L5 10.012L5.79588 9.06L7.27395 10.828L11.026 6.34L11.8219 7.292L7.27395 12.732Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-[21px] opacity-73">
          <div className="flex items-center gap-[5px] opacity-72">
            <span className="text-black text-[12px] font-normal">SĐT: </span>
            <span className="text-black text-[12px] font-normal">
              0343-751-753
            </span>
          </div>
          <div className="flex items-center gap-[5px] opacity-72">
            <span className="text-black text-[12px] font-normal">
              Địa chỉ:{" "}
            </span>
            <span className="text-black text-[12px] font-normal">
              Xạ Hương - Tam Đảo - Phú Thọ
            </span>
          </div>
          <div className="flex items-center gap-[5px] opacity-72 shadow-[inset_-1px_4px_4px_0_rgba(0,0,0,0.25)]">
            <span className="text-black text-[12px] font-normal">
              Số lượng KH:
            </span>
            <span className="text-black text-[12px] font-normal">150</span>
          </div>
          <div className="flex items-center gap-[6px] opacity-72 shadow-[inset_-1px_4px_4px_0_rgba(0,0,0,0.25)]">
            <span className="text-black text-[12px] font-normal">
              Số lượng hiện tại:
            </span>
            <span className="text-black text-[12px] font-normal">150</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[375px] h-[812px] bg-white relative ">
      {/* Header */}
      <div className="flex items-center justify-between px-[17px] pt-[46px] h-[89px]">
        <div className="w-[38px] h-[38px]">
          <div className="w-[38px] h-[38px] rounded-[17px] bg-[#F3F3F3] shadow-[0_3px_3.3px_0_rgba(0,0,0,0.25)] flex items-center justify-center">
            <svg
              width="30"
              height="33"
              viewBox="0 0 30 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.0206 28.2361V25.6083C25.0206 24.2145 24.5032 22.8777 23.5822 21.8921C22.6611 20.9065 21.412 20.3528 20.1094 20.3528H10.287C8.98442 20.3528 7.73523 20.9065 6.8142 21.8921C5.89316 22.8777 5.37573 24.2145 5.37573 25.6083V28.2361M20.1094 9.84168C20.1094 12.7442 17.9106 15.0972 15.1982 15.0972C12.4858 15.0972 10.287 12.7442 10.287 9.84168C10.287 6.93911 12.4858 4.58612 15.1982 4.58612C17.9106 4.58612 20.1094 6.93911 20.1094 9.84168Z"
                stroke="#5A5A5A"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="w-[214px] h-[43px]">
          <div className="w-[214px] h-[43px] rounded-[17px] bg-white shadow-[0_3px_3.3px_0_rgba(0,0,0,0.25)] flex items-center px-2.5">
            <svg
              width="22"
              height="24"
              viewBox="0 0 22 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.9746 20.5778L12.349 14.5578C11.9025 14.94 11.3891 15.2426 10.8087 15.4656C10.2282 15.6885 9.61062 15.8 8.95579 15.8C7.3336 15.8 5.96068 15.1988 4.83706 13.9964C3.71343 12.794 3.15161 11.3248 3.15161 9.58889C3.15161 7.85296 3.71343 6.3838 4.83706 5.18139C5.96068 3.97898 7.3336 3.37778 8.95579 3.37778C10.578 3.37778 11.9509 3.97898 13.0745 5.18139C14.1982 6.3838 14.76 7.85296 14.76 9.58889C14.76 10.2896 14.6558 10.9506 14.4474 11.5717C14.2391 12.1928 13.9563 12.7422 13.5991 13.22L19.2247 19.24L17.9746 20.5778ZM8.95579 13.8889C10.072 13.8889 11.0207 13.4708 11.8021 12.6347C12.5834 11.7986 12.9741 10.7833 12.9741 9.58889C12.9741 8.39444 12.5834 7.37917 11.8021 6.54306C11.0207 5.70694 10.072 5.28889 8.95579 5.28889C7.8396 5.28889 6.89084 5.70694 6.10951 6.54306C5.32818 7.37917 4.93751 8.39444 4.93751 9.58889C4.93751 10.7833 5.32818 11.7986 6.10951 12.6347C6.89084 13.4708 7.8396 13.8889 8.95579 13.8889Z"
                fill="#79747E"
              />
            </svg>
            <span className="ml-7 text-[#ADADAD] text-[13px] font-bold">
              Tìm theo tên...
            </span>
          </div>
        </div>

        <button
          className="bg-none border-none cursor-pointer p-0"
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg
            width="31"
            height="38"
            viewBox="0 0 31 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.43457 28.0556V25.0297H27.2048V28.0556H4.43457ZM4.43457 20.4908V17.4648H27.2048V20.4908H4.43457ZM4.43457 12.926V9.90002H27.2048V12.926H4.43457Z"
              fill="#1D1B20"
            />
          </svg>
        </button>
      </div>

      {/* Ghim Section */}
      <div className="px-[17px] mb-10">
        <h3 className="text-black text-[11px] font-bold mb-[25px]">Ghim</h3>
        <div className="flex gap-[15px]">
          {pinnedClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      </div>

      {/* Danh sách khác Section */}
      <div className="px-[17px] mb-10">
        <h3 className="text-black text-[11px] font-bold mb-[25px]">
          Danh sách khác
        </h3>
        <div className="flex gap-[15px]">
          {otherClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      </div>

      {/* Add Button */}
      <div className="absolute bottom-[115px] right-[18px] w-[55px] h-[55px]">
        <svg
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="27.5" cy="27.5" r="27.5" fill="#0084FF" />
        </svg>
        <svg
          className="absolute top-2 left-2"
          width="39"
          height="39"
          viewBox="0 0 39 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.875 21.125H8.125V17.875H17.875V8.125H21.125V17.875H30.875V21.125H21.125V30.875H17.875V21.125Z"
            fill="#FEF7FF"
          />
        </svg>
      </div>

      {/* Menu Overlay */}
      {showMenu && <MenuOverlay />}

      {/* Info Modal */}
      {showInfo && <InfoModal />}
    </div>
  );
};

export default OverView;
