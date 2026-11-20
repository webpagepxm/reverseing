import { redirect } from "next/navigation";
import { scope } from "../lib/navigation";

export default function Home() {
  redirect(scope + "/agenda");
}
