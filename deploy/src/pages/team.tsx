import { Container, Row, Col, Card } from "react-bootstrap";
import "./Team.css"
import { Link } from "react-router-dom";
 
export function Team() {
    const teamMembers = [
        {
            name: "mason",
            displayName: "Mason Brown",
            role: "CTO & Founder",
            imgUrl: "assets/Mason_Headshot.JPEG", // Replace with actual image URLs
            bgColor: "#2e7d32",
        },
        {
            name: "roman",
            displayName: "Roman Rosales",
            role: "CEO & Founder",
            imgUrl: "/assets/bob.jpg",
            bgColor: "#2e7d32",
        },
        {
            name: "quan",
            displayName: "Quan Doan",
            role: "Lead Developer & Founder",
            imgUrl: "/assets/charlie.jpg",
            bgColor: "#2e7d32",
        },
    ];

    return (
        <Container className="py-4 team-page">
            <h1 className="text-center mb-4">Connect With Our Team</h1>
            <Row className="justify-content-center">
                {teamMembers.map((member, index) => (
                    <Col key={index} md={4} sm={6} xs={12} className="mb-4">
                        <Link to={`/team/${member.name}`} style={{ textDecoration: "none" }}>
                            <Card className="team-card">
                                <Card.Img
                                    variant="top"
                                    src={member.imgUrl}
                                    alt={`${member.displayName}'s photo`}
                                    className="team-photo"
                                />
                                <Card.Body>
                                    <Card.Title style={{ color: "#000" }}>{member.displayName}</Card.Title>
                                    <Card.Text style={{ color: "#666" }}>{member.role}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}