import type { Metadata } from "next";
import { DemoHero } from "@/components/demo/DemoHero";
import { DemoForm } from "@/components/demo/DemoForm";

export const metadata: Metadata = {
  title: "Book a Demo — See MME in Action",
  description:
    "Book a personalised demo of the Moment Marketing Engine. See how AI-powered moment marketing can transform your radio and social media advertising.",
};

export default function DemoPage() {
  return (
    <>
      <DemoHero />
      <DemoForm />
    </>
  );
}
