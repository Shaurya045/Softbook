import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

function Attendance() {
  const { token, backendURL, lat, lng, setLat, setLng } = useContext(Context);
  const [locationDenied, setLocationDenied] = useState(false);

  const requestLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            setLocationDenied(false);
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            setLocationDenied(true);
            toast.error("Location permission denied.");
            resolve({ lat: null, lng: null });
          }
        );
      } else {
        setLocationDenied(true);
        toast.error("Geolocation is not supported by this browser.");
        resolve({ lat: null, lng: null });
      }
    });
  };

  const markAttendance = async () => {
    let currentLat = lat;
    let currentLng = lng;
    if (currentLat == null || currentLng == null) {
      const loc = await requestLocation();
      currentLat = loc.lat;
      currentLng = loc.lng;
    }
    if (currentLat == null || currentLng == null) {
      toast.error("Location is required to mark attendance.");
      return;
    }
    try {
      const response = await axios.post(
        `${backendURL}attendance/mark`,
        {
          lat: currentLat,
          lng: currentLng,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="">
        <h1 className="text-[23px] sm:text-[30px] text-left">
          Mark Your Attendance
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <button
          onClick={markAttendance}
          className="bg-[#4BDE80] p-[10px] text-[#101826] text-[20px] font-semibold rounded-[10px] w-full sm:w-[500px] cursor-pointer self-center "
        >
          Mark
        </button>
      </div>
      {locationDenied && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <strong>Location permission is required!</strong>
          <div>
            Please enable location access for this site in your browser settings
            and try again.
            <br />
            <b>Tip:</b> On mobile, tap the lock icon in the address bar, go to
            permissions, and allow location.
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
