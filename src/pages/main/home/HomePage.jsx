import { useEffect, useState } from "react";
import Popular from "../../../components/accommodation/Popular";
import Accommodation from "../../../components/accommodation/Accommodation";
import Activity from "../../../components/activity/Activity";
import HeroImage from "../../../components/heroImage/HeroImage";
import SearchBox from "../../../components/search/SearchBox";
import AcceptanceSymbol from "../../../components/accommodation/AcceptanceSymbol"
import "../../../css/HomeSearch.css";

const HomePage = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <HeroImage />

      <section className="search-box" style={{ zIndex: 2, padding: "15 0" }}>
        <SearchBox />
      </section>

      <section className="Accommodation" id="PromotionSection">
        <div className="container">
          <h3 className="fw-bold pt-1 text-center">
            <span
              className="border-bottom border-3 border-primary-custom"
              style={{ display: "inline-block" }}
            >โปรโมชัน
             
            </span>
          </h3>

          <Accommodation />

          {/* เส้นแบ่งล่างสุด */}
          <div
        style={{
          borderBottom: "3px solid rgba(186, 186, 186, 1)",
          marginTop: "2rem",
        }}
      ></div>
        </div>
      </section>

      <section
        className="container mb-4"
        id="PopularSection"
        style={{ marginTop: isDesktop ? "2rem" : "2rem" }}
      >
        <h3 className="fw-bold">
          <span className="border-bottom border-3 border-primary">
            ประเภทห้องพัก
          </span>
        </h3>
        <Popular />
      </section>

      <section className="container my-5 text-center" id="ActivitySection">
        <h3 className="fw-bold">
          <span>สนุกกับกิจกรรมชายหาดของเรา</span>
        </h3>
        <p
          className="mx-auto"
          style={{ maxWidth: "600px", color: "rgba(114, 114, 114, 1)" }}
        >
          แขกจะรู้สึกเหมือนอยู่บ้านเมื่อได้ใช้สิ่งอำนวยความสะดวกและกิจกรรมต่างๆของรีสอร์ท
        </p>
        <Activity />
      </section>

      <section className="Promotion">
        <div className="container">
          <h3 className="fw-bold pt-1 text-center">
            <span
              className="border-bottom border-3 border-primary-custom"
              style={{ display: "inline-block" }}
            >
              รางวัลและการรับรองคุณภาพ
            </span>
          </h3>   
          <AcceptanceSymbol/>  
        </div>
      </section>
    </>
  );
};

export default HomePage;
