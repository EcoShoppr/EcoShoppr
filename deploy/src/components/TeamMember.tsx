import { useParams } from "react-router-dom";

export function TeamMember() {
    const { name } = useParams<{ name: string }>();

    const teamMembers = [
        {
            name: "mason",
            displayName: "Mason Brown",
            role: "CTO & Founder",
            bio: "Mason is the visionary behind EcoShoppr with a passion for sustainability.",
            imgUrl: "/assets/Mason_Headshot.JPEG",
            linkedIn: "https://www.linkedin.com/in/mason-s-brown",
        },
        {
            name: "roman",
            displayName: "Roman Rosales",
            role: "CEO & Founder",
            bio: "Roman oversees the vision and strategic direction of EcoShoppr.",
            imgUrl: "",
            linkedIn: "https://www.linkedin.com/in/roman-rosales/",
        },
        {
            name: "quan",
            displayName: "Quan Doan",
            role: "Lead Developer & Founder",
            bio: "Quan focuses on delivering user-friendly features to EcoShoppr users.",
            imgUrl: "",
            linkedIn: "https://www.linkedin.com/in/quanbdoan/",
        },
    ];

    const member = teamMembers.find((m) => m.name === name);

    if (!member) {
        return <h1 style={{ textAlign: "center" }}>Team Member Not Found</h1>;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "2rem",
            }}
        >
            <img
                src={member.imgUrl}
                alt={member.displayName}
                style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "1rem",
                }}
            />
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                {member.displayName}
            </h1>
            <h2 style={{ fontSize: "1.5rem", color: "#4caf50", marginBottom: "1rem" }}>
                {member.role}
            </h2>
            <p style={{ fontSize: "1rem", color: "#555", maxWidth: "600px", marginBottom: "1.5rem" }}>
                {member.bio}
            </p>
            <a
                href={member.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    textDecoration: "none",
                    backgroundColor: "#0a66c2", // LinkedIn blue
                    color: "#fff",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#004182")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0a66c2")}
            >
                LinkedIn Profile
            </a>
        </div>
    );
}
