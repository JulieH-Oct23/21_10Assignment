import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

function Home() {
  const { token, setToken } = useOutletContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Colors from your theme (adjust if needed)
  const lightBg = useColorModeValue("#FAEDEC", "#353325");
  const cardBg = useColorModeValue("#FAEDEC", "#4a473f");
  const textColor = useColorModeValue("#353325", "#FAEDEC");

  const register = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      alert(data.message);
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  const login = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUsername("");
        setPassword("");
        navigate("/dashboard");
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (token) {
    return null; // Hide form if logged in
  }

  return (
    <Box bg={lightBg} color={textColor} minH="100vh" p={6}>
      <Box
        maxW="400px"
        mx="auto"
        p={6}
        borderRadius="xl"
        boxShadow="md"
        bg={cardBg}
      >
        <Text fontSize="2xl" fontWeight="semibold" mb={6} textAlign="center" color={textColor}></Text>

        <VStack spacing={5}>
          <FormControl isRequired>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              bg="white"
              color="black"
              _placeholder={{ color: "gray.500" }}
            />
          </FormControl>

          <FormControl isRequired>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="white"
              color="black"
              _placeholder={{ color: "gray.500" }}
            />
          </FormControl>

          <Button
            bg="#92636B"
            color="white"
            width="full"
            onClick={register}
            _hover={{ bg: "#A18E88" }}
          >
            Register
          </Button>
          <Button
            bg="#A18E88"
            color="white"
            width="full"
            onClick={login}
            _hover={{ bg: "#92636B" }}
          >
            Login
          </Button>

          {error && (
            <Text color="red.500" fontWeight="semibold" mt={3} textAlign="center">
              {error}
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
}

export default Home;