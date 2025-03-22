import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Button,
	Input,
	InputGroup,
	InputRightElement,
	HStack,
	PinInput,
	PinInputField,
	Select,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	useDisclosure,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

const Signup = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		email: "",
		email_otp: "",
		phoneNumber: "91",
		phone_otp: "",
		tagAccount: "",
		password: "",

	});
	const [showPassword, setShowPassword] = useState(false);
	const [emailVerified, setEmailVerified] = useState(false);
	const [phoneVerified, setPhoneVerified] = useState(false);
	const { loading, error, signup } = useSignUpWithEmailAndPassword();
	const [verifyLoad, setVerifyLoad] = useState(false);
	const [errorMsg, setError] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [verificationType, setverificationType] = useState("email")
	const [phoneotpSent, setPhoneOtpSent] = useState(false);
	const [accountType, setAccountType] = useState(""); // Track account type selection

	const showToast = useShowToast();

	// Function to verify account
	const sendAccountOtp = async () => {
		try {
			setVerifyLoad(true);
			setError("");
			const response = await fetch("http://localhost:3000/verify-fan", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ account: inputs.tagAccount }),
			});
			const data = await response.json();
			if (data.success) {
				setOtpSent(true);
				onOpen(); // Open the OTP modal
				setverificationType("email");
				setInputs({ ...inputs, email: data.email });
				toast({
					title: "OTP Sent",
					description: `An OTP has been sent to ${inputs.tagAccount}'s original email account.`,
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			} else {
				setError(data.message || "Failed to send OTP");
			}
		} catch (err) {
			setError("Failed to send OTP");
		} finally {
			setVerifyLoad(false);
		}
	};

	// Function to verify OTP
	const verifyAccountOtp = async () => {
		try {
			const response = await fetch("http://localhost:3000/verify-fan/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: inputs.email, otp: inputs.email_otp }),
			});
			const data = await response.json();
			if (data.success) {
				showToast("Success", "Your email has been verified", "success");
				setEmailVerified(true);
				setError("");
			} else {
				setError(data.message || "Invalid OTP");
			}
		} catch (err) {
			setError("Failed to verify OTP");
		}
		onClose(); // Close the modal
	};

	// Function to send OTP
	const sendOtp = async () => {
		try {
			setVerifyLoad(true);
			setError("");
			const response = await fetch("http://localhost:3000/send-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: inputs.email}),
			});
			const data = await response.json();
			if (data.success) {
				setOtpSent(true);
				onOpen(); // Open the OTP modal
				setverificationType("email")
				toast({
					title: "OTP Sent",
					description: `An OTP has been sent to ${inputs.email}.`,
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			} else {
				setError(data.message || "Failed to send OTP");
			}
		} catch (err) {
			setError("Failed to send OTP");
		} finally {
			setVerifyLoad(false);
		}
	};

	// Function to verify OTP
	const verifyOtp = async () => {
		try {
			const response = await fetch("http://localhost:3000/send-otp/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: inputs.email, otp: inputs.email_otp }),
			});
			const data = await response.json();
			if (data.success) {
				showToast("Success", "Your email has been verified", "success");
				setEmailVerified(true);
				setError("");
			} else {
				setError(data.message || "Invalid OTP");
			}
		} catch (err) {
			setError("Failed to verify OTP");
		}
		onClose(); // Close the modal
	};

	const sendPhoneOtp = async () => {
		setVerifyLoad(true);
		setError("");
		try {
			const response = await fetch("http://localhost:3000/send-phone-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phoneNumber: inputs.phoneNumber }),
			});
			const data = await response.json();
			if (data.success) {
				setPhoneOtpSent(true);
				onOpen(); // Open the OTP modal
				setverificationType("phone");
				toast({
					title: "OTP Sent",
					description: `An OTP has been sent to ${inputs.phoneNumber}.`,
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			} else {
				setError(data.message || "Failed to send OTP to your mobile number");
			}
		} catch (err) {
			setError("Failed to send OTP to your mobile number");
		} finally {
			setVerifyLoad(false);
		}
	};

	const verifyPhoneOtp = async () => {
		try {
			const response = await fetch("http://localhost:3000/send-phone-otp/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phoneNumber: inputs.phoneNumber, otp: inputs.phone_otp }),
			});
			const data = await response.json();
			if (data.success) {
				toast({
					title: "Phone Verified",
					description: "Your phone number has been successfully verified.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
				setError("");
				setPhoneVerified(true)
			} else {
				setError(data.message || "Invalid OTP");
			}
		} catch (err) {
			setError("Failed to verify OTP");
		}
		onClose(); // Close the modal
	};


	return (
		<>
			{/* Account Type Selection */}
			<Select
				placeholder="Select account type"
				size="sm"
				value={accountType}
				border={"1px solid black"}
				onChange={(e) => setAccountType(e.target.value)}
			>
				<option value="Personal">Personal</option>
				<option value="Fanpage">Fanpage</option>
			</Select>

			<VStack spacing={4} w="full" maxW="400px">
				{/* Personal Account Fields */}
				{accountType === "Personal" && (
					<>
						<InputGroup width="100%">
							<Input
								placeholder="Email"
								fontSize={14}
								_placeholder={{ color: "gray" }}
								type="email"
								border={"1px solid black"}
								size="md"
								value={inputs.email}
								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
								isDisabled={emailVerified}
							/>
							<InputRightElement h="full">
								{!emailVerified ? (
									<Button
										variant={"solid"}
										size={"sm"}
										width={"90px"}
										marginLeft={-20}
										marginRight={-5}
										colorScheme={"blue"}
										onClick={() => sendOtp()}
										isLoading={verificationType === "email" ? verifyLoad : false}
										isDisabled={!inputs.email || emailVerified}
									>
										{emailVerified ? "Verified" : otpSent ? "Resend OTP" : "Verify"}
									</Button>
								) : (
									<Button variant={"solid"} size={"sm"}
										width={"90px"}
										marginLeft={-20}
										marginRight={-5}
										colorScheme={"green"} isDisabled>
										Verified
									</Button>
								)}
							</InputRightElement>
						</InputGroup>

						{verificationType === "email" && errorMsg && (
							<Alert status="error" fontSize={13} p={2} borderRadius={4} mt={2}>
								<AlertIcon fontSize={12} />
								{errorMsg}
							</Alert>
						)}

						<InputGroup width="100%">
							<Input
								placeholder="Phone Number"
								fontSize={14}
								_placeholder={{ color: "gray" }}
								border={"1px solid black"}
								type="text"
								size="md"
								value={inputs.phoneNumber}
								onChange={(e) => setInputs({ ...inputs, phoneNumber: e.target.value })}
							/>
							<InputRightElement h="full">
								{!phoneVerified ? (
									<Button
										variant={"solid"}
										size={"sm"}
										
										width={"90px"}
										marginLeft={-20}
										marginRight={-5}
										colorScheme={"blue"}
										onClick={() => sendPhoneOtp()}
										isLoading={verificationType === "phone" ? verifyLoad : false}
										isDisabled={!inputs.phoneNumber || phoneVerified}
									>
										{phoneVerified ? "Verified" : phoneotpSent ? "Resend OTP" : "Verify"}
									</Button>
								) : (
									<Button variant={"solid"} size={"sm"}
										width={"90px"}
										marginLeft={-20}
										marginRight={-5}
										colorScheme={"green"} isDisabled>
										Verified
									</Button>
								)}
							</InputRightElement>
						</InputGroup>

						{verificationType === "phone" && errorMsg && (
							<Alert status="error" fontSize={13} p={2} borderRadius={4} mt={2}>
								<AlertIcon fontSize={12} />
								{errorMsg}
							</Alert>
						)}

						<Input
							placeholder="Full Name"
							fontSize={14}
							_placeholder={{ color: "gray" }}
							border={"1px solid black"}
							type="text"
							size="md"
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
						<Input
							placeholder="Username"
							fontSize={14}
							border={"1px solid black"}
							type="text"
							_placeholder={{ color: "gray" }}
							size="md"
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
						<InputGroup>
							<Input
								placeholder="Password"
								fontSize={14}
								border={"1px solid black"}
								_placeholder={{ color: "gray" }}
								type={showPassword ? "text" : "password"}
								value={inputs.password}
								size="md"
								onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							/>
							<InputRightElement h="full">
								<Button variant={"ghost"} size={"sm"} onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <ViewIcon /> : <ViewOffIcon />}
								</Button>
							</InputRightElement>
						</InputGroup>
					</>
				)}

				{/* Fanpage Account Fields */}
				{accountType === "Fanpage" && (
					<>
						<Input
							placeholder="Username"
							fontSize={14}
							type="text"
							size="sm"
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
						<InputGroup width="100%">
							<Input
								placeholder="Tag Original Account"
								fontSize={14}
								type="text"
								size="md"
								value={inputs.tagAccount}
								onChange={(e) => setInputs({ ...inputs, tagAccount: e.target.value })}
							/>
							<InputRightElement h="full">
								{!emailVerified ? (
									<Button
										variant={"solid"}
										size={"sm"}
										width={"90px"}
										marginLeft={-20}
										marginRight={-5}
										colorScheme={"blue"}
										onClick={() => sendAccountOtp()}
										isDisabled={!inputs.tagAccount}
										isLoading={verifyLoad}
									>
										{emailVerified ? "Verified" : otpSent ? "Resend OTP" : "Verify"}
									</Button>
								) : (
									<Button variant={"solid"} size={"sm"}
										width={"90px"}
										marginLeft={-20}
										marginRight={-5}
										colorScheme={"green"} isDisabled>
										Verified
									</Button>
								)}
							</InputRightElement>
						</InputGroup>

						{verificationType === "email" && errorMsg && (
							<Alert status="error" fontSize={13} p={2} borderRadius={4} mt={2}>
								<AlertIcon fontSize={12} />
								{errorMsg}
							</Alert>
						)}
						<InputGroup>
							<Input
								placeholder="Password"
								fontSize={14}
								type={showPassword ? "text" : "password"}
								value={inputs.password}
								size="sm"
								onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							/>
							<InputRightElement h="full">
								<Button variant={"ghost"} size={"sm"} onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <ViewIcon /> : <ViewOffIcon />}
								</Button>
							</InputRightElement>
						</InputGroup>
					</>
				)}



				{/* Submit Button */}
				<Button
					w={"full"}
					colorScheme="blue"
					size={"sm"}
					fontSize={14}
					onClick={() => signup(inputs)}
					isLoading={loading} // Disable button while loading
					isDisabled={!inputs.username || !inputs.password || (accountType === "Personal" ? (!emailVerified && !phoneVerified) : !emailVerified)}
				>
					Sign Up
				</Button>
				{error && (
					<Alert status="error" fontSize={13} p={2} borderRadius={4} mt={2}>
						<AlertIcon fontSize={12} />
						{error}
					</Alert>
				)}

			</VStack>

			{/* OTP Verification Modal */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{verificationType === "email" ? "Enter Email OTP" : "Enter Phone OTP"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<HStack justify="center">
							<PinInput
								value={verificationType === "email" ? inputs.email_otp : inputs.phone_otp}
								onChange={(value) => {
									if (verificationType === "email") {
										setInputs({ ...inputs, email_otp: value });
									} else {
										setInputs({ ...inputs, phone_otp: value });
									}
								}}
							>
								{[...Array(6)].map((_, index) => (
									<PinInputField key={index} />
								))}
							</PinInput>
						</HStack>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							onClick={accountType === "Fanpage" ? verifyAccountOtp : verificationType === "email" ? verifyOtp : verifyPhoneOtp}
							isDisabled={verificationType === "email" ? !inputs.email_otp : !inputs.phone_otp}
						>
							Verify
						</Button>
						<Button variant="ghost" ml={3} onClick={onClose}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Signup;