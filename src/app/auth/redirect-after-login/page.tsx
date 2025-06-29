// app/auth/redirect-after-login/page.tsx
import { getRedirectLinkForGroup } from "@/utils/amplify-server-utils";
import { redirect } from "next/navigation";

export default async function RedirectAfterLoginPage() {
  const redirectPath = await getRedirectLinkForGroup();
  redirect(redirectPath);
}
