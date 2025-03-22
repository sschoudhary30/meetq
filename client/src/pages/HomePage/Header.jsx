import { Box, Link, Flex, Button } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Logo } from "../../assets/constants";
import useLogout from "../../hooks/useLogout";
const Header = () => {
  const { handleLogout, isLoggingOut } = useLogout();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/auth");
  };

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="white"
      boxShadow="md"
      height="50px"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between" 
      px="20px"
    >
    
      <Link as={RouterLink} to="/">
        <Logo />
      </Link>

      <Button
        bg="#4C68D5"
        size="sm"
        onClick={handleLogoutClick}
        isLoading={isLoggingOut}
        _hover={{bg:"#4C68D5",color:"white"}}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Header;
