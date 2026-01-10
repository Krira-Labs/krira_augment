
import Login from "@/components/login";



import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your Krira Augment account to manage your RAG pipelines and analytics.",
};

export default function signup() {
    return (
        <div>

            <Login />

        </div>
    )
}