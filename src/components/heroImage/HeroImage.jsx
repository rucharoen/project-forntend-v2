import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/HeroImage.css";
import hero from "../../upimg/hero.jpg";

const HeroImage = () => {
  return (
    <section
      className="position-relative w-100 overflow-hidden"
      id="bookingSection"
    >
      <style>
        {`
          @media (max-width: 812px) {
            .hero-image {
              width: 375px !important;
              height: 199px !important;
            }
          }
        `}
      </style>

      <img
        src={hero}
        alt="ภาพหลัก"
        className="img-fluid rounded mt-3 hero-image"
        style={{
          width: "1460px",
          maxHeight: "381px",
          objectFit: "cover",
          margin: "0 auto",
          display: "block",
        }}
      />

      <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
        <h1 className="display-4 d-none d-md-block custom-heading-h1">
          ยินดีต้อนรับเข้าสู่
        </h1>
        <h3 className="fs-2 d-none d-md-block custom-heading-h3">
          บาราลี บีช รีสอร์ท
        </h3>

        {/* Responsive text สำหรับมือถือ */}
        <h1 className="h4 d-block d-md-none">ยินดีต้อนรับเข้าสู่</h1>
        <h3 className="h6 d-block d-md-none">บาราลี บีช รีสอร์ท</h3>
      </div>
    </section>
  );
};

export default HeroImage;
