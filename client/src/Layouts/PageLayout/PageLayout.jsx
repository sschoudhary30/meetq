import { Box, Flex, Spinner } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import useAuthStore from "../../store/authStore";


const PageLayout = ({ children }) => {
	const { pathname } = useLocation();
	const {user, isAuthenticated} = useAuthStore();
	const canRenderSidebar = pathname !== "/auth" && user;
	const canRenderNavbar = !user && !isAuthenticated && pathname !== "/auth";

	const checkingUserIsAuth = !user && isAuthenticated;
	if (checkingUserIsAuth) return <PageLayoutSpinner />;

	return (
		<Flex flexDir={canRenderNavbar ? "column" : "row"}>
			
			{canRenderSidebar ? (
				<Box w={{ base: "70px", md: "240px" }}>
					<Sidebar />
				</Box>
			) : null}
			
			{canRenderNavbar ? <Navbar /> : null}
			
			<Box flex={1} w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }} mx={"auto"}>
				{children}
			</Box>
		</Flex>
	);
};

export default PageLayout;

const PageLayoutSpinner = () => {
	return (
		<Flex flexDir='column' h='100vh' alignItems='center' justifyContent='center'>
			<Spinner size='xl' />
		</Flex>
	);
};