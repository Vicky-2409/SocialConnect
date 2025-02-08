import React from "react";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import getUserData from "@/utils/getUserData";
import ProfileFeed from "@/components/Profile/ProfileFeed";

const Profile = async () => {
  let userData;
  try {
    const decoded: any = await getUserData();
    userData = decoded.userData;
  } catch (error: any) {
    console.log(error.message);
    return <div>{`Error getting current user's data`}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProfileHeader currUser={userData} />
      <ProfileFeed currUserData={userData} />
    </div>
  );
};

export default Profile;
