import React from "react";
import NavbarHome from "../components/NavbarHome";
import { images } from "../assets/assets";
import { Link } from "react-router-dom";

const Privacy = () => (
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-white">Privacy Policy</h1>
          <p className="mb-4 text-[#989FAB] text-center">Last updated: June 2024</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">1. Introduction</h2>
          <p className="mb-4">This Privacy Policy explains how Softbook ("we", "us", or "our") collects, uses, discloses, and safeguards your information when you use our web application ("Service").</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">2. Information We Collect</h2>
          <ul className="list-disc ml-6 mb-4">
            <li><b>Personal Information:</b> Name, email address, phone number, library name, address, and payment details.</li>
            <li><b>Usage Data:</b> Information about how you use the Service, such as access times, pages viewed, and actions taken.</li>
            <li><b>Device Information:</b> IP address, browser type, operating system, and device identifiers.</li>
            <li><b>Location Data:</b> If you grant permission, we may collect your device’s location for registration and security purposes.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">3. How We Use Your Information</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>To provide, operate, and maintain the Service.</li>
            <li>To process registrations, payments, and manage user accounts.</li>
            <li>To improve, personalize, and expand our Service.</li>
            <li>To communicate with you, including sending updates and notifications.</li>
            <li>To monitor and analyze usage and trends to improve user experience.</li>
            <li>To detect and prevent fraud, abuse, or security incidents.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">4. Data Sharing and Disclosure</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>We do not sell your personal information to third parties.</li>
            <li>We may share information with service providers who assist in operating the Service (e.g., payment processors, cloud storage).</li>
            <li>We may disclose information if required by law or to protect our rights and safety.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">5. Data Security</h2>
          <p className="mb-4">We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">6. Cookies and Tracking Technologies</h2>
          <p className="mb-4">We use cookies and similar technologies to enhance your experience, analyze usage, and improve the Service. You can control cookies through your browser settings.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">7. Third-Party Services</h2>
          <p className="mb-4">Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of such third parties.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">8. Children’s Privacy</h2>
          <p className="mb-4">Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">9. Your Rights</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>You may access, update, or delete your personal information by contacting us.</li>
            <li>You may opt out of receiving marketing communications at any time.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">10. Changes to This Policy</h2>
          <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any changes by updating the date at the top of this page.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-[#D6D446]">11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:softbook.co.in@gmail.com" className="text-blue-400 underline">softbook.co.in@gmail.com</a>.</p>
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

export default Privacy; 