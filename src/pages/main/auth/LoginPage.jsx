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
        style={{ background: "rgba(112, 112, 112, 0.3)", minHeight: "100vh" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document" >
          <div className="modal-content border-0 rounded-3 p-2 " >
            <button
              type="button"
              className="btn-close position-absolute end-0 m-3 z-3"
              onClick={closeLogin} // ✅ ใช้งานได้แน่นอน
              aria-label="Close"
            ></button>

            <div
              className="modal-body text-center"
              style={{
                padding: "2rem",
                backgroundColor: "#ffffff",
                borderRadius: "0.75rem",
                
                
                lineHeight: "1.6",
              }}
            >
              <img
                src="https://www.baraliresort.com/images/logo.png"
                alt="logo"
                width="113px"
                height="88px"
                className="mb-3"
              />
              <h5 className="fw-bold mb-3">เข้าสู่ระบบ</h5>
              <p
                className="mb-4"
                style={{
                  color: "rgba(91, 91, 91, 1)",
                }}
              >
                กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
              </p>

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
                    ชื่อผู้ใช้
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      border: "2px solid rgba(184, 179, 179, 1)",
                    }}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3 text-start">
                  <label htmlFor="password" className="form-label fw-semibold">
                    รหัสผ่าน
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        border: "2px solid rgba(184, 179, 179, 1)",
                        borderRight: "none", // เพื่อไม่ชนกับปุ่มด้านขวา
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={toggleShowPassword}
                      style={{
                        border: "2px solid rgba(184, 179, 179, 1)",
                        borderLeft: "none", // ให้ติดกันกับ input
                      }}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                        }`}
                      ></i>
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-100 mb-3"
                  style={{
                    backgroundColor: "rgba(0, 186, 242, 1)",
                    borderColor: "rgba(0, 186, 242, 1)",
                    color: "#fff",
                    fontWeight: 400,
                    fontSize: "1rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid transparent",
                    marginTop: "18px"
                  }}
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
                    <>เข้าสู่ระบบ</>
                  )}
                </button>
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
