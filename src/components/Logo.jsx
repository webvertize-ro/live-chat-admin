import edionTransLogo from '../assets/ediontrans_logo.svg';

function Logo() {
  return (
    <div>
      <a
        className="navbar-brand navbar-brand-custom logo-link"
        href="index.html"
      >
        <img src={edionTransLogo} alt="Logo Edion Trans" width="50" />
        <div className="d-flex flex-column">
          <span className="logo-text">Edion Trans</span>
          <small className="logo-subtext ms-1">Servicii de transport</small>
        </div>
      </a>
    </div>
  );
}

export default Logo;
