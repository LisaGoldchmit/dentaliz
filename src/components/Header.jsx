import { Link, NavLink } from "react-router-dom";
import logo from "../assets/dentalizi-logo.png";

const navClass = ({ isActive }) => (isActive ? "active" : undefined);

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/">
          <img className="brand-logo" src={logo} alt="DentaLizi" />
        </Link>
        <nav className="main-nav">
          <NavLink to="/" end className={navClass}>
            דף הבית
          </NavLink>
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
        <a className="btn-signup" href="#">
          הרשמה / התחברות
        </a>
      </div>
    </header>
  );
}
