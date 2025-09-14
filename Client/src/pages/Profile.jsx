import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import axios from "axios";

function Profile() {
  const { profileData, backendURL, token } = useContext(Context);
  const [totalIncome, setTotalIncome] = useState();
  const [income, setIncome] = useState();

  // const calculateOneMonthIncome = () => {
  //   const today = new Date();
  //   today.setHours(23, 59, 59, 999);

  //   const startDate = new Date(today);
  //   startDate.setDate(startDate.getDate() - 30);
  //   startDate.setHours(0, 0, 0, 0);

  //   let total = 0;
  //   paymentData.forEach((payment) => {
  //     const paymentDate = new Date(payment.paymentDate);
  //     if (paymentDate >= startDate && paymentDate <= today) {
  //       total += Number(payment.amount) || 0;
  //     }
  //   });
  //   setIncome(total);
  // };

  // const calculateTotalIncome = () => {
  //   let total = 0;
  //   paymentData.forEach((payment) => {
  //     total += Number(payment.amount) || 0;
  //   });
  //   setTotalIncome(total);
  // };

  const loadIncome = async () => {
    try {
      const response = await axios.get(`${backendURL}payment/income`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response);
      if (response.data.success) {
        setTotalIncome(response.data.totalIncome);
        setIncome(response.data.last30DaysIncome);
      }
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  useEffect(() => {
    // calculateTotalIncome();
    // calculateOneMonthIncome();
    loadIncome();
  }, []);

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

      {/* Revenue Cards Section */}
      <div className="flex flex-col gap-6 w-full sm:w-auto max-w-full sm:max-w-[400px] md:max-w-[480px] lg:max-w-[520px] xl:max-w-[600px]">
        <div className="flex items-center justify-center bg-gradient-to-bl from-[#D6D446] via-40% via-[#F591B7] to-[#03C7BD] to-70% p-1 rounded-2xl w-full">
          <div className="flex flex-col items-center justify-center bg-[#374151] rounded-2xl w-full px-4 py-4 sm:px-10 md:px-14 lg:px-16 xl:px-20">
            <p className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[25px] font-medium text-center">
              Last 30 days Revenue
            </p>
            <h2 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] xl:text-[70px] font-bold text-[#83ABDB] text-center">
              Rs. {income}
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-center bg-gradient-to-bl from-[#D6D446] via-40% via-[#F591B7] to-[#03C7BD] to-70% p-1 rounded-2xl w-full">
          <div className="flex flex-col items-center justify-center bg-[#374151] rounded-2xl w-full px-4 py-4 sm:px-10 md:px-14 lg:px-16 xl:px-20">
            <p className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[25px] font-medium text-center">
              Total Revenue
            </p>
            <h2 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] xl:text-[70px] font-bold text-[#83ABDB] text-center">
              Rs. {totalIncome}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
