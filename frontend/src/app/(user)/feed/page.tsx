import React from "react";
import Feed from "@/components/feed/UserFeed";
import getUserData from "@/utils/getUserData";

const Page = async () => {
  let userData;
  try {
    const decoded: any = await getUserData();
    userData = decoded.userData;
  } catch (error: any) {
    console.log(error.message);
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-2 text-xl font-semibold">Unable to load feed</h2>
          <p>{`Error getting current user's data`}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        <div className="h-full rounded-xl bg-white shadow-sm">
          <Feed currUserData={userData} />
        </div>
      </main>
    </div>
  );
};

export default Page;
