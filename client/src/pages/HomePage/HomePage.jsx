import { Box, Container, Flex } from "@chakra-ui/react";
import FeedPosts from "../../components/FeedPosts/FeedPosts";
import SuggestedUsers from "../../components/SuggestedUsers/SuggestedUsers";
import AddPost from "./AddPost";
import Header from "./Header";

const HomePage = () => {
  return (
    <Box>
      <Header />
      <Container maxW={"container.lg"} pt="100px">
        <AddPost />
        <Flex gap={20} mt={8}>
          <Box flex={2} py={10}>
            <FeedPosts />
          </Box>
          <Box
            flex={3}
            mr={20}
            display={{ base: "none", lg: "block" }}
            maxW={"300px"}
            mt={-215}
          >
            <SuggestedUsers />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HomePage;
