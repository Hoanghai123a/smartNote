import React from "react";

const Login_index = () => {
  return (
    <div className="login_form flexc">
      <div className="form_title form_detail">Đăng nhập</div>
      <div className="form_input form_detail flexc">
        <input className="username" placeholder="Tên đăng nhập"></input>
        <input
          className="password"
          type="password"
          placeholder="Mật khẩu"
        ></input>
      </div>

      <button type="submit" className="form_submit">
        Đăng nhập
      </button>

      <div className="form_footer">
        Chưa có tài khoản?{" "}
        <a href="#" className="signup_link">
          Đăng ký
        </a>
      </div>
    </div>
  );
};

export default Login_index;
