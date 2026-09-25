import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/dentalizi-logo.png";

const navClass = ({ isActive }) => (isActive ? "active" : undefined);

// אייקוני קו חד-צבעיים - מקבלים את צבע הטקסט של הכפתור דרך currentColor
const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg {...iconProps}>
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

// הערך ההתחלתי כבר נקבע על <html> בסקריפט שב-index.html
function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light"
  );

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // אחסון חסום (למשל גלישה פרטית) - הבחירה פשוט לא תישמר
    }
    setTheme(next);
  };

  return [theme, toggle];
}

export default function Header() {
  const [theme, toggleTheme] = useTheme();
  const isDark = theme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={menuOpen ? "site-header menu-open" : "site-header"}>
      <div className="header-inner">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <img className="brand-logo" src={logo} alt="DentaLizi" />
        </Link>
        {/* לחיצה על קישור בתפריט סוגרת אותו */}
        <div
          className="header-menu"
          id="site-menu"
          onClick={(e) => e.target.closest("a") && setMenuOpen(false)}
        >
          {/* אין קישור לדף הבית - הלוגו משמש לכך */}
          <nav className="main-nav">
            <NavLink to="/math" className={navClass}>
              מתמטיקה
            </NavLink>
            <NavLink to="/chemistry" className={navClass}>
              כימיה
            </NavLink>
            <NavLink to="/simulation" className={navClass}>
              סימולציה מלאה
            </NavLink>
            <NavLink to="/about" className={navClass}>
              אודות
            </NavLink>
          </nav>
        </div>
        <div className="header-actions">
          <a className="btn-signup" href="#">
            הרשמה / התחברות
          </a>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
            title={isDark ? "מצב בהיר" : "מצב כהה"}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? "סגירת התפריט" : "פתיחת התפריט"}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>
    </header>
  );
}
