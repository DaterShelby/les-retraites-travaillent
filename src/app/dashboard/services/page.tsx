import { redirect } from "next/navigation";

// This page redirects to /dashboard/listings which is the main listings management page
export default function MyServicesPage() {
  redirect("/dashboard/listings");
}
