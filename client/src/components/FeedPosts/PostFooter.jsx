import { Box, Button, Flex, IconButton, Input, InputGroup, InputRightElement, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { CommentLogo, NotificationsLogo, UnlikeLogo } from "../../assets/constants";
import { FiBookmark, FiBookmark as FiBookmarkFilled } from "react-icons/fi";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import usePostComment from "../../hooks/usePostComment";
import useAuthStore from "../../store/authStore";
import useLikePost from "../../hooks/useLikePost";
import { timeAgo } from "../../utils/timeAgo";
import CommentsModal from "../Modals/CommentsModal";

const PostFooter = ({ post, isProfilePage, creatorProfile }) => {
  const { isCommenting, handlePostComment } = usePostComment();
  const [comment, setComment] = useState("");
  const authUser = useAuthStore((state) => state.user);
  const commentRef = useRef(null);
  const { handleLikePost, isLiked, likes } = useLikePost(post);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Check if post is already saved
  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (currentUser) {
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const savedPosts = userDoc.data()?.savedPosts || [];
        setIsSaved(savedPosts.includes(post.id));
      }
    };

    fetchSavedStatus();
  }, [post.id, currentUser]);

  const handleToggleSavePost = async () => {
    setIsSaving(true);
    const userDocRef = doc(firestore, "users", currentUser.uid);

    try {
      if (isSaved) {
        await updateDoc(userDocRef, {
          savedPosts: arrayRemove(post.id),
        });
        toast({
          title: "Post Unsaved",
          description: "The post has been removed from your saved posts.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await updateDoc(userDocRef, {
          savedPosts: arrayUnion(post.id),
        });
        toast({
          title: "Post Saved",
          description: "The post has been saved to your profile.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error("Error toggling saved post:", error);
      toast({
        title: "Error",
        description: "Something went wrong while saving the post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitComment = async () => {
    await handlePostComment(post.id, comment);
    setComment("");
  };

  return (
    <Box mb={10} marginTop={"auto"}>
      <Flex alignItems={"center"} justifyContent="space-between" w={"full"} pt={0} mb={2} mt={4}>
        <Flex gap={4} alignItems={"center"}>
          <Box onClick={handleLikePost} cursor={"pointer"} fontSize={18}>
            {!isLiked ? <NotificationsLogo /> : <UnlikeLogo />}
          </Box>

          <Box cursor={"pointer"} fontSize={18} onClick={() => commentRef.current.focus()}>
            <CommentLogo />
          </Box>
        </Flex>

        {/* Save Icon */}
        <IconButton
          icon={isSaved ? <FiBookmarkFilled /> : <FiBookmark />}
          variant="ghost"
          colorScheme={"black"}
          onClick={handleToggleSavePost}
          isLoading={isSaving}
		  boxSize="12"
		  p={3}  
		  fontSize="2xl"
          aria-label="Save post"
        />
      </Flex>

      <Text fontWeight={600} fontSize={"sm"}>
        {likes} likes
      </Text>

      {isProfilePage && (
        <Text fontSize="12" color={"gray"}>
          Posted {timeAgo(post.createdAt)}
        </Text>
      )}

      {!isProfilePage && (
        <>
          <Text fontSize="sm" fontWeight={700}>
            {creatorProfile?.username}{" "}
            <Text as="span" fontWeight={400}>
              {post.caption}
            </Text>
          </Text>
          {post.comments.length > 0 && (
            <Text fontSize="sm" color={"gray"} cursor={"pointer"} onClick={onOpen}>
              View all {post.comments.length} comments
            </Text>
          )}

          {isOpen ? <CommentsModal isOpen={isOpen} onClose={onClose} post={post} /> : null}
        </>
      )}

      {authUser && (
        <Flex alignItems={"center"} gap={2} justifyContent={"space-between"} w={"full"}>
          <InputGroup>
            <Input
              variant={"flushed"}
              placeholder={"Add a comment..."}
              borderBottom={"0.4px solid #000"}
              fontSize={14}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              ref={commentRef}
              _focus={{
                borderColor: "gray.500",
              }}
              _placeholder={{
                color: "gray.500",
              }}
            />
            <InputRightElement>
              <Button
                fontSize={11}
                color={"black.500"}
                border={"1px solid black"}
                
                fontWeight={600}
                mb={"3"}
                cursor={"pointer"}
                _hover={{ bg: "black", color: "white" }}
                bg={"transparent"}
                onClick={handleSubmitComment}
                isLoading={isCommenting}
              >
                Post
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
      )}
    </Box>
  );
};

export default PostFooter;

