import styled from 'styled-components';
import { useUser } from './authentication/useUser';
import LoadingComponent from './LoadingComponent';

const FullPage = styled.div`
  height: 100vh;
  background-color: lightgrey;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  // 1. Load the authenticated user
  const { user, isLoading } = useUser();
  // 2. While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <LoadingComponent />
      </FullPage>
    );

  // 3. If no authenticated user, redirect to /login
  // 4. If there is a user, redirect to /dashboard
  return children;
}

export default ProtectedRoute;
