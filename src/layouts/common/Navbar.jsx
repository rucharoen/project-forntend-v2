import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IconUserCircle } from "@tabler/icons-react";
import LoginModal from "../../pages/main/auth/LoginPage";

const MainNavbar = ({ isUser, logOut }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  useEffect(() => {
    document.body.classList.toggle("modal-open", showLogin);
    if (!showLogin) {
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showLogin]);

  const toggleNavbar = () => setNavbarOpen(!navbarOpen);
  const closeNavbar = () => setNavbarOpen(false);

  const loginButtonStyle = {
    backgroundColor: "rgba(0, 186, 242, 1)",
    borderColor: "rgba(0, 186, 242, 1)",
    color: "white",
    fontSize: "18px",
  };

  const handleMenuClick = (menu) => {
  closeNavbar();

  setTimeout(() => {
    if (menu === "หน้าแรก") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (menu === "โปรโมชัน") {
      const section = document.getElementById("PromotionSection");
      section?.scrollIntoView({ behavior: "smooth" });
    } else if (menu === "ประเภทห้อง") {
      const section = document.getElementById("PopularSection");
      section?.scrollIntoView({ behavior: "smooth" });
    } else if (menu === "กิจกรรม") {
      const section = document.getElementById("ActivitySection");
      section?.scrollIntoView({ behavior: "smooth" });
    }
  }, 100); // รอให้ navbar ปิดก่อน
};


  const renderUserSection = (isMobile = false) => {
    if (!isUser) {
      const mobileStyle = isMobile
        ? {
            ...loginButtonStyle,
            width: "327px",
            display: "block",
          }
        : loginButtonStyle;

      return (
        <button
          className={`btn ${isMobile ? "mt-0 mb-3 mx-auto" : ""}`}
          style={mobileStyle}
          onClick={openLogin}
        >
          เข้าสู่ระบบ
        </button>
      );
    }

    return (
      <Dropdown align="end">
        <Dropdown.Toggle
          as="span"
          style={{ cursor: "pointer" }}
          id={`dropdown-user-${isMobile ? "mobile" : "desktop"}`}
          className="d-flex align-items-center text-secondary"
          bsPrefix="dropdown-toggle-no-caret"
        >
          <span className="ms-2 text-dark">
            {isUser.name} {isUser.lastname} :
          </span>
          <IconUserCircle stroke={2} size={56} color="black" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={logOut}>
            <i className="bi bi-box-arrow-right me-2"></i> ออกจากระบบ
          </Dropdown.Item>
        </Dropdown.Menu>
        <style>{`
          .dropdown-toggle-no-caret::after {
            display: none !important;
          }
        `}</style>
      </Dropdown>
    );
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ background: "#f0f0f0", fontSize: "20px" }}
      >
        <div className="container position-relative">
          <a className="navbar-brand p-0 m-0 me-3" href="#Home">
            <img
              src="https://www.baraliresort.com/images/logo.png"
              alt="logo"
              height="60"
            />
          </a>

          <button
            className="navbar-toggler ms-auto"
            type="button"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`navbar-collapse mobile-overlay ${
              navbarOpen ? "show" : ""
            }`}
            id="mainNavbar"
          >
            <ul className="navbar-nav mb-2 mb-lg-0 d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-lg-4 px-3 py-4 py-lg-0">
              {/* ปุ่มเข้าสู่ระบบเฉพาะ mobile */}
              <li className="nav-item d-lg-none">{renderUserSection(true)}</li>

              {/* เมนูหลัก */}
              {["หน้าแรก", "โปรโมชัน", "ประเภทห้อง", "กิจกรรม", "ติดต่อเรา"].map(
                (text, i) => (
                  <li className="nav-item" key={i}>
                    <a
                      className="nav-link text-dark"
                      href="#!"
                      onClick={() => handleMenuClick(text)}
                    >
                      {text}
                    </a>
                  </li>
                )
              )}

              {/* TH/THB mobile only */}
              <li className="nav-item d-flex align-items-center gap-2 d-lg-none mt-2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ick2xvSWyHyDFgl5YWf3xLQ8qRKQByx2ScOAjyEoiA&s&ec=72940543"
                  alt="ธง"
                  width="24"
                  height="18"
                />
                <span>TH/THB</span>
              </li>
            </ul>

            {/* ส่วนผู้ใช้ desktop */}
            <div className="d-none d-lg-flex align-items-center gap-3 ms-auto">
              <div className="d-flex align-items-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ick2xvSWyHyDFgl5YWf3xLQ8qRKQByx2ScOAjyEoiA&s&ec=72940543"
                  alt="ธง"
                  width="32"
                  height="24"
                  className="me-2"
                />
                <span>TH/THB</span>
              </div>
              {renderUserSection(false)}
            </div>
          </div>
        </div>
      </nav>

      {showLogin && <LoginModal showLogin={showLogin} closeLogin={closeLogin} />}

      {/* CSS ลอย overlay menu บน mobile */}
      <style>{`
        @media (max-width: 991.98px) {
          .mobile-overlay {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            z-index: 1000;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease-in-out;
          }
          .mobile-overlay:not(.show) {
            display: none;
          }
          .navbar-nav > .nav-item > .btn {
            width: 327px;
          }
        }
      `}</style>
    </>
  );
};

export default MainNavbar;
