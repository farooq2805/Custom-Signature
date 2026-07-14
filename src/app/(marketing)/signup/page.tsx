import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupFlow } from "./SignupFlow";

export const metadata: Metadata = { title: "Get Started" };

export default function SignupPage() {
  return (
    <Suspense>
      <SignupFlow />
    </Suspense>
  );
}
