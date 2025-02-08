import Promote from "@/components/post/promote/[id]/Promote";
import getUserData from "@/utils/getUserData";
import { redirect } from "next/navigation";

export default async function Page() {
  let userData;

  try {
    const decoded = await getUserData();
    userData = decoded.userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    redirect("/login"); // or wherever you want to redirect on error
  }

  // If we have user data, render the Promote component
  return (
    <main className="min-h-screen bg-gray-50">
      <Promote currUserData={userData} />
    </main>
  );
}
