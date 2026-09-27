import "../styles/Footer.css";
import logo from "../assets/logo.png";
import iconUnifor from "../assets/unifor-icone-footer.svg";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-text">
        <strong>UniFit</strong>
        <p>Fundação Edson Queiroz - Universidade de Fortaleza</p>
      </div>

      <div className="footer-logo">
        <img src={iconUnifor} alt="Unifor" className="footer-icon-img" />
        <span>|</span>
        <span>UniFit</span>
      </div>
    </footer>
  );
}

export default Footer;