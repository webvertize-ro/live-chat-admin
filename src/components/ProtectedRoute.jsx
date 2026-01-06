import styled from 'styled-components';
import { useUser } from './authentication/useUser';
import LoadingComponent from './LoadingComponent';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const FullPage = styled.div`
  height: 100vh;
  background-color: lightgrey;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // 1. Load the authenticated user
  const { isLoading, isAuthenticated } = useUser();

  // 2. If no authenticated user, redirect to /login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate('/');
    },
    [isAuthenticated, isLoading, navigate]
  );

  // 3. While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <LoadingComponent />
      </FullPage>
    );
  // 4. If there is a user, redirect to /dashboard
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
