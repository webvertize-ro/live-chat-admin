import LoadingComponent from '../LoadingComponent';
import { useLogout } from './useLogout';

function Logout() {
  const { logout, isLoading } = useLogout();

  return (
    <button disabled={isLoading} onClick={logout}>
      {!isLoading ? 'Log out' : <LoadingComponent />}
    </button>
  );
}

export default Logout;
