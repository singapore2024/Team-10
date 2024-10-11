import { useState } from 'react';
import { useRouter } from 'next/router';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from '../styles/Register.module.scss';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState(''); // State for Name
  const [phoneNumber, setPhoneNumber] = useState(''); // State for Phone Number
  const [password, setPassword] = useState(''); // State for Password
  const [error, setError] = useState('');

  const handleRegister = () => {
    // Example register logic (replace with your API call)
    if (name && phoneNumber && password) {
      router.push('/login'); // Redirect to login page after successful registration
    } else {
      setError('Please enter a valid name, phone number, and password.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Name Input Field */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Set Name State
              className={styles.input}
              placeholder="Enter your name"
              required
            />
          </div>
          
          {/* Phone Number Input Field */}
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <PhoneInput
              country={'us'}
              value={phoneNumber}
              onChange={setPhoneNumber} // Set Phone Number State
              inputClass={styles.input}
              containerClass={styles.phoneInputContainer}
              specialLabel={''}
            />
          </div>
          
          {/* Password Input Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Set Password State
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className={styles.button} onClick={handleRegister}>
            Register
          </button>
        </form>
        
        <p className={styles.link}>
          Already have an account?{' '}
          <a href="/login" className={styles.loginLink}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
