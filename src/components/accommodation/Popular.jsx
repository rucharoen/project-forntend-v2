import { useEffect, useState } from "react";
// import AccommodationService from "../../services/api/accommodation/accommodation.service";
import TypeService from "../../services/api/accommodation/type.service";
import AccommodationCard from "./AccommodationCard";
import { Spinner } from "react-bootstrap";
import RoomTypeCard from "../common/TypeDetail";
import GetRoomAvailability from "../common/GetRoomAvailability";
import Slider from "react-slick";
import dayjs from 'dayjs';
import 'dayjs/locale/th';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

const Popular = () => {

     var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    const [populars, setPopulars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availabilityData, setAvailabilityData] = useState({});

    // Fetch availability data when checkInDate or checkOutDate changes
    useEffect(() => {
        
        const fetchData = async () => {
             try {
                setLoading(true);
                const result = await TypeService.getAll();

                setPopulars(result.data);
            } catch (error) {
                console.error("Error fetching popular accommodations:", error);
            } finally {
                setLoading(false);
            }
           
        };

        fetchData();
    }, []);

    // useEffect(() => {
    //     const checkInDate = dayjs().add(1, 'day').toDate();
    //     const checkOutDate = dayjs().add(2, 'day').toDate();

    //     const fetchData = async () => {
    //         if (checkInDate && checkOutDate) {
    //             const result = await GetRoomAvailability(checkInDate, checkOutDate);
    //             setAvailabilityData(result);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // useEffect(() => {
    //     fetchPopularAccommodations();
    // }, []);

    // const fetchPopularAccommodations = async () => {
    //     try {
    //         setLoading(true);
    //         const res = await AccommodationService.getPopularAccommodation();
    //         setPopulars(res?.data || []);
    //     } catch (error) {
    //         console.error("Error fetching popular accommodations:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="row">
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Slider {...settings}>
                
                    {populars.length > 0 ? (
                        populars.map((acc) => (
                            <RoomTypeCard
                                key={acc.id}
                                accommodation={acc}
                            />
                        ))
                    
                    ) : (
                        <div className="text-center col-12">
                            <p className="text-danger">
                                ไม่สามารถโหลดข้อมูลห้องพักยอดนิยมได้
                            </p>
                        </div>
                    )}
                </Slider>
            )}
        </div>
    );
};

export default Popular;