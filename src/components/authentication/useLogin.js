import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from './apiAuth';
import { useNavigate } from 'react-router';

export function useLogin() {
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      console.log(user);
      navigate('/dashboard');
    },
    onError: (err) => {
      console.log('Error', err);
    },
  });

  return { login, isLoading };
}
