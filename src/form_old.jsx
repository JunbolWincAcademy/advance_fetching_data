import { useState } from 'react';
import { useUserContext } from './UserContext'; // Import the context hook
import { Input, Button } from '@chakra-ui/react';

export const UserForm = () => {
  // State for each form field
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [companyName, setCompanyName] = useState('');

  const { createUser } = useUserContext(); // Use context to access createUser

  // Reset form fields function
  const resetFormFields = () => {
    setName('');
    setLastName('');
    setEmail('');
    setWebsite('');
    setCompanyName('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation for names to ensure they contain only letters and spaces
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(name) || !nameRegex.test(lastname)) {
      alert('Please enter a valid name (letters only, first and last name required).');
      return;
    }

    try {
      // Create user object and invoke createUser
      await createUser({
        name,
        lastname,
        email,
        website,
        company: {
          name: companyName,
        },
      });
      // Reset form fields after submission
      resetFormFields();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input mb="1rem" type="text" required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input mb="1rem" type="text" required placeholder="Lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} />
      <Input mb="1rem" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input mb="2rem" type="url" required placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
      <Input mb="2rem" type="text" required placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      <Button mb="2rem" mr="2rem" type="submit">
        Add User
      </Button>
      <Button type="button" mb="2rem" onClick={resetFormFields}>
        Reset
      </Button>
    </form>
  );
};
