import { Avatar, Box, Flex, Image, Text, Badge } from "@chakra-ui/react";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";
import { useState } from "react";
import { firestore } from "../../firebase/firebase";
import { getDoc, doc } from "firebase/firestore";

// Default 
const DEFAULT_BANNER_URL = "https://via.placeholder.com/300x80?text=Profile+Banner";

const SuggestedHeader = () => {
  const authUser = useAuthStore((state) => state.user);
  const [orgAccount, setorgAccount] = useState("");

  const fetchOrgAccount = async() => {
    const userref = doc(firestore, "users", authUser.tagAccount);
    const docSnap = await getDoc(userref);
    console.log(docSnap.data().username)
    setorgAccount(docSnap.data().username);
  }
  if (!authUser) return null;

  const isFanAccount = authUser.accountType === "FanPage" ? true : false;
  if(isFanAccount){
    fetchOrgAccount();
  }
  return (
    <Box w="full" borderRadius="md" overflow="hidden" bg="white" mt={-12}>
     
      <Box w="100%" h="80px">
        <Image
          src={authUser.bannerURL || "https://i2.wp.com/rerouting.ca/wp-content/uploads/2021/03/Simple-Technology-LinkedIn-Banner-1.png?resize=1536%2C384&ssl=1"}
          alt="Profile Banner"
          w="100%"
          h="100%"
          objectFit="cover"
        />
      </Box>

      <Flex justifyContent="space-between" alignItems="center" w="full" p={3}>
        <Flex alignItems="center" gap={3}>
          <Link to={`/${authUser.username}`}>
            <Avatar size="lg" src={authUser.profilePicURL} mt={-57} ml={-2} />
          </Link>
          <Flex direction="column" justifyContent="center">
            <Link to={`/${authUser.username}`}>
              <Text fontSize={16} fontWeight="bold" mt={-3} ml={-2}>
                {authUser.username}
              </Text>
            </Link>
            {authUser.bio && (
              <Text fontSize={14} color="gray.500">
                {authUser.bio}
              </Text>
            )}

         
            {isFanAccount ? (
              <Flex direction="column">
                <Badge colorScheme="purple" mt={2} ml={-14} fontSize="1em">
                  Fan Account
                </Badge>
                <Text fontSize="0.9em" ml={-12} color="purple.600">
                 @ {orgAccount}
                </Text>
              </Flex>
            ) : (
              <Badge colorScheme="blue" mt={2} ml={-4} fontSize="0.75em">
                Personal Account
              </Badge>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SuggestedHeader;
