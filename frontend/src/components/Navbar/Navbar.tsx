import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Droplets, Menu, X, User, LogOut, Bell } from "lucide-react";
import { useUnreadCount } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store/store";
import { clearUser } from "@/store/userSlice";
import { logoutUser } from "@/Service/authService";
import { PROFILE_TOASTS } from "@/constants/toastMessages";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "@/components/Theme/ThemeProvider";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: unreadCount } = useUnreadCount();

  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser());
      toast.success(PROFILE_TOASTS.LOGOUT_SUCCESS);
      navigate("/");
    } catch {
      toast.error(PROFILE_TOASTS.LOGOUT_FAILED);
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "ml" : "en";
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.donors"), href: "/donors" },
    { label: t("nav.stories"), href: "/stories" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Droplets className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-foreground">
              Blood<span className="text-primary">Bond</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Controls (Theme, Language) + Auth */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1 border-r border-border/50 pr-4 mr-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                title="Switch Language"
              >
                <Languages size={20} />
                <span className="text-xs font-black uppercase">{i18n.language === 'en' ? 'മല' : 'EN'}</span>
              </button>
            </div>
            {isLoggedIn ? (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                >
                  <Bell size={22} />
                  {unreadCount !== undefined && unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold overflow-hidden">
                    {user.photoUrl ? (
                      <img 
                        src={user.photoUrl} 
                        alt={user.name || "User"} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">
                    {user.name || user.email || "User"}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-background shadow-lg z-50 overflow-hidden">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <User size={16} />
                        {t("nav.profile")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        {t("nav.logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary hover:bg-burgundy-light text-primary-foreground">
                    {t("nav.signup")}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
            >
              <Languages size={20} />
              <span className="text-[10px] font-black uppercase">{i18n.language === 'en' ? 'മല' : 'EN'}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-border">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <Link
                    to="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-medium text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Bell size={16} />
                      {t("nav.notifications")}
                    </div>
                    {unreadCount !== undefined && unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm font-medium text-foreground"
                  >
                    <User size={16} />
                    {t("nav.profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-sm font-medium text-red-600"
                  >
                    <LogOut size={16} />
                    {t("nav.logout")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-primary text-primary">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-burgundy-light text-primary-foreground">
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
