import { redirect } from "next/navigation";

import { PAGE_URLS } from "@/app/constants";

export default function Home() {
  redirect(PAGE_URLS.SIGN_IN)
};