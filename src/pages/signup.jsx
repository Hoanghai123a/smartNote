import React from "react";

const Signup_index = () => {
  return (
    <div className="signup_form flexc">
      <div className="form_title">Đăng Ký Tài Khoản</div>

      <div className="form_group flexc">
        <label htmlFor="signupUsername">Tên đăng nhập:</label>
        <input
          id="signupUsername"
          className="form_input_field"
          type="text"
          placeholder="Nhập tên đăng nhập"
        />

        <label htmlFor="signupPassword">Mật khẩu:</label>
        <input
          id="signupPassword"
          className="form_input_field"
          type="password"
          placeholder="Nhập mật khẩu"
        />

        <label htmlFor="signupConfirmPassword">Nhập lại mật khẩu:</label>
        <input
          id="signupConfirmPassword"
          className="form_input_field"
          type="password"
          placeholder="Nhập lại mật khẩu"
        />
      </div>

      <div className="form_group flexc">
        <label htmlFor="fullName">Tên đầy đủ:</label>
        <input
          id="fullName"
          className="form_input_field"
          type="text"
          placeholder="Nhập tên đầy đủ của bạn"
        />

        <label htmlFor="dob">Ngày tháng năm sinh:</label>
        <input id="dob" className="form_input_field" type="date" />

        <label htmlFor="storeName">Tên cửa hàng:</label>
        <input
          id="storeName"
          className="form_input_field"
          type="text"
          placeholder="Tên cửa hàng của bạn"
        />

        <label htmlFor="location">Địa điểm:</label>
        <input
          id="location"
          className="form_input_field"
          type="text"
          placeholder="Địa chỉ cửa hàng"
        />

        <label htmlFor="phoneNumber">Số điện thoại:</label>
        <input
          id="phoneNumber"
          className="form_input_field"
          type="tel"
          placeholder="Số điện thoại liên hệ"
        />
      </div>

      <button type="submit" className="signup_button">
        Đăng Ký
      </button>

      <div className="form_footer">
        Đã có tài khoản?{" "}
        <a href="#" className="login_link">
          Đăng nhập
        </a>
      </div>
    </div>
  );
};

export default Signup_index;
