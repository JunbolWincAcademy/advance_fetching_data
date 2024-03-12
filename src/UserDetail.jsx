import React, { useEffect, useState } from 'react';
import { useUserContext } from './UserContext';
import { Box, Text, Button } from '@chakra-ui/react';

export const UserDetail = () => {
  const { selectedUser, deletePost, userPosts,setUserPosts } = useUserContext();
  const [userDetails, setUserDetails] = useState(null);
  // const [posts, setPosts] = useState([]); //  here was the big 🐞

  useEffect(() => {
    let ignore = false;

    // Fetch user details
    const fetchUserDetails = async () => {
      if (!selectedUser) return;

      try {
        const userDetailsResponse = await fetch(`http://localhost:3000/users/${selectedUser.id}`);
        if (!ignore) {
          const userDetailsData = await userDetailsResponse.json();
          setUserDetails(userDetailsData);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

 
    // Fetch user posts
    const fetchPosts = async () => {
      if (!selectedUser) return;

      try {
        const postsResponse = await fetch(`http://localhost:3000/users/${selectedUser.id}/posts`);

        if (!ignore) {
          const postsData = await postsResponse.json();
          console.log('FIRST LOG Fetched postsData variable:', postsData);
          // setPosts(postsData); //here was the big 🐞
          setUserPosts(postsData);
        }
     
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchUserDetails();
    fetchPosts(); // ✅ Call to fetch posts

    return () => {
      ignore = true;
    };
  }, [selectedUser]); // Depend on selectedUser to refetch when it changes

  if (!selectedUser) return null;

  return (
    <Box border="1px" borderColor="gray.200" p="4" borderRadius="md">
      <Text>Name:{selectedUser.name}</Text>
      <Text>Last Name:{selectedUser.lastname}</Text>
      <Text>Email: {selectedUser.email}</Text>
      <Text>Website: {selectedUser.website}</Text>
      {selectedUser.company && <Text>Company: {selectedUser.company.name}</Text>}
      {/* Display user posts */}
      {userPosts.length > 0 && (//it was posts.length
        <>
          <Text mt="4" mb="2" fontWeight="bold">
            Posts:
          </Text>
          {userPosts.map((post) => (//it was like posts.map(())... here was the big 🐞
            <Box key={post.id} mb="2">
              <Text fontWeight="bold">{post.title}</Text>
              <Text>{post.body}</Text>
              <Button
                fontWeight="bold"
                onClick={() => {
                  deletePost(post.id);
                }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};
