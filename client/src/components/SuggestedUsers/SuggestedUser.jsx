import { Avatar, Box, Button, Flex, VStack } from "@chakra-ui/react";
import useFollowUser from "../../hooks/useFollowUser";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";
import { useState } from "react";

const SuggestedUser = ({ user }) => {
  const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(user.uid);
  const authUser = useAuthStore((state) => state.user);
  const [localFollowing, setLocalFollowing] = useState(isFollowing); // Update-instantly

  if (!authUser || !authUser.uid) return null;

  const onFollowUser = async () => {
    await handleFollowUser();
    setLocalFollowing(!localFollowing); 
  };

  return (
    <Flex justifyContent="space-between" alignItems="center" w="full">
      <Flex alignItems="center" gap={2}>
        <Link to={`/${user.username}`}>
          <Avatar src={user.profilePicURL} size="md" />
        </Link>
        <VStack spacing={2} alignItems="flex-start">
          <Link to={`/${user.username}`}>
            <Box fontSize={12} fontWeight="bold">
              {user.fullName}
            </Box>
          </Link>
          <Box fontSize={11} mb={3} color="gray.500">
            {user.followers.length} followers
          </Box>
        </VStack>
      </Flex>

      {authUser.uid !== user.uid && (
        <Flex ml="auto">
          <Button
            width={20} 
            h={8} 
            fontWeight="medium"
            bg={localFollowing ? "gray.300" : "blue.400"}
            color="black"
            cursor="pointer"
            _hover={{ bg: "white", border: "1px solid grey" }}
            onClick={onFollowUser}
            isLoading={isUpdating}
          >
            {localFollowing ? "Unfollow" : "Follow"}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default SuggestedUser;

