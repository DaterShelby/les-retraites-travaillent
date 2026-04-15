import { redirect } from "next/navigation";

// Redirect to the main service creation page
export default function CreateServiceRedirectPage() {
  redirect("/dashboard/listings/create");
}
