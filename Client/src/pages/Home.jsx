import React from "react";
import NavbarHome from "../components/NavbarHome";
import { Link } from "react-router-dom";
import { FaDatabase } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { images } from "../assets/assets";

function Home() {
  return (
    <div className="bg-[#0F0E1B] w-full relative overflow-hidden px-6 py-2 ">
      {/* Gradient backgrounds - improved for mobile */}
      <div
        className="bg-gradient-to-br from-[#03C7BD] rounded-full absolute z-0
        w-[120px] h-[140px] blur-[60px] top-[380px] left-[-100px]
        sm:w-[220px] sm:h-[120px] sm:blur-[90px] sm:top-[60px] sm:left-[-100px]
        md:w-[500px] md:h-[300px] md:blur-[150px] md:top-[300px] md:left-[-270px]
      "
      ></div>
      <div
        className="bg-gradient-to-br from-[#1703C7] rounded-full absolute z-0
        w-[260px] h-[200px] blur-[100px] top-[500px] left-[-150px]
        sm:w-[220px] sm:h-[120px] sm:blur-[90px] sm:top-[160px] sm:left-[-80px]
        md:w-[550px] md:h-[300px] md:blur-[120px] md:top-[520px] md:left-[-100px]
      "
      ></div>
      <div
        className="bg-gradient-to-br from-[#D445CF] rounded-full absolute z-0
        w-[200px] h-[120px] blur-[70px] top-[660px] left-[-0px]
        sm:w-[220px] sm:h-[120px] sm:blur-[110px] sm:top-[260px] sm:left-[-40px]
        md:w-[550px] md:h-[300px] md:blur-[120px] md:top-[750px] md:left-[150px]
      "
      ></div>
      <div
        className="bg-gradient-to-br from-[#D6D446] rounded-full absolute z-0
        w-[220px] h-[220px] blur-[60px] top-[680px] left-[140px]
        sm:w-[220px] sm:h-[120px] sm:blur-[90px] sm:top-[320px] sm:left-[40px]
        md:w-[550px] md:h-[300px] md:blur-[100px] md:top-[850px] md:left-[450px]
      "
      ></div>
      <div
        className="bg-gradient-to-br from-[#D445CF] rounded-full absolute z-0
        w-[180px] h-[140px] blur-[80px] top-[620px] right-[-0px]
        sm:w-[220px] sm:h-[120px] sm:blur-[120px] sm:top-[260px] sm:right-[-40px]
        md:w-[550px] md:h-[300px] md:blur-[180px] md:top-[750px] md:right-[150px]
      "
      ></div>
      <div
        className="bg-gradient-to-br from-[#1703C7] rounded-full absolute z-0
        w-[200px] h-[250px] blur-[100px] top-[400px] right-[-130px]
        sm:w-[220px] sm:h-[120px] sm:blur-[110px] sm:top-[160px] sm:right-[-100px]
        md:w-[500px] md:h-[300px] md:blur-[160px] md:top-[520px] md:right-[-300px]
      "
      ></div>
      <div
        className="bg-gradient-to-br from-[#03C7BD] rounded-full absolute z-0
        w-[120px] h-[180px] blur-[60px] top-[350px] right-[-100px]
        sm:w-[220px] sm:h-[120px] sm:blur-[90px] sm:top-[60px] sm:right-[-120px]
        md:w-[500px] md:h-[300px] md:blur-[150px] md:top-[300px] md:right-[-450px]
      "
      ></div>
      {/* <div className="bg-gradient-to-tr from-[#D6D446] via-[#03C7BD] to-[#03C7BD] w-[500px] h-[700px] rounded-full blur-[600px] absolute top-[-650px] right-[-400px] z-0"></div> */}

      {/* Main content above gradients */}
      <div className="relative z-10">
        <NavbarHome />
        {/* Hero Section */}
        <div className="w-full min-h-screen flex items-center justify-center  z-10">
          <div className="flex flex-col items-center gap-6 w-full px-2 sm:px-4">
            <div className="flex flex-col items-center gap-2 w-full">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center">
                Make Your Library Smarter
              </h2>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold bg-gradient-to-r from-[#D6D446] to-[#03C7BD] bg-clip-text text-transparent pb-2 sm:pb-3 md:pb-4 text-center">
                Best way to manage your library
              </h2>
            </div>
            <p className="w-full max-w-xl md:max-w-4xl text-center text-base sm:text-lg md:text-2xl text-[#989FAB] px-2">
              Take admissions, generate receipts, track due dates, maintain
              student record, check seat availability all under one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-white text-base sm:text-lg md:text-[20px] mt-3 w-full justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#D6D446] via-[#F591B7] to-[#03C7BD] px-8 sm:px-10 md:px-24 py-3 sm:py-4 rounded-xl text-center w-full sm:w-auto font-bold"
              >
                Register Now
              </Link>
              {/* <a
                href="#service"
                className="bg-[#374151] px-8 sm:px-10 md:px-13 py-3 sm:py-4 rounded text-center w-full sm:w-auto"
              >
                Learn More
              </a> */}
            </div>
          </div>
        </div>

        {/* Service Section */}
        <div
          id="service"
          className="w-full flex items-center justify-center mb-20"
        >
          <div className="w-full flex flex-col md:flex-row items-stretch md:items-start gap-6 md:gap-0">
            {/* Left section: Title and description */}
            <div className="md:w-[28%] w-full p-6 flex flex-col gap-4">
              <h4 className="text-2xl sm:text-[28px] text-white font-bold">
                Services we provide
              </h4>
              <p className="max-w-full md:max-w-[60%] text-base sm:text-[16px] text-[#989FAB]">
                We are redefining the way owners run their libraries.
              </p>
            </div>
            {/* Service 1 */}
            <div
              className="md:w-[24%] w-full p-8 flex flex-col gap-4 items-start border-3 border-dotted rounded-xl"
              style={{ borderColor: "#03C7BD" }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1F2937] rounded-full flex items-center justify-center">
                <FaDatabase size={30} />
              </div>
              <h4 className="text-xl sm:text-[24px] text-white">
                Maintain your Database
              </h4>
              <p className="text-base sm:text-[16px] text-[#989FAB]">
                We help you store, unify and organise your library data in the
                most optimised way possible.
              </p>
            </div>
            {/* Service 2 */}
            <div className="md:w-[24%] w-full p-8 flex flex-col gap-4 items-start">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1F2937] rounded-full flex items-center justify-center">
                <FaAddressBook size={30} />
              </div>
              <h4 className="text-xl sm:text-[24px] text-white">
                Booking System
              </h4>
              <p className="text-base sm:text-[16px] text-[#989FAB]">
                Register students on the go, download receipt and send them over
                WhatsApp, all under one platform. Save paper, be sustainable!
              </p>
            </div>
            {/* Service 3 */}
            <div className="md:w-[24%] w-full p-8 flex flex-col gap-4 items-start">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1F2937] rounded-full flex items-center justify-center">
                <FaEye size={30} />
              </div>
              <h4 className="text-xl sm:text-[24px] text-white">Birds Eye</h4>
              <p className="text-base sm:text-[16px] text-[#989FAB]">
                As a library owner to deserve to have a clear visibility of your
                records under one platform. We got you covered.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="flex flex-col items-center mb-20 px-4">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-[32px] sm:text-[40px] font-semibold text-white">
              Pricing
            </h2>
            <p className="text-[#989FAB] text-[14px]">
              Best Quality. Best Prices.
            </p>
          </div>
          {/* Responsive pricing cards */}
          <div className="relative w-full flex flex-col lg:flex-row justify-center items-center gap-6">
            {/* Left Card */}
            <div className="w-full sm:w-[90%] lg:w-[320px] max-w-[370px] h-auto bg-[#232a36] rounded-xl shadow-lg transition-all duration-300 lg:mr-6 lg:ml-0 ml-0 mb-6 lg:mb-0 flex-shrink-0">
              <div className="flex flex-col items-center justify-center px-8 py-10 h-full">
                <h3 className="text-white text-2xl font-semibold mb-2">
                  Basic
                </h3>
                <p className="text-[#989FAB] mb-6 text-center">
                  Perfect for individuals and small businesses starting out.
                </p>
                <div className="text-3xl font-bold text-white mb-4">
                  $9<span className="text-lg font-normal">/mo</span>
                </div>
                <ul className="text-[#989FAB] text-sm mb-6 space-y-2 text-center">
                  <li>✔ 1 User</li>
                  <li>✔ Basic Analytics</li>
                  <li>✔ Email Support</li>
                </ul>
                <button className="bg-[#303A96] text-white px-6 py-2 rounded hover:bg-[#232a6b] transition">
                  Choose Basic
                </button>
              </div>
            </div>
            {/* Center Card */}
            <div className="w-full sm:w-[90%] lg:w-[340px] max-w-[370px] h-auto bg-[#3B4252] rounded-xl shadow-2xl flex flex-col items-center justify-center px-8 py-12 lg:scale-110 lg:mx-0 mx-auto mb-6 lg:mb-0 flex-shrink-0 z-20">
              <h3 className="text-white text-2xl font-semibold mb-2">Pro</h3>
              <p className="text-[#989FAB] mb-6 text-center">
                Best for growing teams and established businesses.
              </p>
              <div className="text-4xl font-bold text-white mb-4">
                $29<span className="text-lg font-normal">/mo</span>
              </div>
              <ul className="text-[#989FAB] text-sm mb-6 space-y-2 text-center">
                <li>✔ Up to 10 Users</li>
                <li>✔ Advanced Analytics</li>
                <li>✔ Priority Support</li>
                <li>✔ Custom Reports</li>
              </ul>
              <button className="bg-[#D6D446] text-[#232a36] font-semibold px-8 py-2 rounded hover:bg-[#bdbb3a] transition">
                Choose Pro
              </button>
            </div>
            {/* Right Card */}
            <div className="w-full sm:w-[90%] lg:w-[320px] max-w-[370px] h-auto bg-[#232a36] rounded-xl shadow-lg transition-all duration-300 lg:ml-6 lg:mr-0 mr-0 flex-shrink-0">
              <div className="flex flex-col items-center justify-center px-8 py-10 h-full">
                <h3 className="text-white text-2xl font-semibold mb-2">
                  Enterprise
                </h3>
                <p className="text-[#989FAB] mb-6 text-center">
                  For large organizations with advanced needs.
                </p>
                <div className="text-3xl font-bold text-white mb-4">Custom</div>
                <ul className="text-[#989FAB] text-sm mb-6 space-y-2 text-center">
                  <li>✔ Unlimited Users</li>
                  <li>✔ All Pro Features</li>
                  <li>✔ Dedicated Manager</li>
                  <li>✔ SLA & Custom Integrations</li>
                </ul>
                <button className="bg-[#303A96] text-white px-6 py-2 rounded hover:bg-[#232a6b] transition">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div
          id="contact"
          className="flex flex-col md:flex-row items-start w-full mb-20 px-4 sm:px-8 md:px-10 gap-8"
        >
          <div className="w-full md:w-[35%] flex flex-col items-start mb-8 md:mb-0">
            <h2 className="text-[32px] sm:text-[36px] md:text-[40px] font-semibold text-white mb-2">
              Contact Us
            </h2>
            <p className="text-[#989FAB] text-[15px] sm:text-[16px]">
              Get a Quote today.
            </p>
          </div>
          <form className="w-full md:w-[65%] bg-[#232a36] rounded-xl shadow-lg p-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="contact-name"
                  className="text-white mb-1 text-sm"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  className="px-4 py-2 rounded bg-[#181c27] text-white border border-[#303A96] focus:outline-none focus:ring-2 focus:ring-[#D6D446] transition"
                  placeholder="Your Name"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="contact-email"
                  className="text-white mb-1 text-sm"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className="px-4 py-2 rounded bg-[#181c27] text-white border border-[#303A96] focus:outline-none focus:ring-2 focus:ring-[#D6D446] transition"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="contact-phone"
                className="text-white mb-1 text-sm"
              >
                Phone
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                className="px-4 py-2 rounded bg-[#181c27] text-white border border-[#303A96] focus:outline-none focus:ring-2 focus:ring-[#D6D446] transition"
                placeholder="Your Phone Number"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="contact-description"
                className="text-white mb-1 text-sm"
              >
                Description
              </label>
              <textarea
                id="contact-description"
                name="description"
                rows={4}
                required
                className="px-4 py-2 rounded bg-[#181c27] text-white border border-[#303A96] focus:outline-none focus:ring-2 focus:ring-[#D6D446] transition resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="bg-[#303A96] text-white px-8 py-3 rounded hover:bg-[#232a6b] transition font-semibold mt-2 w-full sm:w-auto"
            >
              Contact Us
            </button>
          </form>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-screen bg-[#181c27] border-t border-[#232a36] mt-10 py-8 px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-[#989FAB] text-sm relative left-1/2 right-1/2 -translate-x-1/2">
        {/* Logo and Typo */}
        <div className="flex flex-row gap-3 min-w-[180px] items-center md:items-start">
          <Link to="/" className="flex flex-row items-center gap-2">
            <img
              className="w-[40px] md:w-[55px] h-full align-middle"
              src={images.logo}
              alt="logo"
            />
            <img
              className="w-[100px] md:w-[160px] h-full align-middle"
              src={images.letterLogo}
              alt="logo"
            />
          </Link>
        </div>
        {/* Main Links */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
          <Link to="/" className="hover:text-[#D6D446] transition">
            Home
          </Link>
          <a href="#service" className="hover:text-[#D6D446] transition">
            Service
          </a>
          <a href="#pricing" className="hover:text-[#D6D446] transition">
            Pricing
          </a>
          <a href="#contact" className="hover:text-[#D6D446] transition">
            Contact
          </a>
          <Link to="/register" className="hover:text-[#D6D446] transition">
            Register
          </Link>
        </div>
        {/* Legal Links */}
        <div className="flex flex-col gap-2 items-center md:items-start">
          <Link to="/terms" className="hover:text-[#D6D446] transition">
            Terms and Conditions
          </Link>
          <Link to="/privacy" className="hover:text-[#D6D446] transition">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
