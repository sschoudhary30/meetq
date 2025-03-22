import { useState, useRef } from 'react';
import { Textarea, Input, Button, Flex, Image, CloseButton, Box, Text } from '@chakra-ui/react';
import { BsFillImageFill } from 'react-icons/bs';
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { useCreatePost } from '../../hooks/useCreatePost';

const AddPost = () => {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); 
  const imageRef = useRef(null);
  const showToast = useShowToast();
  const { isLoading, handleCreatePost } = useCreatePost();

  const handlePostCreation = async () => {
    try {
      await handleCreatePost(selectedFile, caption);
      setCaption('');
      setSelectedFile(null);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const openImagePreview = () => {
    setIsPreviewOpen(true);
  };

  const closeImagePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <Box
      p={4}
      bg="#fff"
      borderRadius="md"
      boxShadow="sm"
      maxW="520px"
      w="full"
    >
      <Textarea
        placeholder="What's on your mind?"
        color={"black"}
        value={caption}
        border={"1px solid black"}
        onChange={(e) => setCaption(e.target.value)}
        mb={3}
      />

      <Input
        type="file"
        hidden
        ref={imageRef}
        onChange={handleImageChange}
      />
     
      <Flex align="center" mt={3} cursor="pointer">
        <BsFillImageFill
          onClick={() => imageRef.current.click()}
          size={20}
          color={'black'}
        />
        <Text ml={2} fontSize="sm" color="gray.600">
          Add Media
        </Text>
      </Flex>

      {selectedFile && (
        <Flex mt={5} w={"full"} position={"relative"} justifyContent={"center"}>
          <Image
            src={URL.createObjectURL(selectedFile)}
            alt="Selected img"
            maxH="200px"
            objectFit="contain"
            onClick={openImagePreview}
            style={{ cursor: 'pointer' }}
          />
          <CloseButton
            position={"absolute"}
            top={2}
            right={2}
            onClick={() => setSelectedFile(null)}
          />
          <Text
            mt={2}
            fontSize="sm"
            color="gray.600"
            style={{ cursor: 'pointer' }}
            onClick={openImagePreview}
          >
            {selectedFile.name}
          </Text>
        </Flex>
      )}

      {isPreviewOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.7)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          onClick={closeImagePreview}
        >
          <Image
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            maxH="80%"
            objectFit="contain"
          />
        </Box>
      )}

      <Button
        mt={4}
        bg={"#4C68D5"}
        onClick={handlePostCreation}
        isLoading={isLoading}
        isDisabled={!caption && !selectedFile}
        left={360}
        w="32"
      >
        Post
      </Button>
    </Box>
  );
};

export default AddPost;
