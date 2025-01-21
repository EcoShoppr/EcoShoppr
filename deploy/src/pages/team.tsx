import { Container, Row, Col, Card } from "react-bootstrap";
import "./Team.css"

export function Team() {
    const teamMembers = [
        {
            name: "Mason Brown",
            role: "CTO & Founder",
            imgUrl: "assets/Mason_Headshot.JPEG", // Replace with actual image URLs
            bgColor: "#2e7d32",
        },
        {
            name: "Roman Rosales",
            role: "CEO & Founder",
            imgUrl: "/assets/bob.jpg",
            bgColor: "#2e7d32",
        },
        {
            name: "Quan Doan",
            role: "Founder",
            imgUrl: "/assets/charlie.jpg",
            bgColor: "#2e7d32",
        },
    ];

    return (
        <Container className="py-4 team-page">
            <h1 className="text-center mb-4">Meet Our Team</h1>
            <Row className="justify-content-center">
                {teamMembers.map((member, index) => (
                    <Col key={index} md={4} sm={6} xs={12} className="mb-4">
                        <Card
                            className="team-card"
                            style={{ backgroundColor: member.bgColor }}
                        >
                            <Card.Img
                                variant="top"
                                src={member.imgUrl}
                                alt={`${member.name}'s photo`}
                                className="team-photo"
                            />
                            <Card.Body>
                                <Card.Title>{member.name}</Card.Title>
                                <Card.Text>{member.role}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
