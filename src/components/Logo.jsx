import styled from 'styled-components';
import edionTransLogo from '../assets/ediontrans_logo.svg';

const LogoTotal = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const LogoImage = styled.img`
  width: 50px;
`;

const LogoTextSubtext = styled.div``;

const LogoText = styled.div`
  font-family: 'EspumaPro-Bold';
  color: hsl(162, 70%, 37%);
  font-size: 2rem;
  font-family: 'EspumaPro-Bold';
`;

const LogoSubText = styled.span`
  margin-top: -12px;
  text-transform: uppercase;
  font-size: 0.8rem;
`;

function Logo() {
  return (
    <div>
      <LogoTotal
        className="navbar-brand navbar-brand-custom logo-link"
        href="index.html"
      >
        <LogoImage src={edionTransLogo} alt="Logo Edion Trans" />
        <LogoTextSubtext className="d-flex flex-column">
          <LogoText className="logo-text">Edion Trans</LogoText>
          <LogoSubText className="logo-subtext ms-1">
            Servicii de transport
          </LogoSubText>
        </LogoTextSubtext>
      </LogoTotal>
    </div>
  );
}

export default Logo;
