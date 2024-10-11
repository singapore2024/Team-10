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
  const [roles, setRoles] = useState<string[]>([]); // State for roles (buyer and/or seller)
  const [error, setError] = useState('');

  // Toggle the role in the roles array
  const handleRoleChange = (role: string) => {
    setRoles((prevRoles) =>
      prevRoles.includes(role)
        ? prevRoles.filter((r) => r !== role) // If role already selected, remove it
        : [...prevRoles, role] // Else, add the new role
    );
  };

  // POST request handling with is_seller field
  const handleRegister = async () => {
    if (name && phoneNumber && password && roles.length > 0) {
      const is_seller = roles.includes('seller') ? 1 : 0; // If seller role is selected, set is_seller to 1, else 0

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            phoneNumber,
            password,
            is_seller, // Send is_seller as 1 or 0 based on selection
            roles, // Send the roles array (so backend knows both buyer and seller)
          }),
        });

        if (response.ok) {
          // Handle successful registration
          router.push('/login'); // Redirect to login page after successful registration
        } else {
          const data = await response.json();
          setError(data.message || 'Registration failed.');
        }
      } catch (err) {
        setError('An error occurred during registration.');
      }
    } else {
      setError('Please enter a valid name, phone number, password, and select at least one role.');
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
              country={'sg'}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputClass={styles.input}
              containerClass={styles.phoneInputContainer}
              specialLabel={''}
              inputStyle={{
                padding: '30px', // Increase the padding here
                fontSize: '16px',
                width: '100%',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
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

          {/* Role Selection (Buyer or Seller) */}
          <div className={styles.formGroup}>
            <label htmlFor="role">Register as</label>
            <div>
              <label className={styles.checkboxLabel}>
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={roles.includes('buyer')}
                  onChange={() => handleRoleChange('buyer')} // Toggle Buyer Role
                />
                Buyer
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={roles.includes('seller')}
                  onChange={() => handleRoleChange('seller')} // Toggle Seller Role
                />
                Seller
              </label>
            </div>
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
