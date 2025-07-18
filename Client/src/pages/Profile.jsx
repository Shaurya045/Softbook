import React, { useContext } from "react";
import { Context } from "../context/Context";

function Profile() {
  const { profileData } = useContext(Context);
  return (
    <div className="flex flex-col gap-6 sm:gap-9 w-full">
      <h1 className="text-[22px] sm:text-[30px] font-semibold">Profile</h1>
      <div className="bg-[#1F2937] p-7 rounded-xl shadow-lg flex flex-col gap-6 w-full max-w-2xl ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div className="flex flex-col">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Owner Name
            </span>
            <span className="text-lg font-medium text-white break-words">
              {profileData.name}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#BBD3EE] text-sm font-semibold">Email</span>
            <span className="text-lg font-medium text-white break-words">
              {profileData.email}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Phone No.
            </span>
            <span className="text-lg font-medium text-white break-words">
              {profileData.phone}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Library Name
            </span>
            <span className="text-lg font-medium text-white break-words">
              {profileData.libraryName}
            </span>
          </div>
          <div className="flex flex-col sm:col-span-2">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Address
            </span>
            <span className="text-lg font-medium text-white break-words">
              {profileData.address}
            </span>
          </div>
          <div className="flex flex-col sm:col-span-2">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Subscription
            </span>
            <span className="text-lg font-medium text-white break-words ">
              {profileData.subscription?.active ? (
                <span className="flex flex-col md:flex-row">
                  <span>
                    <span className="text-green-400 font-semibold ">
                      Active
                    </span>
                    {profileData.subscription.plan && (
                      <span className="ml-2 text-[#BBD3EE]">
                        (
                        {profileData.subscription.plan.charAt(0).toUpperCase() +
                          profileData.subscription.plan.slice(1)}{" "}
                        Plan)
                      </span>
                    )}
                  </span>
                  {profileData.subscription.expiresAt && (
                    <span className="md:ml-2 text-[#BBD3EE]">
                      Expires:{" "}
                      {new Date(
                        profileData.subscription.expiresAt
                      ).toLocaleDateString("en-GB")}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-red-400 font-semibold">Inactive</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
