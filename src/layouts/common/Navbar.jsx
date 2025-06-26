import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IconUserCircle } from "@tabler/icons-react";
import { Icon } from "@iconify/react";
import LoginModal from "../../pages/main/auth/LoginPage";
import { OverlayTrigger, Popover } from "react-bootstrap"; // เพิ่มตรงนี้


const MainNavbar = ({ isUser, logOut }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const loadAccommodation = () => {
      const stored = localStorage.getItem("selectedAccommodation");
      if (stored) {
        try {
          setSelectedAccommodation(JSON.parse(stored));
        } catch (error) {
          console.error("Failed to parse selected accommodation:", error);
          setSelectedAccommodation([]);
        }
      } else {
        setSelectedAccommodation([]);
      }
    };

    loadAccommodation();

    const handleAccommodationChanged = () => {
      loadAccommodation();
    };

    window.addEventListener("accommodationChanged", handleAccommodationChanged);

    return () => {
      window.removeEventListener(
        "accommodationChanged",
        handleAccommodationChanged
      );
    };
  }, []);

  const handleCartClick = async (e) => {
    e.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate("/booking-list");
  };

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
        navigate("/"); // หรือ URL ที่ต้องการ
      } else if (menu === "โปรโมชัน") {
        const section = document.getElementById("PromotionSection");
        section?.scrollIntoView({ behavior: "smooth" });
      } else if (menu === "ประเภทห้อง") {
        const section = document.getElementById("PopularSection");
        section?.scrollIntoView({ behavior: "smooth" });
      } else if (menu === "กิจกรรม") {
        const section = document.getElementById("ActivitySection");
        section?.scrollIntoView({ behavior: "smooth" });
      } else if (menu === "ติดต่อเรา") {
        const section = document.getElementById("Contact");
        section?.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
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

          {/* ปุ่มรถเข็นอยู่ตรงนี้ ให้ชิดขวา */}
          <OverlayTrigger
  trigger="click"
  placement="bottom"
  rootClose
  overlay={
    <Popover
      id="cart-popover"
      style={{ left: "50%", transform: "translateX(-50%)" }} // ตรงกลางแนวนอน
    >
      <Popover.Header as="h3">รายการที่เลือก</Popover.Header>
      <Popover.Body>
        {selectedAccommodation.length > 0 ? (
          <ul className="list-unstyled mb-0">
            {selectedAccommodation.map((room, index) => (
              <li key={index}>
                • {room.name || `ห้องพัก ${index + 1}`}
              </li>
            ))}
            <hr />
            <button
              className="btn btn-primary btn-sm w-100"
              onClick={() => navigate("/booking-list")}
            >
              ไปยังรายการจอง
            </button>
          </ul>
        ) : (
          <div>ไม่มีรายการในรถเข็น</div>
        )}
      </Popover.Body>
    </Popover>
  }
>
  <button
    type="button"
    className="btn position-relative ms-3"
    style={{ backgroundColor: "rgba(240, 240, 240, 1)" }}
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
</OverlayTrigger>


          {/* ส่วนเมนูผู้ใช้บน desktop */}
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
