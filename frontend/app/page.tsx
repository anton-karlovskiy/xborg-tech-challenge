import { redirect } from "";

import { PAGE_URLS } from "@/app/constants";

/**
 * Home page component that redirects to the sign-in page.
 * @returns Never returns (redirects immediately)
 */
function Home() {
  redirect(PAGE_URLS.SIGN_IN);
}

export default Home;
