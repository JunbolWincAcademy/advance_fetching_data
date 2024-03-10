import React from 'react';
import { UserProvider, useUserContext } from './UserContext'; // Adjust the import
import { UserForm } from './UserForm';
import { UserDetail } from './UserDetail';
import { Flex, Heading, Text, UnorderedList, List, Button } from '@chakra-ui/react';

const UserList = () => {
  const { userList, setSelectedUser, deleteUser } = useUserContext(); // Consuming the context to get the user list

  return (
    <UnorderedList listStyleType="none">
      {userList.map((user) => (
        <li key={user.id}>
          {user.name}{' '}
          <Button size="xs" onClick={() => setSelectedUser(user)}>
            User Data
          </Button>{' '}
          <Button size="xs" onClick={() => deleteUser(user.id)}>
            Delete
          </Button>
        </li> // Simple rendering, adjust as needed
      ))}
    </UnorderedList>
  );
};

/* UserList Inside or Outside App Component: In your setup, UserList is defined outside of the App component, which is perfectly fine in React. Whether you define a component like UserList inside or outside of another component (App, in this case) depends on your use case. Defining it outside, as you have, is standard when you want to keep your code modular and potentially reuse the component elsewhere. Components defined outside can still use context if they are rendered within a context provider (UserProvider, in your case), which you're doing correctly */

/* User Data Button: When you click the "User Data" button, you're intending to display more detailed information about the selected user. Therefore, you pass the entire user object to the setSelectedUser function. This is because, presumably, you want to have access to all of the user's information (such as name, email, website, etc.) in the component that displays the user details. Passing the whole user object is correct in this context.

Delete Button: The "Delete" button, on the other hand, is used to remove a user from the list, which typically involves making a request to the backend API. For such an operation, you usually only need to provide a unique identifier for the user, which is often the user.id. Hence, when invoking the deleteUser function, you only pass user.id because that's all your backend needs to identify and delete the user record. */

export const App = () => {
  return (
    <UserProvider>
      <div className="App">
        <Heading>User List</Heading>
        <UserForm />
        <UserList /> {/* Now rendering UserList here */}
        <UserDetail />
      </div>
    </UserProvider>
  );
};
