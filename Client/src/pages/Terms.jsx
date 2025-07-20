import React from "react";
import NavbarHome from "../components/NavbarHome";
import { images } from "../assets/assets";
import { Link } from "react-router-dom";

const Terms = () => (
  <div className="bg-[#0F0E1B] min-h-screen w-full relative overflow-hidden px-2 sm:px-6 py-2">
    {/* Gradient backgrounds for visual consistency */}
    <div className="bg-gradient-to-br from-[#03C7BD] rounded-full absolute z-0 w-[120px] h-[140px] blur-[60px] top-[180px] left-[-100px] sm:w-[220px] sm:h-[120px] sm:blur-[90px] sm:top-[60px] sm:left-[-100px] md:w-[500px] md:h-[300px] md:blur-[150px] md:top-[100px] md:left-[-270px]"></div>
    <div className="bg-gradient-to-br from-[#1703C7] rounded-full absolute z-0 w-[260px] h-[200px] blur-[100px] top-[300px] left-[-150px] sm:w-[220px] sm:h-[120px] sm:blur-[90px] sm:top-[160px] sm:left-[-80px] md:w-[550px] md:h-[300px] md:blur-[120px] md:top-[220px] md:left-[-100px]"></div>
    <div className="bg-gradient-to-br from-[#D445CF] rounded-full absolute z-0 w-[200px] h-[120px] blur-[70px] top-[460px] left-[-0px] sm:w-[220px] sm:h-[120px] sm:blur-[110px] sm:top-[260px] sm:left-[-40px] md:w-[550px] md:h-[300px] md:blur-[120px] md:top-[450px] md:left-[150px]"></div>
    <div className="bg-gradient-to-br from-[#D6D446] rounded-full absolute z-0 w-[220px] h-[220px] blur-[60px] top-[480px] left-[140px] sm:w-[220px] sm:h-[120px] sm:blur-[90px] sm:top-[320px] sm:left-[40px] md:w-[550px] md:h-[300px] md:blur-[100px] md:top-[650px] md:left-[450px]"></div>
    <div className="bg-gradient-to-br from-[#D445CF] rounded-full absolute z-0 w-[180px] h-[140px] blur-[80px] top-[420px] right-[-0px] sm:w-[220px] sm:h-[120px] sm:blur-[120px] sm:top-[260px] sm:right-[-40px] md:w-[550px] md:h-[300px] md:blur-[180px] md:top-[550px] md:right-[150px]"></div>
    <div className="bg-gradient-to-br from-[#1703C7] rounded-full absolute z-0 w-[200px] h-[250px] blur-[100px] top-[200px] right-[-130px] sm:w-[220px] sm:h-[120px] sm:blur-[110px] sm:top-[160px] sm:right-[-100px] md:w-[500px] md:h-[300px] md:blur-[160px] md:top-[320px] md:right-[-300px]"></div>
    <div className="bg-gradient-to-br from-[#03C7BD] rounded-full absolute z-0 w-[120px] h-[180px] blur-[60px] top-[150px] right-[-100px] sm:w-[220px] sm:h-[120px] sm:blur-[90px] sm:top-[60px] sm:right-[-120px] md:w-[500px] md:h-[300px] md:blur-[150px] md:top-[200px] md:right-[-450px]"></div>

    <div className="relative z-10">
      <NavbarHome />
      <div className="flex justify-center items-center min-h-[60vh] py-10">
        <div className="w-full max-w-3xl bg-[#181c27] bg-opacity-95 rounded-2xl shadow-2xl p-8 md:p-12 border border-[#232a36] text-[#BBD3EE] backdrop-blur-md">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-white">Terms and Conditions</h1>
          <p className="mb-4 text-[#989FAB] text-center">Last updated: June 2024</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using the Softbook web application ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">2. Description of Service</h2>
          <p className="mb-4">The Service provides a platform for library management, including but not limited to student registration, seat booking, attendance tracking, payment management, and administrative controls. The Service is accessible via web browsers and may include both frontend and backend components.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">3. User Responsibilities</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>You must provide accurate and complete information during registration and while using the Service.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree not to misuse the Service, including attempting unauthorized access, distributing malware, or disrupting the Service.</li>
            <li>You are responsible for all activities that occur under your account.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">4. Data Collection and Usage</h2>
          <p className="mb-4">We collect and process personal information as described in our Privacy Policy. By using the Service, you consent to such collection and processing.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">5. Intellectual Property</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>All content, trademarks, logos, and software related to the Service are the property of Softbook or its licensors.</li>
            <li>You may not copy, modify, distribute, sell, or lease any part of our Service or included software.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">6. Limitation of Liability</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>The Service is provided "as is" and "as available" without warranties of any kind.</li>
            <li>We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</li>
            <li>We do not guarantee the accuracy, completeness, or reliability of any content or data provided through the Service.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">7. Termination</h2>
          <p className="mb-4">We reserve the right to suspend or terminate your access to the Service at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">8. Changes to Terms</h2>
          <p className="mb-4">We may update these Terms and Conditions from time to time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">9. Governing Law</h2>
          <p className="mb-4">These Terms are governed by the laws of India. Any disputes arising from these Terms or the Service will be subject to the exclusive jurisdiction of the courts in Patna, Bihar.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:softbook.co.in@gmail.com" className="text-blue-400 underline">softbook.co.in@gmail.com</a>.</p>
        </div>
      </div>
      {/* Footer (copied from Home.jsx for consistency) */}
      <footer className="w-screen bg-[#181c27] border-t border-[#232a36] mt-10 py-8 px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-[#989FAB] text-sm relative left-1/2 right-1/2 -translate-x-1/2">
        {/* Logo and Typo */}
        <div className="flex flex-row gap-3 min-w-[180px] items-center md:items-start">
          <Link to="/" className="flex flex-row items-center gap-2">
            <img className="w-[40px] md:w-[55px] h-full align-middle" src={images.logo} alt="logo" />
            <img className="w-[100px] md:w-[160px] h-full align-middle" src={images.letterLogo} alt="logo" />
          </Link>
        </div>
        {/* Main Links */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
          <Link to="/" className="hover:text-[#D6D446] transition">Home</Link>
          <a href="#service" className="hover:text-[#D6D446] transition">Service</a>
          <a href="#pricing" className="hover:text-[#D6D446] transition">Pricing</a>
          <a href="#contact" className="hover:text-[#D6D446] transition">Contact</a>
          <Link to="/register" className="hover:text-[#D6D446] transition">Register</Link>
        </div>
        {/* Legal Links */}
        <div className="flex flex-col gap-2 items-center md:items-start">
          <Link to="/terms" className="hover:text-[#D6D446] transition">Terms and Conditions</Link>
          <Link to="/privacy" className="hover:text-[#D6D446] transition">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  </div>
);

export default Terms; 