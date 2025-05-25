import { Carousel } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import '../../css/HeroImage.css';

const HeroImage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fullImageUrl = `${BASE_URL}/uploads/heroimages/`;
    const [isVisible, setIsVisible] = useState(false);
    
    // เอฟเฟกต์การแสดงผลสำหรับแต่ละ Carousel slide
    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const imageStyle = {
        height: '50vh',
        objectFit: 'cover'
    };

    // ข้อมูลสำหรับ carousel slides
    const carouselItems = [
        {
            image: `${fullImageUrl}12-2500x1667.jpg`,
            alt: "ห้องพักหรูริมทะเล",
            title: "ห้องพักหรูริมทะเล",
            description: "สัมผัสความเงียบสงบของธรรมชาติ พร้อมความสะดวกสบายระดับพรีเมียม"
        },
        {
            image: `${fullImageUrl}13-2500x1667.jpg`,
            alt: "ห้องสวีทสุดพิเศษ",
            title: "ห้องสวีทสุดพิเศษ",
            description: "ตกแต่งด้วยความประณีต พร้อมวิวที่สวยงาม"
        },
        {
            image: `${fullImageUrl}14-2500x1667.jpg`,
            alt: "ชายหาดส่วนตัว",
            title: "ชายหาดส่วนตัว",
            description: "พักผ่อนท่ามกลางเสียงคลื่นและบรรยากาศแสนสงบ"
        },
        {
            image: `${fullImageUrl}15-2500x1667.jpg`,
            alt: "สิ่งอำนวยความสะดวกครบครัน",
            title: "สิ่งอำนวยความสะดวกครบครัน",
            description: "สระว่ายน้ำ ฟิตเนส สปา และอีกมากมายเพื่อการพักผ่อนที่สมบูรณ์แบบ"
        }
    ];

    return (
        <div className="hero-carousel-container">
            <Carousel 
                fade 
                interval={10000} 
                pause={false} 
                touch={true} 
                keyboard={true}
                indicators={true}
                className="luxury-carousel"
            >
                {carouselItems.map((item, index) => (
                    <Carousel.Item key={index} className="carousel-item-luxury">
                        <div className="luxury-overlay"></div>
                        <img
                            className="d-block w-100"
                            src={item.image}
                            alt={item.alt}
                            style={imageStyle}
                        />
                        <Carousel.Caption className={`luxury-caption ${isVisible ? 'visible' : ''}`}>
                            <h3 className="luxury-title">{item.title}</h3>
                            <div className="luxury-divider"></div>
                            <p className="luxury-description">{item.description}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default HeroImage;