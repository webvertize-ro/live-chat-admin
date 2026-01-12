import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from './apiAuth';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueriesData(['user'], user);
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      console.log('Error', err);
      toast.error('Combinația de email și parolă este greșită!');
    },
  });

  return { login, isLoading: isPending };
}
