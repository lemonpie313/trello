import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/AuthService';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signIn({ email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/workspace');
    } catch (error) {
      console.error('SignIn error:', error);
      alert('로그인 실패!');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
    </div>
  );
};

export default SignIn;
