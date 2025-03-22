import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Stack,
  Radio,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { timeAgo } from "../../utils/timeAgo";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";

const PostHeader = ({ post, creatorProfile, onSaveClick, onDeleteClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReason, setSelectedReason] = useState("Inappropriate content");
  const [adminEmails, setAdminEmails] = useState([]);
  const toast = useToast();
  const { user, isAuthenticated } = useAuthStore();


  useEffect(() => {
    const fetchAdminEmails = async () => {
      try {
        const adminSnapshot = await getDocs(collection(firestore, "admins"));
        const adminList = adminSnapshot.docs.map(doc => doc.data().uid);
        setAdminEmails(adminList); 
      } catch (error) {
        console.error("Error fetching admin emails:", error);
      }
    };

    fetchAdminEmails();
  }, []);

  const isAdmin = user && adminEmails.includes(user.uid);

  const handleReportSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Not Logged In",
        description: "You must be logged in to report a post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await addDoc(collection(firestore, "reports"), {
        postId: post.id,
        reason: selectedReason,
        reportedBy: user.uid,
        timestamp: serverTimestamp(),
      });
      toast({
        title: "Report Submitted",
        description: "Thank you for reporting. We will review this post shortly.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  };

  return (
    <Flex justifyContent="space-between" alignItems="center" w="full" my={2}>
      <Flex alignItems="center" gap={2}>
        {creatorProfile ? (
          <Link to={`/${creatorProfile.username}`}>
            <Avatar src={creatorProfile.profilePicURL} alt="user profile pic" size="sm" />
          </Link>
        ) : (
          <SkeletonCircle size="10" />
        )}

        <Flex fontSize={12} fontWeight="bold" gap="2">
          {creatorProfile ? (
            <Link to={`/${creatorProfile.username}`}>{creatorProfile.username}</Link>
          ) : (
            <Skeleton w="100px" h="10px" />
          )}
          <Box color="gray.500">• {timeAgo(post.createdAt)}</Box>
        </Flex>
      </Flex>

      <Menu>
        <MenuButton as={IconButton} color="black" border="1px solid black" icon={<FiMoreVertical />} variant="ghost" size="sm" />
        <MenuList>
          <MenuItem onClick={onSaveClick}>Save</MenuItem>
          <MenuItem onClick={onOpen}>Report</MenuItem>
          {isAdmin && <MenuItem onClick={onDeleteClick} color="red">Delete</MenuItem>}
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="white">
          <ModalHeader>Report Post</ModalHeader>
          <ModalBody bg="white">
            <RadioGroup onChange={setSelectedReason} value={selectedReason}>
              <Stack direction="column" bg={"white"}>
                <Radio value="Inappropriate content">Inappropriate content</Radio>
                <Radio value="Spam">Spam</Radio>
                <Radio value="Harassment">Harassment</Radio>
                <Radio value="False Information">False Information</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={handleReportSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default PostHeader;
