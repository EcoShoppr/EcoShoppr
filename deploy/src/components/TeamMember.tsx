import { useParams } from "react-router-dom";

export function TeamMember() {
    const { name } = useParams<{ name: string }>(); // Get the dynamic name parameter

    const teamMembers = [
        {
            name: "alice",
            displayName: "Alice Johnson",
            role: "CEO & Founder",
            bio: "Alice is the visionary behind EcoShoppr with a passion for sustainability.",
            imgUrl: "/assets/alice.jpg",
        },
        {
            name: "bob",
            displayName: "Bob Smith",
            role: "CTO",
            bio: "Bob leads the technical direction, ensuring our platform runs smoothly.",
            imgUrl: "/assets/bob.jpg",
        },
        {
            name: "charlie",
            displayName: "Charlie Davis",
            role: "Lead Developer",
            bio: "Charlie is responsible for developing innovative features for EcoShoppr.",
            imgUrl: "/assets/charlie.jpg",
        },
    ];

    // Find the team member based on the name in the URL
    const member = teamMembers.find((m) => m.name === name);

    if (!member) {
        return <h1>Team Member Not Found</h1>;
    }

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <img
                src={member.imgUrl}
                alt={member.displayName}
                style={{ width: "200px", borderRadius: "50%" }}
            />
            <h1>{member.displayName}</h1>
            <h2>{member.role}</h2>
            <p>{member.bio}</p>
        </div>
    );
}
