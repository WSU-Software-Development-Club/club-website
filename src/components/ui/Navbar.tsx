import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TypingEffect from "./TypedEffect";
import softwareDevelopmentLogo from "../../assets/software-development-logo.png";

const navItems = [
  { label: "Projects", path: "/projects" },
  { label: "Events", path: "/events" },
  { label: "Team", path: "/team" },
  { label: "Join Us", path: "/join-us" },
];

// Complete functionality of navbar with desktop / mobile views and functionality
export default function Navbar() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // move to top of screen and prevent scrolling if hamburger is opened
  useEffect(() => {
    if (hamburgerOpen) {
      document.body.style.overflow = "hidden";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [hamburgerOpen]);

  return (
    <>
      {/* Navigation Bar that is always at te top of the screen */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b py-4 px-6 shadow">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="Home">
            <img
              src={softwareDevelopmentLogo}
              style={{ width: "40px", height: "auto" }}
              alt="Software Development Club logo"
            />
            <div className="font-bold">
              <TypingEffect text="Software Development Club at WSU"></TypingEffect>
            </div>
          </Link>

          {/* Default list of navigational links on wider displays */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="font-medium text-black80 hover:text-crimson transition-colors cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* hamburger menu on smaller screens */}
          <button
            className="md:hidden p-2"
            aria-label={hamburgerOpen ? "Close menu" : "Open menu"}
            aria-expanded={hamburgerOpen}
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
          >
            {!hamburgerOpen ? (
              <>
                {" "}
                {/* hamburger icon */}
                <span className="block w-6 h-0.5 bg-black80 my-1.5"></span>
                <span className="block w-6 h-0.5 bg-black80 my-1.5"></span>
                <span className="block w-6 h-0.5 bg-black80 my-1.5"></span>
              </>
            ) : (
              <div className="relative w-6 h-0.5">
                {" "}
                {/* x icon when open*/}
                <span className="absolute top-0 left-0 w-7 h-0.5 bg-black80 transform rotate-45"></span>
                <span className="absolute top-0 left-0 w-7 h-0.5 bg-black80 transform -rotate-45"></span>
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Dropdown menu if hamburger menu is used that blurs background */}
      <div
        className={`absolute top-10 left-0 w-full h-full bg-white/85 backdrop-blur z-40 transition-all duration-250 ease-in-out
                ${hamburgerOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}
      >
        <div className="w-full py-16 flex flex-col items-center space-y-8 text-xl">
          {navItems.map((item) => (
            <Link
              className="text-2xl font-bold text-center text-black80 hover:text-crimson transition-colors w-full cursor-pointer"
              key={item.path}
              to={item.path}
              onClick={() => setHamburgerOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
