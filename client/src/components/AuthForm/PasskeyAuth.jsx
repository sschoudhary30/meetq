import { useState } from "react";
import { Flex, Image, Text, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { startAuthentication } from "@simplewebauthn/browser";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";

const PasskeyAuth = ({ prefix }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [username, setUsername] = useState("");
    const showToast = useShowToast();
    const [load, setload] = useState(false);
    const loginUser = useAuthStore((state) => state.loginUser);

    const handlePasskeyLogin = async () => {
        setload(true);
        if (!username.trim()) {
            showToast("Error", "Please enter a username.", "error");
            return;
        }
        try {
            // Fetch challenge from server
            const response = await fetch("http://localhost:3000/passkey-challenge/login-challenge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });
            const challengeResult = await response.json();
            const options = challengeResult.options.challengePayload;

            // Start passkey authentication
            const authenticationResponse = await startAuthentication({ optionsJSON: options });

           
            const verifyResponse = await fetch("http://localhost:3000/passkey-challenge/login-challenge-verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, credentials: authenticationResponse }),
            });

            const verifyResult = await verifyResponse.json();
            if (verifyResult.success) {
                showToast("Success", "Passkey authentication successful!", "success");
                // login user
                localStorage.setItem("user-info", JSON.stringify(verifyResult.data));
                loginUser(verifyResult.data);
                onClose(); // Close modal on success
            } else {
                showToast("Error", "Passkey authentication failed.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error", "Passkey authentication failed.", "error");
        } finally {
            setload(false);
        }
    };

    return (
        <>
            {/* Passkey Button */}
            <Flex alignItems="center" justifyContent="center" cursor="pointer" onClick={onOpen}>
                <Image src="/passkey.png" bg="transparent" w={10} alt="Passkey logo" />
                <Text mx="2" color="blue.500">
                    {prefix} with PassKey
                </Text>
            </Flex>

            {/* Modal for Username Input */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg="white">
                    <ModalHeader>Enter Username</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            placeholder="Enter your username"
                            value={username}
                            border="1px solid black"
                            color="black"
                            bg="white"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handlePasskeyLogin} isLoading={load}>
                            Authenticate
                        </Button>
                        <Button variant="ghost" ml={2} border="1.5px black solid" color="black" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PasskeyAuth;