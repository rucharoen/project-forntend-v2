import React, { useState, useEffect } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IconUserCircle } from "@tabler/icons-react";
import { Icon } from "@iconify/react";
import LoginModal from "../../pages/main/auth/LoginPage";
import Trolley from "./trolley";

const MainNavbar = ({ isUser, logOut }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const loginButtonStyle = {
    backgroundColor: "rgba(0, 186, 242, 1)",
    borderColor: "rgba(0, 186, 242, 1)",
    color: "white",
    fontSize: "18px",
  };

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);
  const toggleNavbar = () => setNavbarOpen(!navbarOpen);
  const closeNavbar = () => setNavbarOpen(false);

  useEffect(() => {
    document.body.classList.toggle("modal-open", showLogin);
    if (!showLogin) {
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showLogin]);

  useEffect(() => {
    const loadAccommodation = () => {
      const stored = localStorage.getItem("selectedAccommodation");
      try {
        setSelectedAccommodation(stored ? JSON.parse(stored) : []);
      } catch {
        setSelectedAccommodation([]);
      }
    };

    loadAccommodation();
    const handleChange = () => loadAccommodation();
    window.addEventListener("accommodationChanged", handleChange);
    return () =>
      window.removeEventListener("accommodationChanged", handleChange);
  }, []);

  const handleMenuClick = (menu) => {
    closeNavbar();
    setTimeout(() => {
      const sectionMap = {
        โปรโมชัน: "PromotionSection",
        ประเภทห้อง: "PopularSection",
        กิจกรรม: "ActivitySection",
        ติดต่อเรา: "Contact",
      };
      if (menu === "หน้าแรก") return navigate("/");
      const section = document.getElementById(sectionMap[menu]);
      section?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const renderUserSection = (isMobile = false) => {
    if (!isUser) {
      return (
        <button
          className={`btn ${isMobile ? "mt-0 mb-3 mx-auto" : ""}`}
          style={{
            ...loginButtonStyle,
            ...(isMobile && { width: "327px", display: "block" }),
          }}
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
          className="d-flex align-items-center text-secondary dropdown-toggle-no-caret"
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
      </Dropdown>
    );
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ background: "#f0f0f0", fontSize: "20px" }}
      >
        <div className="container position-relative d-flex align-items-center">
          <div
            className="navbar-brand p-0 m-0 me-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img
              src="https://www.baraliresort.com/images/logo.png"
              alt="logo"
              height="60"
            />
          </div>

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
            style={{ flexGrow: 1 }}
          >
            <ul className="navbar-nav mb-2 mb-lg-0 d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-lg-4 px-3 py-4 py-lg-0">
              <li className="nav-item d-lg-none">{renderUserSection(true)}</li>
              {[
                "หน้าแรก",
                "โปรโมชัน",
                "ประเภทห้อง",
                "กิจกรรม",
                "ติดต่อเรา",
              ].map((text, i) => (
                <li className="nav-item" key={i}>
                  <a
                    className="nav-link text-dark"
                    href="#!"
                    onClick={() => handleMenuClick(text)}
                  >
                    {text}
                  </a>
                </li>
              ))}
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
          </div>

          <button
            type="button"
            className="btn position-relative ms-3"
            style={{ backgroundColor: "rgba(240, 240, 240, 1)" }}
            onClick={() => setShowCart(true)}
          >
            <Icon icon="mdi-light:cart" width="24" height="24" />
            {selectedAccommodation.length > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.6rem", minWidth: "1.2rem" }}
              >
                {selectedAccommodation.length}
                <span className="visually-hidden">รายการในรถเข็น</span>
              </span>
            )}
          </button>

          <Trolley
  showCart={showCart}
  setShowCart={setShowCart}
  selectedAccommodation={selectedAccommodation}
  setSelectedAccommodation={setSelectedAccommodation}
/>


          <div className="d-none d-lg-flex align-items-center gap-3 ms-3">
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
      </nav>

      {showLogin && (
        <LoginModal showLogin={showLogin} closeLogin={closeLogin} />
      )}
    </>
  );
};

export default MainNavbar;
