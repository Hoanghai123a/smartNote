import React from 'react';

const NewPage = () => {
  return (
    <div className="bg-white min-h-screen relative">
      {/* Header */}
      <div className="px-7 py-6">
        <div className="flex items-center justify-between">
          {/* User Avatar */}
          <div className="user-avatar">
            <div className="w-11 h-10 rounded-2xl bg-gray-200 shadow-md flex items-center justify-center">
              <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.5 28.875V26.125C27.5 24.6663 26.9205 23.2674 25.8891 22.2359C24.8576 21.2045 23.4587 20.625 22 20.625H11C9.54131 20.625 8.14236 21.2045 7.11091 22.2359C6.07946 23.2674 5.5 24.6663 5.5 26.125V28.875M22 9.625C22 12.6626 19.5376 15.125 16.5 15.125C13.4624 15.125 11 12.6626 11 9.625C11 6.58743 13.4624 4.125 16.5 4.125C19.5376 4.125 22 6.58743 22 9.625Z" stroke="#5A5A5A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container relative">
            <div className="w-60 h-11 rounded-2xl bg-white shadow-md flex items-center px-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z" fill="#79747E"/>
              </svg>
              <span className="ml-2 text-gray-400 text-sm font-bold">Tìm theo tên...</span>
            </div>
          </div>

          {/* Menu Button */}
          <div className="menu-button">
            <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.25 28.5V25.3333H29.75V28.5H4.25ZM4.25 20.5833V17.4167H29.75V20.5833H4.25ZM4.25 12.6667V9.5H29.75V12.6667H4.25Z" fill="#1D1B20"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Ghim Section */}
      <div className="px-5 mb-4">
        <h3 className="text-black text-xs font-bold mb-4">Ghim</h3>
        
        <div className="flex gap-3 overflow-x-auto">
          {/* Client Card 1 */}
          <div className="client-card flex-shrink-0">
            <div className="w-47 h-41 rounded-2xl bg-white shadow-md p-3 relative">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-black text-sm font-bold">Khách hàng 1</h4>
                <span className="text-blue-500 text-lg font-bold">+</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Hôm nay</span>
                  <span className="text-black text-sm">1.000.000đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Hôm qua</span>
                  <span className="text-black text-sm">1.000.000đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Hôm kia</span>
                  <span className="text-black text-sm">1.000.000đ</span>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-blue-500 text-xs">Xem thêm &gt;&gt;</span>
              </div>
            </div>
          </div>

          {/* Client Card 2 */}
          <div className="client-card flex-shrink-0">
            <div className="w-47 h-41 rounded-2xl bg-white shadow-md p-3 relative">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-black text-sm font-bold">Khách hàng 1</h4>
                <span className="text-blue-500 text-lg font-bold">+</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Hôm nay</span>
                  <span className="text-black text-sm">1.000.000đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Hôm qua</span>
                  <span className="text-black text-sm">1.000.000đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Hôm kia</span>
                  <span className="text-black text-sm">1.000.000đ</span>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-blue-500 text-xs">Xem thêm &gt;&gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách khác Section */}
      <div className="px-5 mt-16">
        <h3 className="text-black text-xs font-bold">Danh sách khác</h3>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6">
        <div className="add-button relative">
          <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="27.5" cy="27.5" r="27.5" fill="#0084FF"/>
          </svg>
          <svg className="absolute top-2 left-2" width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.875 21.125H8.125V17.875H17.875V8.125H21.125V17.875H30.875V21.125H21.125V30.875H17.875V21.125Z" fill="#FEF7FF"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NewPage;
