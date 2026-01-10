
import Signup from "@/components/sign-up";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create your Krira Augment account today and start building enterprise-grade RAG pipelines.",
};

export default function signup() {
    return (
        <div>

            <Signup />

        </div>
    )
}