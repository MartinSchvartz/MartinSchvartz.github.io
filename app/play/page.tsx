import type { Metadata } from "next";
import { Play } from "@/components/play/Play";

export const metadata: Metadata = {
  title: "Martin Schvartz · The desk",
  description: "An interactive 3D version of Martin Schvartz's site.",
};

export default function PlayPage() {
  return <Play />;
}
