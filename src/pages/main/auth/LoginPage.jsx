import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth/auth.service";


const LoginPage = ({ closeLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = "เข้าสู่ระบบ | บาราลี รีสอร์ท เกาะช้าง";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!email) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    } else if (/[ก-๙]/.test(email)) {
      newErrors.email = "อีเมลต้องไม่ประกอบด้วยอักษรภาษาไทย";
    }

    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setLoginError("");
      try {
        const user = await AuthService.login(email, password);
        if (user) {
          setShowToast(true);

          setTimeout(() => {
            setShowToast(false);
            window.location.reload(); // ✅ รีเฟรชหน้าเว็บทันทีหลังล็อกอิน
          }, 3000);
        }
      } catch (error) {
        console.error("Login error:", error);
        setLoginError(
          error.response?.data?.message ||
            "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ background: "rgba(0,0,0,0.3)", minHeight: "100vh" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 rounded-3 p-4">
            <button
              type="button"
              className="btn-close position-absolute end-0 m-3 z-3"
              onClick={closeLogin} // ✅ ใช้งานได้แน่นอน
              aria-label="Close"
            ></button>

            <div className="modal-body text-center">
              <img
                src="https://www.baraliresort.com/images/logo.png"
                alt="logo"
                width="113"
                height="88"
                className="mb-3"
              />
              <h5 className="fw-bold mb-3">เข้าสู่ระบบ</h5>
              <p className="text-muted mb-4">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>

              {loginError && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {loginError}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setLoginError("")}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3 text-start">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="bi bi-envelope-fill me-2"></i>อีเมล
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3 text-start">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="bi bi-lock-fill me-2"></i>รหัสผ่าน
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      id="password"
                      placeholder="กรอกรหัสผ่าน"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={toggleShowPassword}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                        }`}
                      ></i>
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      กำลังเข้าสู่ระบบ...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      เข้าสู่ระบบ
                    </>
                  )}
                </button>

                <p className="text-center">
                  ยังไม่มีบัญชี? <a href="/register">สมัครสมาชิก</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 11 }}
        >
          <div
            className="toast show align-items-center text-white bg-success border-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi bi-check-circle-fill me-2"></i>
                เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
