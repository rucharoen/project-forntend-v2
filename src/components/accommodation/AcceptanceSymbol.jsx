import a1 from "../../upimg/a1.png";
import a2 from "../../upimg/a2.png";
import a3 from "../../upimg/a3.png";

const AcceptanceSymbol = () => {
  return (
    <div
      className="d-flex justify-content-center"
      style={{ gap: "90px", margin: "50px" }}
    >
      <img src={a2} alt="symbol 2" style={{ width: "120px", height: "118px" }} />
      <img src={a3} alt="symbol 3" style={{ width: "207px", height: "115px" }} />
      <img src={a1} alt="symbol 1" style={{ width: "185px", height: "103px" }} />
    </div>
  );
};

export default AcceptanceSymbol;
