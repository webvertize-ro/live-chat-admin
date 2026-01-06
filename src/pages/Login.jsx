import styled from 'styled-components';
import LoginForm from '../components/authentication/LoginForm';
import Logo from '../components/Logo';

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function Login() {
  return (
    <LoginContainer>
      <Logo />
      <h3>Conectare pagina de admin</h3>
      <LoginForm />
    </LoginContainer>
  );
}

export default Login;
