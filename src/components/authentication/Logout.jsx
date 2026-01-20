import styled from 'styled-components';
import LoadingComponent from '../LoadingComponent';
import { useLogout } from './useLogout';

const StyledButton = styled.button`
  @media (max-width: 576px) {
    font-size: 0.8rem;
  }
`;

function Logout() {
  const { logout, isLoading } = useLogout();

  return (
    <StyledButton
      disabled={isLoading}
      onClick={logout}
      className="btn btn-danger"
    >
      {!isLoading ? 'Deconectare' : <LoadingComponent />}
    </StyledButton>
  );
}

export default Logout;
