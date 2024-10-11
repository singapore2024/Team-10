import { useState } from 'react';
import { useRouter } from 'next/router';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from '../styles/Login.module.scss';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (phoneNumber && password) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber,
            password,
          }),
        });

        if (response.ok) {
          // If login is successful, redirect to the dashboard
          router.push('/dashboard');
        } else {
          const data = await response.json();
          setError(data.message || 'Login failed.');
        }
      } catch (err) {
        setError('An error occurred during login.');
      }
    } else {
      setError('Please enter a valid phone number and password.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <PhoneInput
              country={'sg'}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputClass={styles.input}
              containerClass={styles.phoneInputContainer}
              specialLabel={''}
              inputStyle={{
                padding: '30px',
                fontSize: '16px',
                width: '100%',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button} onClick={handleLogin}>
            Login
          </button>
        </form>
        <p className={styles.link}>
          Don’t have an account?{' '}
          <a href="/register" className={styles.registerLink}>Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
