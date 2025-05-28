import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HeroImage = () => {
  return (
    <section className="position-relative w-100 overflow-hidden" id="bookingSection">
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
        src="https://scontent.fbkk5-4.fna.fbcdn.net/v/t1.15752-9/495267458_1845902902896226_4804704848285100621_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeHX428zFt85XYu0ORyH6SCJbqYaY5i3H6NuphpjmLcfo8tEqk3iEX1D8386bN8BRwpQ4bLfUFzM1J1XV7LivcCa&_nc_ohc=YAQ4RlQnYVAQ7kNvwGua23c&_nc_oc=AdnHk55GgprpRHNYX-ywnrHyusQ2fAy4y2bvR5kLnug1iEJgtx4xukXD3tT9rgm6azo&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fbkk5-4.fna&oh=03_Q7cD2AGIkEy6mBvpND9syNzbalqkXDrI-CEUzddjvt2BmK-HTQ&oe=683D79CF"
        alt="ภาพหลัก"
        className="img-fluid rounded mt-3 hero-image"
        style={{
          width: '1460px',
          maxHeight: '381px',
          objectFit: 'cover',
          margin: '0 auto',
          display: 'block',
        }}
      />

      <div
        className="position-absolute top-50 start-50 translate-middle text-white text-center"
        
      >
        <h1 className="display-4 d-none d-md-block">ยินดีต้อนรับเข้าสู่</h1>
        <h3 className="fs-2 d-none d-md-block">บาราลี บีช รีสอร์ท</h3>

        {/* Responsive text สำหรับมือถือ */}
        <h1 className="h4 d-block d-md-none">ยินดีต้อนรับเข้าสู่</h1>
        <h3 className="h6 d-block d-md-none">บาราลี บีช รีสอร์ท</h3>
      </div>
    </section>
  );
};

export default HeroImage;
