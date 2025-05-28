import Button from "react-bootstrap/Button";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PromotionCard = ({ PromotionCard }) => {
  const fullImageUrl = `${BASE_URL}/uploads/accommodations/${accommodation.image_name}`;

  return (
    <div className="px-2 py-3">
      <div
        className="border rounded shadow-sm d-flex flex-column"
        style={{ width: "411px", height: "431px", padding: "12px" }}
      >
        {/* รูปภาพที่พัก */}
        <img
          src="https://f.ptcdn.info/233/074/000/qwms7l3m9xTurf5LFW9d-o.jpg"
          alt={accommodation.name}
          style={{
            width: "100%",
            height: "328px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "12px",
          }}
        />

        {/* ชื่อ, ขนาดห้อง และปุ่มอ่านเพิ่มเติม */}
        <div className="d-flex justify-content-between align-items-start flex-wrap">
          <div>
            <h5
              className="mb-1"
              style={{
                fontSize: "27px",
                fontWeight: "bold",
              }}
            >
              {accommodation.name}
            </h5>
            <p
              className="mb-0"
              style={{
                fontSize: "16px",
              }}
            >
               ขนาดห้อง {accommodation.room_size} ตารางเมตร
            </p>
          </div>

          <Button
            variant="light"
            className="mt-1"
            style={{
              border: "1px solid rgba(145, 145, 145, 1)",
              color: "#000",
              fontSize: "20px",
              padding: "4px 12px",
              height: "fit-content",
              whiteSpace: "nowrap",
            }}
          >
            อ่านเพิ่มเติม
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
