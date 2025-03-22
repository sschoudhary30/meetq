import { Box, Flex, Text } from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3, BsSuitHeart } from "react-icons/bs";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <Flex
      w={"full"}
      justifyContent={"center"}
      gap={{ base: 4, sm: 10 }}
      
      textTransform={"uppercase"}
      fontWeight={"bold"}
    >
      <Flex
        borderTop={activeTab === "posts" ? "2px solid black" : "none"}
        alignItems={"center"}
        p="3"
       
        gap={1}
        cursor={"pointer"}
        onClick={() => setActiveTab("posts")}
      >
        <Box fontSize={20}>
          <BsGrid3X3 />
        </Box>
        <Text fontSize={12} display={{ base: "none", sm: "block" }}>
          Posts
        </Text>
      </Flex>

      <Flex
        borderTop={activeTab === "saved" ? "2px solid black" : "none"}
        alignItems={"center"}
        p="3"
        gap={1}
        cursor={"pointer"}
        onClick={() => setActiveTab("saved")}
      >
        <Box fontSize={20}>
          <BsBookmark />
        </Box>
        <Text fontSize={12} display={{ base: "none", sm: "block" }}>
          Saved
        </Text>
      </Flex>

      <Flex
        borderTop={activeTab === "likes" ? "2px solid black" : "none"}
        alignItems={"center"}
        p="3"
        gap={1}
        cursor={"pointer"}
        onClick={() => setActiveTab("likes")}
      >
        <Box fontSize={20}>
          <BsSuitHeart />
        </Box>
        <Text fontSize={12} display={{ base: "none", sm: "block" }}>
          Likes
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProfileTabs;
















/*import { Box, Flex, Text } from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3, BsSuitHeart } from "react-icons/bs";

const ProfileTabs = () => {
	return (
		<Flex
			w={"full"}
			justifyContent={"center"}
			gap={{ base: 4, sm: 10 }}
			textTransform={"uppercase"}
			fontWeight={"bold"}
		>
			<Flex borderTop={"1px solid white"} alignItems={"center"} p='3' gap={1} cursor={"pointer"}>
				<Box fontSize={20}>
					<BsGrid3X3 />
				</Box>
				<Text fontSize={12} display={{ base: "none", sm: "block" }}>
					Posts
				</Text>
			</Flex>

			<Flex alignItems={"center"} p='3' gap={1} cursor={"pointer"}>
				<Box fontSize={20}>
					<BsBookmark />
				</Box>
				<Text fontSize={12} display={{ base: "none", sm: "block" }}>
					Saved
				</Text>
			</Flex>

			<Flex alignItems={"center"} p='3' gap={1} cursor={"pointer"}>
				<Box fontSize={20}>
					<BsSuitHeart fontWeight={"bold"} />
				</Box>
				<Text fontSize={12} display={{ base: "none", sm: "block" }}>
					Likes
				</Text>
			</Flex>
		</Flex>
	);
};

export default ProfileTabs;
*/