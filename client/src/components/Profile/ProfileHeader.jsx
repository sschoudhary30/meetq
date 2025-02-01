import { Avatar, AvatarGroup, Button, Flex, Text, VStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";
import { startRegistration } from "@simplewebauthn/browser";

const ProfileHeader = () => {
	const { userProfile } = useUserProfileStore();
	const authUser = useAuthStore((state) => state.user);
	const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
	const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(userProfile?.uid);
	const [loading, setLoading] = useState(false);

	const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
	const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;

	const handleRegisterPasskey = async () => {
		setLoading(true);

		// Add passkey registration logic here
		try {
			// Fetch challenge from server
			const response = await fetch("http://localhost:3000/passkey-challenge", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username : authUser.username }),
			});
			const challengeResult = await response.json();
			const options = challengeResult.options.challengePayload; // Server-side challenge

			// Start passkey registration
			const registrationResponse = await startRegistration({ optionsJSON: options });

			// Verify registration response
			await fetch("http://localhost:3000/passkey-challenge/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: authUser.username, credentials: registrationResponse, accountType: userProfile.accountType }),
			});

			alert("Passkey registration successful!");
		} catch (error) {
			console.error(error);
			alert("Passkey registration failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
			<AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
				<Avatar src={userProfile.profilePicURL} alt='As a programmer logo' />
			</AvatarGroup>

			<VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
				<Flex gap={4} direction={{ base: "column", sm: "row" }} justifyContent={{ base: "center", sm: "flex-start" }} alignItems={"center"} w={"full"}>
					<Text fontSize={{ base: "sm", md: "lg" }}>{userProfile.username}</Text>
					{visitingOwnProfileAndAuth && (
						<Flex gap={4} alignItems={"center"} justifyContent={"center"}>
							<Button bg={"white"} color={"black"} _hover={{ bg: "whiteAlpha.800" }} size={{ base: "xs", md: "sm" }} onClick={onEditOpen}>
								Edit Profile
							</Button>
							<Button bg={"white"} color={"black"} _hover={{ bg: "whiteAlpha.800" }} size={{ base: "xs", md: "sm" }} onClick={() => handleRegisterPasskey()} isLoading={loading}>
								Generate Passkey
							</Button>
						</Flex>
					)}
					{visitingAnotherProfileAndAuth && (
						<Flex gap={4} alignItems={"center"} justifyContent={"center"}>
							<Button bg={"blue.500"} color={"white"} _hover={{ bg: "blue.600" }} size={{ base: "xs", md: "sm" }} onClick={handleFollowUser} isLoading={isUpdating}>
								{isFollowing ? "Unfollow" : "Follow"}
							</Button>
						</Flex>
					)}
				</Flex>

				<Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
					<Text fontSize={{ base: "xs", md: "sm" }}>
						<Text as='span' fontWeight={"bold"} mr={1}>{userProfile.posts.length}</Text>
						Posts
					</Text>
					<Text fontSize={{ base: "xs", md: "sm" }}>
						<Text as='span' fontWeight={"bold"} mr={1}>{userProfile.followers.length}</Text>
						Followers
					</Text>
					<Text fontSize={{ base: "xs", md: "sm" }}>
						<Text as='span' fontWeight={"bold"} mr={1}>{userProfile.following.length}</Text>
						Following
					</Text>
				</Flex>
				<Flex alignItems={"center"} gap={4}>
					<Text fontSize={"sm"} fontWeight={"bold"}>{userProfile.fullName}</Text>
				</Flex>
				<Text fontSize={"sm"}>{userProfile.bio}</Text>
			</VStack>
			{isEditOpen && <EditProfile isOpen={isEditOpen} onClose={onEditClose} />}
		</Flex>
	);
};

export default ProfileHeader;
