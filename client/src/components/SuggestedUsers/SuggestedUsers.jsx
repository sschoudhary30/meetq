import { useState } from "react";
import { Box, Flex, Link, Text, VStack, Button } from "@chakra-ui/react";
import SuggestedHeader from "./SuggestedHeader";
import SuggestedUser from "./SuggestedUser";
import useGetSuggestedUsers from "../../hooks/useGetSuggestedUsers";

const SuggestedUsers = () => {
  const { isLoading, suggestedUsers } = useGetSuggestedUsers();
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 4;
  const ADDITIONAL_COUNT = 3;

  const visibleUsers = showAll ? suggestedUsers : suggestedUsers.slice(0, INITIAL_COUNT);

  return (
    <VStack py={8} px={6} gap={4}>
      <SuggestedHeader />

      <Box w="full" bg="#FFFFFF" borderRadius="lg" boxShadow="md" overflow="hidden" p={6}>
        {suggestedUsers.length > 0 ? (
          <>
            <Flex alignItems="center" justifyContent="space-between" w="full">
              <Text fontSize={14} fontWeight="bold" mb={2} color="gray.500">
                Suggested for you
              </Text>
              <Button
                size="sm"
                variant="link"
				mb={2}
                color="blue.500"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "See All"}
              </Button>
            </Flex>

            {visibleUsers.map((user) => (
              <SuggestedUser user={user} key={user.uid} />
            ))}
          </>
        ) : (
          <Text fontSize={14} color="gray.500">No users available</Text>
        )}
      </Box>

      <Box fontSize={12} color="gray.500" mt={5} alignSelf="start">
        © 2025 Built By{" "}
        <Link href="" target="_blank" color="blue.500" fontSize={14}>
          MeetQ
        </Link>
      </Box>
    </VStack>
  );
};

export default SuggestedUsers;

