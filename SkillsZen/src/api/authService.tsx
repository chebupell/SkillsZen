import { apiFetch } from "./api";

export const devLogin = async () => {
  if (localStorage.getItem('token')) return;

  try {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'Alex',
        password: 'password123',
      })
    });

    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      console.log('Login Successful');
    }
  } catch (error) {
    console.error('Login Failed:', error);
  }
}