import React, { useEffect, useState } from 'react';
import { useUserContext } from './UserContext';
import { Box, Text } from '@chakra-ui/react';

export const UserDetail = () => {
  const { selectedUser } = useUserContext();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    /*🚩before it was like this (user) useEffect arrow function never takes any parameter: 
    Adding 'user' or any other argument directly inside the parentheses of the callback function passed to useEffect is incorrect because the useEffect hook is designed to accept a specific function signature that does not include parameters. Here's the fundamental reason why it's wrong:
    Function Signature: The useEffect hook expects its first argument to be a function that does not take any parameters. This function is called an "effect" function. The design of React's hooks API is such that this effect function is executed by React itself, which does not pass any arguments to it. Therefore, defining parameters for this function does not align with how React intends it to be used.

    Scope and Access to Variables: React hooks, including useEffect, are designed to work within the functional component's scope. This means that any props or state variables you want to access within useEffect are already accessible directly by name; you don't need to pass them as parameters. For example, if user is a prop or state variable in your component, you can directly use user inside the useEffect function without needing to list it as a parameter.
    
    */
    let ignore = false;

    const fetchUserDetails = async () => {
      if (!selectedUser) return;

      try {
        const response = await fetch(`http://localhost:3000/users/${selectedUser.id}`);
        //❌it was like this before: const response = await fetch(`http://some-api/user-details/${selectedUser.id}`);
        if (!ignore) {
          const data = await response.json(); // 🚩 forgot to Parse the JSON response
          setUserDetails(data);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();

    return () => {
      ignore = true;
    };
  }, [selectedUser]); // Depend on selectedUser to refetch when it changes

  if (!selectedUser) return null;

  return (
    <Box border="1px" borderColor="gray.200" p="4" borderRadius="md">
      <Text>
        Name:
        {selectedUser.name}
      </Text>
      <Text>
        Last Name:
        {selectedUser.lastname}
      </Text>
      <Text>Email: {selectedUser.email}</Text>
      <Text>Website: {selectedUser.website}</Text>
      <Text>Company: {selectedUser.company.name}</Text>
      {/* Display additional user details fetched */}
    </Box>
  );
};
