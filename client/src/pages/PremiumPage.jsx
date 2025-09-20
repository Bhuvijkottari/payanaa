// src/pages/PremiumFlowModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mentorPhoto from "../assets/mentor-photos.png"; // make sure the image exists

export default function PremiumFlowModal({ onActivate }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const mentorDetails = {
    name: "John Doe",
    designation: "Head of Tamil Computing",
    phone: "+1 234 567 890",
    email: "mentor@example.com",
    photo: mentorPhoto,
  };

  const features = [
    "Mentor-Mentee Connect",
    "Doubt Sessions",
    "Exclusive E-Learning Content",
    "Personalized Guidance",
  ];

  const handleDone = () => {
    onActivate(); // callback to mark premium as active
    navigate("/"); // redirect to home/dashboard
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#150B2E] to-[#2A0944] rounded-3xl shadow-2xl w-full max-w-lg p-8 text-white">
        {/* Step 0: Premium Features */}
        {step === 0 && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-pink-300">
              🌟 Premium Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-[#1F1F1F]/70 p-4 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer text-center font-medium"
                >
                  {f}
                </div>
              ))}
            </div>
            <p className="text-center mb-6 text-lg">
              Do you want to avail Premium?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition shadow-lg"
              >
                Yes
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded-xl font-bold transition shadow-lg"
              >
                No
              </button>
            </div>
          </>
        )}

        {/* Step 1: Mentor Details */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-pink-300">
              Your Mentor
            </h2>
            <div className="flex flex-col items-center gap-4 bg-[#1F1F1F]/60 p-6 rounded-3xl shadow-xl">
              <img
                src={mentorDetails.photo}
                alt="Mentor"
                className="w-32 h-32 rounded-full object-cover shadow-lg"
              />
              <h3 className="text-xl font-semibold">{mentorDetails.name}</h3>
              <p>{mentorDetails.designation}</p>
              <p>{mentorDetails.phone}</p>
              <p>{mentorDetails.email}</p>

              {/* Pay to Proceed */}
              <button
                onClick={() => alert("Payment flow coming soon")}
                className="mt-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-bold shadow-lg transition w-full"
              >
                💰 Pay to Proceed
              </button>

              <button
                onClick={handleDone}
                className="mt-4 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl font-bold shadow-lg transition w-full"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
