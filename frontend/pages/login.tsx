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

  const handleLogin = () => {
    // Example login logic (replace with actual API call)
    if (phoneNumber === '+11234567890' && password === 'password') {
      router.push('/dashboard'); // Redirect to dashboard after successful login
    } else {
      setError('Invalid phone number or password.');
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
              country={'us'}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputClass={styles.input}
              containerClass={styles.phoneInputContainer}
              specialLabel={''}
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
