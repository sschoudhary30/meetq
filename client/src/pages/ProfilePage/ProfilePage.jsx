import {
	Container,
	Flex,
	Box,
	Text
  } from "@chakra-ui/react";
  import { useState } from "react";
  import ProfileHeader from "../../components/Profile/ProfileHeader";
  import ProfileTabs from "../../components/Profile/ProfileTabs";
  import ProfilePosts from "../../components/Profile/ProfilePosts";
  import SavedPosts from "../../components/Profile/SavedPosts";
  import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";
  import { useParams, Link as RouterLink } from "react-router-dom";
  import Header from "../HomePage/Header";
  
  const ProfilePage = () => {
	const { username } = useParams();
	const { isLoading, userProfile } = useGetUserProfileByUsername(username);
	const [activeTab, setActiveTab] = useState("posts"); 
	
	const userNotFound = !isLoading && !userProfile;
	if (userNotFound) return <UserNotFound />;
	
	return (
	  <Container maxW="container.lg" py={5}>
		<Flex
		  py={10}
		  px={4}
		  pl={{ base: 4, md: 10 }}
		  w="full"
		  mx="auto"
		  flexDirection="column"
		>
		  {!isLoading && userProfile && <ProfileHeader userProfile={userProfile} />}
		</Flex>
  
		<Flex
		  px={{ base: 2, sm: 4 }}
		  maxW="full"
		  mx="auto"
		  borderTop="1px solid"
		  borderColor="whiteAlpha.300"
		  direction="column"
		>
		  <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
		  
		  <Box py={4}>
			{activeTab === "posts" && <ProfilePosts userProfile={userProfile} />}
			{activeTab === "saved" && <SavedPosts />}
		  </Box>
		</Flex>
	  </Container>
	);
  };
  
  export default ProfilePage;
