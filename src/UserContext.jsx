import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// This is the custom HOOK:❗ see the use of the prefix 'use'
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]); // State to hold the posts of the selected user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        setUserList(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers(); 

  const createUser = async (userData) => {
    let newUser; /*while modern JavaScript practices do encourage the use of const and limiting variable scope, this function requires newUser to be accessible in multiple block scopes within the same function, hence the initial let newUser; declaration. This approach ensures that newUser is accessible wherever it's needed within the function, despite the initial value assignment occurring inside a try block.
  }, []);*/
    try {
      const userResponse = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          lastname: userData.lastname,
          email: userData.email,
          website: userData.website,
          company: userData.company,
        }),
      });
      if (!userResponse.ok) throw new Error('Failed to create user');

      newUser = await userResponse.json();
      setUserList((prevUserList) => [...prevUserList, newUser]);

      // If the userData includes posts, create them for the new user
      // Checks if the userData object contains a 'posts' property with an array that has one or more elements. This is important to ensure that we only attempt to create posts for users who actually have post data included. It prevents unnecessary processing and potential errors from trying to handle an undefined or empty posts array.It also check if the post has content.

      if (userData.posts && userData.posts.length > 0) {
        // Next line iterates over each post in the userData.posts array. This is necessary because a user might have multiple posts that need to be individually sent to the server. Each post is then created for the user by making a POST request to the '/posts' endpoint with the user's ID and post content. This ensures that all user-generated posts are properly stored in the database under the correct user.
        for (let post of userData.posts) {
          await createPostForUser(newUser.id, post);
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
    return newUser; // Returning the new user object could be useful
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete user');
      setUserList((currentUsers) => currentUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // ✅ Fetch posts for the selected user
  const fetchPostsForSelectedUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/posts?userId=${userId}`);
      const posts = await response.json();
      setUserPosts(posts); // Update the state with the fetched posts
    } catch (error) {
      console.error('Error fetching posts for user:', error);
    }
  };

  // ✅ Create a post for a user
  const createPostForUser = async (userId, postContent) => {
    try {
      const response = await fetch(`http://localhost:3000/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...postContent }),
      });
      if (!response.ok) throw new Error('Failed to create post');

      // Optionally fetch posts for the user again to update the UI
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // deletePost logic
  const deletePost = async (postId) => {
    //postId is post.id in map()
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');

      // If you're keeping a local state of posts in the context, update it similarly:
      // This assumes you have a posts state similar to userList for users
      setUserPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId)); //this tests each post in the array: if a post's id is not equal to postId (post.id !== postId), the test passes, and that post is included in the new array. If the test fails (meaning the post's id is equal to postId), the post is excluded from the new array.
      // Inside deletePost function, after successfully deleting a post
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {}, [userPosts]);

  return (
    <UserContext.Provider
      value={{
        userList,
        setUserList,
        selectedUser,
        setSelectedUser,
        deleteUser,
        createUser,
        userPosts,
        setUserPosts,
        fetchPostsForSelectedUser,
        createPostForUser,
        deletePost,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
