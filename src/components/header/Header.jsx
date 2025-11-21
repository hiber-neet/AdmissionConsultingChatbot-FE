// src/components/header/Header.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const goChatbot = () => {
    navigate("/chatbot");
    setIsMobileMenuOpen(false);
  };

    const goarticles = () => {
    navigate("/articles");
    setIsMobileMenuOpen(false);
  };

  const goLogin = () => {
    navigate("/loginprivate");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl">
              <GraduationCap className={`h-8 w-8 text-white`} />
            </div>
            <div>
              <h1
                className={`text-xl font-bold ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                FPT University
              </h1>
              <p
                className={`text-xs ${
                  isScrolled ? "text-gray-600" : "text-white/90"
                }`}
              >
                Đại học FPT
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600"
                  : "text-white hover:text-orange-200"
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600"
                  : "text-white hover:text-orange-200"
              }`}
            >
              Giới thiệu
            </button>
            <button
              onClick={() => scrollToSection("programs")}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600"
                  : "text-white hover:text-orange-200"
              }`}
            >
              Ngành học
            </button>
            <button
              onClick={() => scrollToSection("admissions")}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600"
                  : "text-white hover:text-orange-200"
              }`}
            >
              Tuyển sinh
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600"
                  : "text-white hover:text-orange-200"
              }`}
            >
              Liên hệ
            </button>

 <button
              onClick={goarticles}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600"
                  : "text-white hover:text-orange-200"
              }`}
            >
              Báo
            </button>

            {/* NEW: Chatbot -> /chatbotguest */}
            <button
              onClick={goChatbot}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600"
                  : "text-white hover:text-orange-200"
              }`}
            >
              Chatbot
            </button>

            {/* CTA: Đăng ký + Đăng nhập (đặt cạnh nhau, Đăng nhập bên phải) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToSection("admissions")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Đăng ký ngay
              </button>
              <button
                onClick={goLogin}
                className="rounded-full bg-black text-white px-6 py-2.5 font-medium hover:opacity-90 transition"
              >
                Đăng nhập
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X
                className={`h-6 w-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-2xl overflow-hidden">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                Trang chủ
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                Giới thiệu
              </button>
              <button
                onClick={() => scrollToSection("programs")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                Ngành học
              </button>
              <button
                onClick={() => scrollToSection("admissions")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                Tuyển sinh
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                Liên hệ
              </button>

              {/* NEW: Chatbot (mobile) */}
              <button
                onClick={goChatbot}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                Chatbot
              </button>

              {/* CTA ở mobile */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => scrollToSection("admissions")}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Đăng ký ngay
                </button>
                <button
                  onClick={goLogin}
                  className="flex-1 bg-black text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
