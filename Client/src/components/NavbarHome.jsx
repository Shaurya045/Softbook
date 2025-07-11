import React, { useState } from "react";
import { images } from "../assets/assets";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function NavbarHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="h-[80px] flex justify-between items-center px-4 sm:px-[4%] pt-6 bg-transparent z-10 relative">
      {/* Logo */}
      <Link to="/" className="flex items-center z-20">
        <img className="w-[55px] sm:w-[75px]" src={images.logo} alt="logo" />
        <img
          className="w-[160px] sm:w-[233px] "
          src={images.letterLogo}
          alt="logo"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden xl:flex items-center justify-center gap-12 lg:gap-24 text-[18px] lg:text-[20px] text-white">
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
      </div>

      {/* Desktop Button */}
      <Link
        to="/register"
        className="hidden xl:block bg-[#303A96] px-6 lg:px-8 py-2 lg:py-3 text-[18px] lg:text-[20px] text-white rounded transition hover:bg-[#232a6b]"
      >
        <span>Get One for Yourself</span>
      </Link>

      {/* Hamburger Icon */}
      <button
        className="xl:hidden z-30 text-white text-2xl focus:outline-none"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-[#0F0E1B] bg-opacity-95 flex flex-col items-center justify-center gap-10 text-white text-2xl transition-transform duration-300 z-20 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } xl:hidden`}
      >
        <Link
          to="/"
          className="hover:text-[#D6D446] transition"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <a
          href="#service"
          className="hover:text-[#D6D446] transition"
          onClick={() => setMenuOpen(false)}
        >
          Service
        </a>
        <a
          href="#pricing"
          className="hover:text-[#D6D446] transition"
          onClick={() => setMenuOpen(false)}
        >
          Pricing
        </a>
        <a
          href="#contact"
          className="hover:text-[#D6D446] transition"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </a>
        <Link
          to="/register"
          className="bg-[#303A96] px-8 py-3 text-white rounded text-xl mt-4"
          onClick={() => setMenuOpen(false)}
        >
          Get One for Yourself
        </Link>
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-10 max-h-screen xl:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}

export default NavbarHome;
