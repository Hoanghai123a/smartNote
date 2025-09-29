import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FaLightbulb, FaUsers, FaCogs, FaRocket } from "react-icons/fa";

const About = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger trong menu */}
      <div onClick={() => setOpen(true)} className="w-full cursor-pointer">
        {children}
      </div>

      {/* Modal */}
      {open &&
        createPortal(
          <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
            <div className="bg-white max-w-[95vw] w-full max-h-[90vh] rounded-xl shadow-lg">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold">
                  Giới thiệu về sản phẩm
                </h1>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Nội dung */}
              <div className="p-6 text-gray-800 overflow-y-auto max-h-[80vh]">
                {/* Hero section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-6 text-center rounded-lg mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ứng dụng SmartNote
                  </h2>
                  <p>
                    Giúp quản lý ghi chú, công việc và khách hàng dễ dàng, nhanh
                    chóng và chuyên nghiệp.
                  </p>
                </div>

                {/* Sứ mệnh */}
                <section className="grid md:grid-cols-2 gap-12 items-center mb-12">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">
                      Sứ mệnh của chúng tôi
                    </h3>
                    <p>
                      Chúng tôi mong muốn mang đến cho người dùng một công cụ
                      quản lý thông tin hiện đại, dễ sử dụng nhưng vẫn mạnh mẽ.
                      Ứng dụng không chỉ là nơi lưu trữ ghi chú, mà còn là trợ
                      lý ảo đồng hành cùng bạn trong công việc và cuộc sống.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <FaLightbulb className="text-yellow-500 w-20 h-20" />
                  </div>
                </section>

                {/* Tính năng */}
                <section className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
                    <FaUsers className="w-10 h-10 text-blue-500 mb-4" />
                    <h4 className="font-semibold text-lg mb-2">
                      Quản lý khách hàng
                    </h4>
                    <p>
                      Lưu trữ thông tin khách hàng, lịch sử giao dịch và các ghi
                      chú liên quan một cách trực quan.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
                    <FaCogs className="w-10 h-10 text-green-500 mb-4" />
                    <h4 className="font-semibold text-lg mb-2">
                      Đồng bộ & bảo mật
                    </h4>
                    <p>
                      Dữ liệu của bạn luôn được bảo mật và đồng bộ trên nhiều
                      thiết bị, đảm bảo trải nghiệm liền mạch.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
                    <FaRocket className="w-10 h-10 text-purple-500 mb-4" />
                    <h4 className="font-semibold text-lg mb-2">
                      Hiệu suất vượt trội
                    </h4>
                    <p>
                      Giao diện đơn giản, tốc độ xử lý nhanh chóng, tối ưu cho
                      cả máy tính và thiết bị di động.
                    </p>
                  </div>
                </section>

                {/* Liên hệ */}
                <section className="bg-blue-50 p-6 rounded-xl text-center shadow">
                  <h3 className="text-2xl font-semibold mb-4">
                    Liên hệ với chúng tôi
                  </h3>
                  <p className="mb-4">
                    Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ:
                  </p>
                  <p className="font-medium">📧 support@smartnote.vn</p>
                  <p className="font-medium">📞 0343 751 753 (có zalo)</p>
                </section>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default About;
