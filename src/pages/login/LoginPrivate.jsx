  import { useNavigate } from "react-router-dom";
  import { useState, useMemo } from "react";
  import { toast } from "react-toastify";
  import swal from "sweetalert";
  import "./LoginPrivate.css";
  import { getRoleFromToken } from "./jwtHelper";
  import imgLogin from "/src/assets/images/login-private.jpg";
  import { useLocation, Link  } from "react-router-dom";
  import { useAuth } from "../../contexts/Auth";
  import { authAPI } from "@/services/fastapi"; 

  const LoginPrivate = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login, getDefaultRoute } = useAuth();


const handleLogin = async (event) => {
  event.preventDefault();

  if (!email || !password) {
    toast.error("Thiếu Email hoặc Mật khẩu.");
    return;
  }

  try {
    setSubmitting(true);

    const result = await login(email, password);
    console.log("Login result:", result);

    if (result?.ok) {
      const { token } = result;

      const role = getRoleFromToken(token || "");
      console.log("Role from token:", role);

      let appRole = null;
      if (role === "admin") appRole = "SYSTEM_ADMIN";
      else if (role === "content_manager") appRole = "CONTENT_MANAGER";
      else if (role === "consultant") appRole = "CONSULTANT";
      else if (role === "admission_officer") appRole = "ADMISSION_OFFICER";
      else appRole = "STUDENT";
     // 🔹 Nếu là student thì cho về /profile
      let targetRoute = "";
      if (appRole === "STUDENT") {
        targetRoute = "/profile";
      } else {
        targetRoute = getDefaultRoute(appRole);
      }

      toast.success(
        `Đăng nhập thành công! Chuyển đến ${
          appRole === "STUDENT" ? "Profile" : "Dashboard"
        }.` 
      );

      navigate(targetRoute);
    } else {
      swal({
        title: "Sai tài khoản hoặc mật khẩu",
        text: result?.message || "Vui lòng kiểm tra lại email hoặc mật khẩu.",
        icon: "error",
        buttons: {
          ok: { text: "OK", value: true, className: "swal-ok-button" },
        },
      });
    }
  } catch (error) {
    console.error("Login failed:", error);
    
    // Check if account is banned/deactivated
    if (error.response?.status === 403 || 
        (error.response?.data?.detail && error.response.data.detail.includes('deactivated'))) {
      toast.error("⚠️ Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.", { autoClose: 8000 });
    } else if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  } finally {
    setSubmitting(false);
  }
};

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleOnClick = () => {
      window.location.href = "/";
    };

    return (
      <>
        <header>
          <div>
            <div className="logo-mandb" onClick={handleOnClick}>
              <h3>FPT</h3>
            </div>
            <div className="line"></div>
            <h3 className="text-login">Login</h3>
          </div>
        </header>

        <div className="head-content">
          <img src={imgLogin} alt="" />
          <div className="content">
            <form className="form-login" onSubmit={handleLogin}>
              <h3 className="text-welcome">Welcome</h3>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

  

  <div className="text-center text-sm mt-4">
    <span>Chưa có tài khoản? <Link
      to="/#admissions"
      className="text-[#EB5A0D] hover:underline font-medium ml-1"
    >
      Đăng ký ngay
    </Link> </span>
  </div>
              <input
                className="button-login"
                type="submit"
                value={submitting ? "Processing..." : "Login"}
                disabled={submitting}
              />
              
              <input
                className="button-login button-admin"
                type="button"
                value="Quản Trị Viên"
                onClick={() => navigate('/loginforad')}
              />
            </form>
          </div>
        </div>

        <div className="footer-login">
          <div>
            <h2></h2>
            <div>
              <ul>
                <h3>Reach us</h3>
                <li>
                  <img src="/src/assets/phone.svg" alt="" />
                  <span>+843899999999</span>
                </li>
                <li>
                  <img src="/src/assets/email.svg" alt="" />
                  <span>petcare@gmail.com</span>
                </li>
                <li>
                  <img src="/src/assets/location.svg" alt="" />
                  <span>Long Thanh My, Thu Duc, Ho Chi Minh, Viet Nam</span>
                </li>
              </ul>
              <ul>
                <h3>Company</h3>
                <li>About</li>
                <li>Contact us</li>
              </ul>
              <ul>
                <h3>Legal</h3>
                <li>Privacy Policy</li>
                <li>Terms & Services</li>
                <li>Terms Of Use</li>
              </ul>
              <ul>
                <h3>Useful links</h3>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <img src="/src/assets/face.svg" alt="" />
              <img src="/src/assets/insta.svg" alt="" />
              <img src="/src/assets/twitter.svg" alt="" />
            </div>
            <div className="line-end"></div>
            <h5>Copyright&copy; : petcare@gmail.com</h5>
          </div>
        </div>
      </>
    );
  };

  export default LoginPrivate;
