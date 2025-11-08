import { redirect } from "next/navigation";

import { PAGE_URLS } from "@/app/constants";

function Home() {
  redirect(PAGE_URLS.SIGN_IN);
};

export default Home;