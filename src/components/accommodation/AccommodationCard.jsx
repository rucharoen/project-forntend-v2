import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AccommodationCard = ({ accommodation }) => {
  const images = accommodation.images || []; // สมมติ accommodation.images เป็น array ของชื่อรูป
  const imagesToShow = images.slice(0, 3); // แสดงแค่ 3 รูปแรก

  const originalPrice = accommodation.price_per_night;
  const discountPercent = accommodation.discount;

  const hasDiscount = originalPrice && discountPercent;
  const discountedPrice = hasDiscount
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  return (
    <Col
      xs={12}
      sm={6}
      md={4}
      className="d-flex justify-content-center mb-4 mt-5 g-1"
    >
      <div
        className="card h-100 border-0 d-flex flex-column position-relative"
        style={{
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          borderRadius: "0.5rem",
          width: "410px",
          height: "521px",
        }}
      >
        {/* ป้ายโปรโมชั่น */}
        <div
          className="position-absolute bg-danger text-white px-3 py-1"
          style={{
            borderTopLeftRadius: "0.4rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            zIndex: 10,
          }}
        >
          โปรโมชั่น
        </div>

        {/* แสดงรูปภาพ 3 รูป */}
        <div
          className="d-flex"
          style={{
            height: "276px",
            overflow: "hidden",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
        >
          {imagesToShow.length > 0 ? (
            imagesToShow.map((img, idx) => (
              <img
                key={idx}
                src={`${BASE_URL}/uploads/accommodations/${img}`}
                alt={`${accommodation.name} ภาพที่ ${idx + 1}`}
                style={{
                  width: `${100 / imagesToShow.length}%`,
                  objectFit: "cover",
                  borderRadius:
                    idx === 0
                      ? "0.5rem 0 0 0.5rem"
                      : idx === imagesToShow.length - 1
                      ? "0 0.5rem 0.5rem 0"
                      : "0",
                }}
              />
            ))
          ) : (
            <img
              src={`${BASE_URL}/uploads/accommodations/${accommodation.image_name}`}
              alt={accommodation.name}
              className="card-img-top rounded-top"
              style={{
                height: "276px",
                objectFit: "cover",
                borderRadius: "0.5rem 0.5rem 0 0",
                width: "100%",
              }}
            />
          )}
        </div>

        {/* เนื้อหา */}
        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold mb-2" style={{ fontSize: "2rem" }}>
            {accommodation.name}
          </h6>

          <p
            className="text-warning mb-1"
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              color: "rgba(255, 110, 0, 1)",
            }}
          >
            {accommodation.promotion_detail || "โปรโมชั่นพิเศษ"}
          </p>
          <p className="text-muted mb-1" style={{ fontSize: "0.95rem" }}>
            {accommodation.promotion_date || "1 เม.ย. - 31 ส.ค. 2568"}
          </p>
          <p className="text-muted mb-2" style={{ fontSize: "0.95rem" }}>
            รวมอาหารเช้า
          </p>
        </div>

        {/* ปุ่มด้านล่างเต็มความกว้าง */}
        <div className="d-flex w-100">
          <span
            className="fw-bold text-center"
            style={{
              backgroundColor: "white",
              color: "rgba(91, 155, 43, 1)",
              border: "1px solid rgba(91, 155, 43, 1)",
              width: "50%",
              padding: "0.375rem 0.75rem",
              borderRadius: "0 0 0 0.375rem",
              fontSize: "1rem",
              whiteSpace: "nowrap",
            }}
          >
            ประหยัด {discountPercent}%
          </span>

          <a
            href="http://localhost:1111/search-results?destination=&guests=1&checkIn=2025-05-17&checkOut=2025-05-18"
            className="fw-bold text-white text-decoration-none"
            style={{
              backgroundColor: "rgba(0, 196, 255, 1)",
              borderColor: "rgba(0, 196, 255, 1)",
              width: "50%",
              borderRadius: "0 0 0.375rem 0",
              fontSize: "1.05rem",
              whiteSpace: "nowrap",
              display: "inline-block",
              textAlign: "center",
              padding: "0.5rem 1rem",
            }}
          >
            จองเลยตอนนี้
          </a>
        </div>
      </div>
    </Col>
  );
};

export default AccommodationCard;
