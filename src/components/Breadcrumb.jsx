import { Link } from "react-router-dom";

// התו » הוא תו "ממוראה" (Bidi_Mirrored): בהקשר RTL הדפדפן מציג אותו כחץ
// שמאלה, כלומר בכיוון הקריאה בעברית. לכן דווקא » (ולא «) הוא הנכון כאן.
const SEPARATOR = "»";

export default function Breadcrumb({ items }) {
  return (
    <div className="breadcrumb">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && ` ${SEPARATOR} `}
          {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
        </span>
      ))}
    </div>
  );
}
