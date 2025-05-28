import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import ActivityService from "../../services/api/activity/activity.service";
import ActivityCard from "./ActivityCard";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Activity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const res = await ActivityService.getAll();
                setActivities(res?.data || []);
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    return (
        <div className="container my-5">
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Row className="g-4 justify-content-center">
                    {activities.map((activity) => (
                        <Col key={activity.id} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
                            <div style={{ width: '305px', height: '430px', overflow: 'hidden' }}>
                                <ActivityCard activity={activity} />
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default Activity;
