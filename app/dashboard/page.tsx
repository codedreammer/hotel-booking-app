    import Link from "next/link"
    import LogoutButton from "@/components/LogoutButton"

    export default function DashboardPage() {
    return (
        <div style={{ padding: "2rem" }}>
        <h1>Dashboard</h1>
        <p>You are logged in successfully.</p>

        <Link href="/hotels">
            <button style={{ marginTop: "1rem" }}>
            View Hotels
            </button>
        </Link>

        <LogoutButton />
        </div>
    )
    }
