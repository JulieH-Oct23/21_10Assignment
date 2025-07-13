
import { useState } from "react";
import {
  Box,
  Input,
  Button,
  Heading,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useOutletContext } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

function Home() {
  const { setToken } = useOutletContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  setError("");
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // ✅ Save token to localStorage AND state
    localStorage.setItem("token", data.token);
    setToken(data.token);

    navigate("/dashboard");
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <Box p={6} maxW="400px" mx="auto" mt={20}>
      <Heading mb={6}>Login</Heading>
      <VStack spacing={4}>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          bg="white"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          bg="white"
        />
        <Button
          onClick={handleLogin}
          bg="#92636B"
          color="white"
          _hover={{ bg: "#A18E88" }}
        >
          Login
        </Button>
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </Box>
  );
}

export default Home;
