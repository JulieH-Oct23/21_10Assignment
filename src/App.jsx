import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const API_BASE = "https://ca30-75-174-60-205.ngrok-free.app/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

const register = async () => {
  setError("");
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Registration failed: ${errorText}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Registration failed: Server did not return JSON");
    }

    const data = await res.json();
    alert(data.message);
    setUsername("");
    setPassword("");
  } catch (err) {
    setError(err.message || "Unexpected error during registration");
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

    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Login failed: ${errorText}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Login failed: Server did not return JSON");
    }

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUsername("");
      setPassword("");
      navigate("/dashboard");
    } else {
      throw new Error("Login failed: No token received");
    }
  } catch (err) {
    setError(err.message || "Unexpected error during login");
  }
};


  const isHomePage = location.pathname === "/";

  return (
    <Box p={6} bg="brand.dark.bg" color="brand.dark.text" minH="100vh" pb="80px">
      {isHomePage && !token && (
        <>
          <Box maxW="400px" mx="auto" mb={6} textAlign="center">
            <Heading as="h1" size="2xl" mb={2} color="brand.dark.accent">
              Dog Adoption Platform
            </Heading>
            <Heading as="h2" size="md" mb={6} color="brand.dark.secondary" fontWeight="medium">
              Find your new furry best friend today!
            </Heading>
          </Box>

          <Box
            maxW="400px"
            mx="auto"
            p={6}
            mb={8}
            borderRadius="md"
            boxShadow="md"
            bg="brand.light.bg"
          >
            <Text
              fontSize="lg"
              fontWeight="semibold"
              mb={4}
              textAlign="center"
              color="brand.dark.text"
            >
              Register or Log In
            </Text>

            <VStack spacing={4}>
              <FormControl id="username" isRequired>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  bg="white"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="white"
                />
              </FormControl>

              <Button
                bg="brand.dark.accent"
                color="white"
                width="full"
                onClick={register}
                _hover={{ bg: "brand.dark.secondary" }}
              >
                Register
              </Button>
              <Button
                bg="brand.dark.secondary"
                color="white"
                width="full"
                onClick={login}
                _hover={{ bg: "brand.dark.accent" }}
              >
                Login
              </Button>

              {error && (
                <Text color="red.500" fontWeight="semibold" mt={2} textAlign="center">
                  {error}
                </Text>
              )}
            </VStack>
          </Box>
        </>
      )}

      <Outlet context={{ token, setToken, logout }} />
    </Box>
  );
}

export default App;