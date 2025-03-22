import { Alert, AlertIcon, Button, Input, Select, HStack, PinInput, PinInputField, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";
import useShowToast from "../../hooks/useShowToast";


const Login = () => {
  const [accountType, setAccountType] = useState("personal");
  const [verifyLoad, setVerifyLoad] = useState(false);
  const [verifyError, setError] = useState("");
  const [next, setNext] = useState(false);
  const showToast = useShowToast();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    username: "",
    otp: "",
  });
  const { loading, error, login } = useLogin();

  const handleOrigLogin = async() => {
	try {
		setVerifyLoad(true);
		let data;
		if(accountType === "personal"){
			const response = await fetch("http://localhost:3000/send-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: inputs.email, purpose: "login" }),
			});
			data = await response.json();
		}else{
			const response = await fetch("http://localhost:3000/verify-fan", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ account: inputs.username, purpose: "login" }),
			});
			data = await response.json();
			setInputs({ ...inputs, email: data.email });
		}
		
		if (data.success) {
			showToast("Success", `An OTP has been sent to original account!!`, "success");
			setNext(true);
		} else {
			showToast("Error", `${data.message || "Failed to send OTP"}`, "error");
		}
	} catch (err) {
		showToast("Error", `${"Failed to send OTP"}`, "error");
	} finally {
		setVerifyLoad(false);
	}
  };

  const verifyOrigLogin = async() => {
	try {
		let data;
		if(accountType === "personal"){
			const response = await fetch("http://localhost:3000/send-otp/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: inputs.email, otp: inputs.otp }),
			});
			data = await response.json();
		}else{
			const response = await fetch("http://localhost:3000/verify-fan/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: inputs.email, otp: inputs.otp }),
			});
			data = await response.json();
		}
		
		if (data.success) {
			showToast("Success", "Your email has been verified", "success");
			login({ ...inputs, accountType });
		} else {
			showToast("Error", `${data.message || "Invalid OTP"}`, "error");
		}
	} catch (err) {
		showToast("Error", `${"Invalid OTP"}`, "error");
	}
  };

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <VStack spacing={4} w="full">
      {!next ? (
        <>
          <Select
            placeholder="Select account type"
            fontSize={14}
            border={"1px solid black"}
            _placeholder={{ color: "gray" }}
            size="sm"
            value={accountType}
            onChange={(e) => {
              setAccountType(e.target.value);
              setInputs({ email: "", password: "", username: "", otp: "" }); // Reset inputs
            }}
          >
            <option value="personal">Personal Account</option>
            <option value="fan">Fan Account</option>
          </Select>

          {accountType === "personal" ? (
            <Input
              placeholder="Email"
              border={"1px solid black"}
              fontSize={14}
              type="email"
              _placeholder={{ color: "gray" }}
              size="sm"
              value={inputs.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          ) : (
            <Input
              placeholder="Username"
              fontSize={14}
              border={"1px solid black"}
              type="text"
              _placeholder={{ color: "gray" }}
              size="sm"
              value={inputs.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          )}

          <Input
            placeholder="Password"
            fontSize={14}
            border={"1px solid black"}
            type="password"
            _placeholder={{ color: "gray" }}
            size="sm"
            value={inputs.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />

          <Button
            w="full"
            colorScheme="blue"
            size="sm"
           
            fontSize={14}
            isLoading={verifyLoad}
            onClick={() => handleOrigLogin()} // Move to OTP step
          >
            Next
          </Button>
        </>
      ) : (
        <>
		  <Text fontSize="30px" fontWeight="bold" mb={-5}>Verify It's You</Text>
		  <Text color="grey">Enter OTP sent to your registered email</Text>
          <HStack>
            <PinInput otp size="lg" onChange={(value) => handleInputChange("otp", value)}>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>

          <HStack w="full" justify="space-between">
            <Button colorScheme="gray" size="sm" w="full" onClick={() => setNext(false)}>
              Back
            </Button>
            <Button colorScheme="blue" size="sm" w="full" isLoading={loading} onClick={() => verifyOrigLogin()}>
              Login
            </Button>
          </HStack>
		  
          {error && !loading && (
  <Alert status="error" fontSize={13} p={2} borderRadius={4}>
    <AlertIcon fontSize={12} />
    {error.message}
  </Alert>
)}


        </>
      )}
    </VStack>
  );
};

export default Login;