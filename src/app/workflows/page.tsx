import { redirect } from "next/navigation"

// Old address from earlier versions.
export default function Page() {
  redirect("/automate?view=workflows")
}
