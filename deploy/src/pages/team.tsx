import { Container, Row, Col, Card } from "react-bootstrap";
import "./Team.css";

export function Team() {
    const teamMembers = [
        {
            name: "Alice Johnson",
            role: "CEO & Founder",
            imgUrl: "/assets/alice.jpg", // Replace with actual image URLs
        },
        {
            name: "Bob Smith",
            role: "CTO",
            imgUrl: "/assets/bob.jpg",
        },
        {
            name: "Charlie Davis",
            role: "Lead Developer",
            imgUrl: "/assets/charlie.jpg",
        },
    ];

    return (
        <Container className="py-4 team-page">
            <h1 className="text-center mb-4">Meet Our Team</h1>
            <Row className="justify-content-center">
                {teamMembers.map((member, index) => (
                    <Col key={index} md={4} sm={6} xs={12} className="mb-4">
                        <Card className="team-card">
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
