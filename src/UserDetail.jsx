import { Box, Text, UnorderedList } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export const UserDetail = ({ user }) => {
  if (!user) return null; // If no user is selected, don't render anything

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    /*🚩before it was like this (user) useEffect arrow function never takes any parameter: 
    Adding 'user' or any other argument directly inside the parentheses of the callback function passed to useEffect is incorrect because the useEffect hook is designed to accept a specific function signature that does not include parameters. Here's the fundamental reason why it's wrong:
    Function Signature: The useEffect hook expects its first argument to be a function that does not take any parameters. This function is called an "effect" function. The design of React's hooks API is such that this effect function is executed by React itself, which does not pass any arguments to it. Therefore, defining parameters for this function does not align with how React intends it to be used.

    Scope and Access to Variables: React hooks, including useEffect, are designed to work within the functional component's scope. This means that any props or state variables you want to access within useEffect are already accessible directly by name; you don't need to pass them as parameters. For example, if user is a prop or state variable in your component, you can directly use user inside the useEffect function without needing to list it as a parameter.
    
    */
    let ignore = false; // 🚩 this two line should be put inmidiatly after { and before the fetchUserPost declaration
    setUserPosts([]); // 🚩 forgot to wrap the [] in ()
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(
          //making a request
          `http://localhost:3000/users/${user.id}/posts`
          //🚩I didn't use backs ticks before.You need them if you use template literal ${....}
        );
        const posts = await response.json(); // 🚩 forgot to Parse the JSON response
        if (!ignore) {
          setUserPosts(posts);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUserPosts(); // Correctly placed inside useEffect and before the cleanup function

    return () => {
      ignore = true;
    };
  }, [user]); // 🚩 forgot to include user in Dependency array is correctly empty to run on change

  return (
    <Box border="1px" borderColor="gray.200" p="4" borderRadius="md">
      <Text fontSize="xl">{user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Website: {user.website}</Text>
      <Text>Company: {user.company.name}</Text>
      <UnorderedList>
        {userPosts &&
          userPosts.map(
            (
              post //using parenthesis to directly return JSX content to render it
            ) => (
              <Box key={post.id} mb="4">
                <Text fontWeight="bold">{post.title}</Text>
                <Text>{post.body}</Text>
              </Box>
            )
          )}
      </UnorderedList>
    </Box>
  );
};
