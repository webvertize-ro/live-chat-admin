import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from './apiAuth';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

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
      toast.error('Combinația de email și parolă este greșită!');
    },
  });

  return { login, isLoading };
}
