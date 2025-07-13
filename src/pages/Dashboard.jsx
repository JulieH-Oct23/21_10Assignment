import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

// 🔐 Token decoder
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

function Dashboard() {
  // const { token, logout } = useOutletContext();
  const token = localStorage.getItem("token");
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // or use navigate("/")
  };
  const navigate = useNavigate();
  const toast = useToast();

  const decoded = decodeToken(token);
  const username = decoded?.username || "User";
  const userId = decoded?.id || decoded?._id || null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dogs, setDogs] = useState([]);
  const [adoptedDogs, setAdoptedDogs] = useState([]);
  const [availableDogs, setAvailableDogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adoptedPage, setAdoptedPage] = useState(1);
  const [adoptedTotalPages, setAdoptedTotalPages] = useState(1);
  const [error, setError] = useState("");
  const limit = 5;

  const lightBg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const textColor = useColorModeValue("brand.light.text", "brand.dark.text");
  const sectionStyles = ["#FAEDEC", "#A18E88", "#92636B", "#4a473f"];

  // Fetch user-registered dogs
  const fetchMyDogs = async () => {
    setError("");
    try {
      const query = new URLSearchParams();
      if (statusFilter) query.append("status", statusFilter);
      query.append("page", page);
      query.append("limit", limit);

      const res = await fetch(`${API_BASE}/dogs/registered?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch your dogs");

      setDogs(data.dogs || []);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      setError(err.message);
    }
  };


  const fetchAdoptedDogs = async () => {
  setError("");
  try {
    const res = await fetch(`${API_BASE}/dogs/adopted`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch adopted dogs");

    setAdoptedDogs(data.dogs || []);
    setAdoptedTotalPages(1); // only 1 page since no pagination data returned
  } catch (err) {
    setError(err.message);
  }
};

  // Fetch available dogs
  const fetchAvailableDogs = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dogs/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch available dogs");
      setAvailableDogs(data.dogs || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Register a new dog
  const registerDog = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dogs/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, registrationStatus: "Available" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register dog");

      toast({
        title: "Dog registered!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setName("");
      setDescription("");
      fetchMyDogs();
      fetchAvailableDogs();
    } catch (error) {
      setError(error.message);
    }
  };

  // Remove a dog registered by user
  const removeDog = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dogs/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove dog");

      toast({
        title: "Dog removed",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      fetchMyDogs();
      fetchAvailableDogs();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyDogs();
      fetchAdoptedDogs();
      fetchAvailableDogs();
    }
  }, [token, page, adoptedPage, statusFilter]);

  return (
    <Box p={6} minH="100vh" bg={lightBg} color={textColor}>
      <Heading textAlign="center" mb={6}>
        Dog Adoption Dashboard
      </Heading>

      {error && (
        <Box bg="red.200" color="red.700" p={4} mb={6} borderRadius="md">
          {error}
        </Box>
      )}

      <VStack spacing={8}>
        {/* Register a Dog Section */}
        <Box
    w="100%"
    p={4}
    borderRadius="xl"
    bg="#4a473f"
    color="#ffffff"
    textAlign="center"
    fontWeight="bold"
  >
    Logged in as: {username}
  </Box>
        <Box w="100%" p={6} borderRadius="xl" bg={sectionStyles[0]}>
          <Heading size="md" mb={4}>
            Register a Dog
          </Heading>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb={3}
            bg="white"
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            mb={3}
            bg="white"
          />
          <Button
            onClick={registerDog}
            bg="#92636B"
            color="white"
            _hover={{ bg: "#A18E88" }}
          >
            Submit
          </Button>
        </Box>

        {/* My Registered Dogs Section */}
        <Box w="100%" p={6} borderRadius="xl" bg={sectionStyles[1]}>
          <Heading size="md" mb={4}>
            Dogs I Registered
          </Heading>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            mb={4}
            bg="white"
          >
            <option value="">All</option>
            <option value="Available">Available</option>
            <option value="Adopted">Adopted</option>
          </Select>
          {dogs && dogs.length === 0 && (
            <Text>No dogs registered yet.</Text>
          )}
{dogs && dogs.length > 0 ? (
  dogs
    .filter((dog) => dog.registeredBy === userId)
    .map((dog) => (
      <Box key={dog._id} mb={2}>
        <strong>{dog.name}</strong>: {dog.description}
        {!dog.adoptedBy && (
          <Button
            size="sm"
            onClick={() => removeDog(dog._id)}
            ml={2}
            colorScheme="red"
          >
            Remove
          </Button>
        )}
      </Box>
    ))
) : (
  <Text>No dogs registered yet.</Text>
)}

          {/* Pagination */}
          <Box
            mt={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              isDisabled={page === 1}
            >
              Previous
            </Button>
            <Text>
              Page {page} of {totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              isDisabled={page === totalPages}
            >
              Next
            </Button>
          </Box>
        </Box>

{/* My Dog Family Section */}
<Box w="100%" p={6} borderRadius="xl" bg={sectionStyles[2]}>
  <Heading size="md" mb={4} color="white">
    My Dog Family
  </Heading>

  {Array.isArray(adoptedDogs) && adoptedDogs.filter(dog => dog.adoptedBy === userId).length === 0 ? (
    <Text color="white">You haven't adopted any dogs yet.</Text>
  ) : (
    Array.isArray(adoptedDogs) &&
    adoptedDogs
      .filter((dog) => dog.adoptedBy === userId)
      .map((dog) => (
        <Text key={dog._id} color="white" mb={2}>
          <strong>{dog.name}</strong>: {dog.description}
        </Text>
      ))
  )}

  {/* Pagination */}
  <Box
    mt={4}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
  >
    <Button
      size="sm"
      onClick={() => setAdoptedPage((p) => Math.max(p - 1, 1))}
      isDisabled={adoptedPage === 1}
    >
      Previous
    </Button>
    <Text color="white">
      Page {adoptedPage} of {adoptedTotalPages}
    </Text>
    <Button
      size="sm"
      onClick={() =>
        setAdoptedPage((p) => Math.min(p + 1, adoptedTotalPages))
      }
      isDisabled={adoptedPage === adoptedTotalPages}
    >
      Next
    </Button>
  </Box>
</Box>

{/* Available Dogs */}
<Box w="100%" p={6} borderRadius="xl" bg={sectionStyles[3]}>
  <Heading size="md" mb={4} color="white">
    Dogs Available for Adoption
  </Heading>

  {availableDogs && availableDogs.length > 0 ? (
    availableDogs
      .filter((dog) => dog.registeredBy !== userId && !dog.adoptedBy)
      .map((dog) => (
        <Box key={dog._id} mb={2} color="white">
          <strong>{dog.name}</strong>: {dog.description}
          <Button
            size="sm"
            onClick={() => navigate(`/adopt/${dog._id}`)}
            ml={2}
            bg="#FAEDEC"
            color="#353325"
            _hover={{ bg: "#A18E88" }}
          >
            Adopt
          </Button>
        </Box>
      ))
  ) : (
    <Text color="white">No dogs currently available.</Text>
  )}
</Box>

        <Button
          mt={10}
          onClick={logout}
          bg="#92636B"
          color="white"
          _hover={{ bg: "#A18E88" }}
        >
          Log Out
        </Button>
      </VStack>
    </Box>
  );
}

export default Dashboard;