import React from "react";

// Bạn có thể chỉnh sửa thông tin ở đây
const info = {
  author: "Hoàng Hải",
  email: "hoanghaitdvp98@gmail.com",
  website: "https://sotay.online",
  appName: "Sổ tay online",
};

const TermsInfo = () => {
  const { author, email, website, appName } = info;

  return (
    <section
      className={`text-[14px] leading-6 text-gray-800 gap-3 m-3`}
      role="document"
      aria-label="Điều khoản sử dụng & thông tin tác giả"
    >
      <h3 className="text-[16px] font-semibold mb-2 text-center">
        Điều khoản sử dụng & thông tin tác giả
      </h3>

      <p className="mb-2">
        {appName ? <strong>{appName}</strong> : "Phần mềm"} được phát triển và
        cung cấp bởi <strong>{author}</strong> với mục đích hỗ trợ người dùng
        trong công việc và đời sống.
      </p>

      <ul className="list-disc pl-5 space-y-2 mb-3">
        <li>
          Trong giai đoạn sử dụng <strong>miễn phí</strong>, tác giả{" "}
          <strong>không chịu trách nhiệm</strong> đối với bất kỳ sai sót, lỗi,
          thiệt hại hay vi phạm nào phát sinh từ việc sử dụng phần mềm.
        </li>
        <li>
          Người dùng tự chịu trách nhiệm đối với mọi dữ liệu, nội dung và kết
          quả khai thác từ ứng dụng; cam kết không sử dụng vào mục đích vi phạm
          pháp luật, gây hại hoặc xâm phạm quyền lợi bên thứ ba.
        </li>
        <li>
          Tác giả có quyền thay đổi, nâng cấp hoặc chấm dứt cung cấp sản phẩm
          bất cứ lúc nào mà không cần thông báo trước.
        </li>
        <li>
          Việc tiếp tục sử dụng phần mềm đồng nghĩa với việc bạn đã đọc, hiểu và
          chấp nhận các điều khoản này.
        </li>
      </ul>

      <div className="border-t pt-2 mt-2">
        <div className="font-medium mb-1">Liên hệ hỗ trợ</div>
        <div>
          📧 Email:{" "}
          <a href={`mailto:${email}`} className="underline">
            {email}
          </a>
        </div>
        {website && (
          <div>
            🌐 Website:{" "}
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {website}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default TermsInfo;
