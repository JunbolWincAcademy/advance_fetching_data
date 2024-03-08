import { Flex, Heading, Text, UnorderedList, List, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { UserDetail } from './UserDetail';

export const App = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState(null);

  //-----fetchData useEffect hook

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          //making a request
          'http://localhost:3000/users'
        );//The fetch function is using the GET method behind the scenes to request data from the specified URL. 
        const json = await response.json();//converting response into a json file
        console.log(json);
        setUserList(json);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []); // 🚩 Dependency array is correctly empty to run once on mount

  return (
    <div className="App">
      <Heading>User List</Heading>
      <UnorderedList listStyleType="none">
        {userList.map((user) => (
          <Flex key={user.id} mb="1rem">
            <li key={user.id}>
              {user.name}{' '}
              <Button size="xs" onClick={() => setSelectedUser(user)}>
                User Data
              </Button>
            </li>
          </Flex>
        ))}
      </UnorderedList>
      <UserDetail user={selectedUser} />
    </div>
  );
};
