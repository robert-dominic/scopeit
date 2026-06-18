import { redirect } from "next/navigation";

// /chat → redirect to /chat/new
export default function ChatIndexPage() {
    redirect("/chat/new");
}
