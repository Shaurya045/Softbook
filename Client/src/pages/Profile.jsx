import React, { useContext } from "react";
import { Context } from "../context/Context";

function Profile() {
  const { profileData } = useContext(Context);
  return (
    <div className="flex flex-col gap-9">
      <h1 className="text-[30px] font-semibold ">Profile</h1>
      <div className="bg-[#1F2937] p-5 rounded-xl flex flex-col gap-4 ">
        <div className="flex gap-5">
          <p>Owner Name: </p>
          <p>{profileData.name}</p>
        </div>
        <div className="flex gap-5">
          <p>Email: </p>
          <p>{profileData.email}</p>
        </div>
        <div className="flex gap-5">
          <p>Phone No.: </p>
          <p>{profileData.phone}</p>
        </div>
        <div className="flex gap-5">
          <p>Library Name: </p>
          <p>{profileData.libraryName}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
