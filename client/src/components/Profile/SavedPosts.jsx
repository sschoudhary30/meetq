import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import ProfilePost from "./ProfilePost";
import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!currentUser) return;
    
      try {
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const savedPostIds = (userDoc.data()?.savedPosts || []).filter(id => typeof id === "string" && id.trim() !== "");
    
        if (savedPostIds.length === 0) {
          setSavedPosts([]);
          setIsLoading(false);
          return;
        }
    
        const postsPromises = savedPostIds.map(async (postId) => {
          if (!postId) return null; 
          const postRef = doc(firestore, "posts", postId);
          const postDoc = await getDoc(postRef);
          return postDoc.exists() ? { id: postDoc.id, ...postDoc.data() } : null;
        });
    
        const posts = (await Promise.all(postsPromises)).filter(Boolean);
        setSavedPosts(posts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchSavedPosts();
  }, [currentUser]);

  if (isLoading) {
    return (
      <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={1}>
        {[0, 1, 2].map((_, idx) => (
          <VStack key={idx} alignItems={"flex-start"} gap={4}>
            <Skeleton w={"full"}>
              <Box h="300px">Loading content...</Box>
            </Skeleton>
          </VStack>
        ))}
      </Grid>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <Flex flexDir="column" textAlign="center" mx="auto" mt={10}>
        <Text fontSize="2xl">No Saved Posts Yet 📦</Text>
      </Flex>
    );
  }

  return (
    <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={1}>
      {savedPosts.map((post) => (
        <ProfilePost key={post.id} post={post} />
      ))}
    </Grid>
  );
};

export default SavedPosts;
