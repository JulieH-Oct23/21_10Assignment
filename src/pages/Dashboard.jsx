import {
    Box,
    Button,
    Heading,
    Input,
    Select,
    Text,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const API_BASE = "https://dbb5-75-174-60-205.ngrok-free.app/api";

function Dashboard() {
  const { token, logout } = useOutletContext();

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

  // Chakra theme values
  const lightBg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const textColor = useColorModeValue("brand.light.text", "brand.dark.text");

  const sectionStyles = [
    "#FAEDEC", // Register
    "#A18E88", // My Dogs
    "#92636B", // Adopted
    "#4a473f", // Available
  ];

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
      if (!res.ok) throw new Error(data.message);
      setDogs(data.dogs || []);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAdoptedDogs = async () => {
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/dogs/adopted?page=${adoptedPage}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAdoptedDogs(data.dogs || []);
      setAdoptedTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAvailableDogs = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dogs/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAvailableDogs(data.dogs || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const registerDog = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dogs/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Dog registered!");
      setName("");
      setDescription("");
      fetchMyDogs();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeDog = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dogs/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchMyDogs();
    } catch (err) {
      setError(err.message);
    }
  };

  const adoptDog = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dogs/adopt/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ thankYou: "Thank you!" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchMyDogs();
      fetchAdoptedDogs();
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
        {/* Register */}
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

        {/* My Dogs */}
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
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
          </Select>
          {dogs.map((dog) => (
            <Box key={dog._id} mb={2}>
              <strong>{dog.name}</strong>: {dog.description}{" "}
              {!dog.adoptedBy && (
                <>
                  <Button
                    size="sm"
                    onClick={() => adoptDog(dog._id)}
                    ml={2}
                    bg="#353325"
                    color="white"
                  >
                    Adopt
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => removeDog(dog._id)}
                    ml={2}
                    colorScheme="red"
                  >
                    Remove
                  </Button>
                </>
              )}
            </Box>
          ))}

          {/* Pagination for My Dogs */}
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

        {/* Adopted Dogs */}
        <Box w="100%" p={6} borderRadius="xl" bg={sectionStyles[2]}>
          <Heading size="md" mb={4} color="white">
            My Dog Family
          </Heading>
          {adoptedDogs.length === 0 ? (
            <Text color="white">You haven't adopted any dogs yet.</Text>
          ) : (
            adoptedDogs.map((dog) => (
              <Text key={dog._id} color="white" mb={2}>
                <strong>{dog.name}</strong>: {dog.description}
              </Text>
            ))
          )}

          {/* Pagination for Adopted Dogs */}
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
          {availableDogs.length === 0 ? (
            <Text color="white">No dogs currently available.</Text>
          ) : (
            availableDogs.map((dog) => (
              <Box key={dog._id} mb={2} color="white">
                <strong>{dog.name}</strong>: {dog.description}
                <Button
                  size="sm"
                  onClick={() => adoptDog(dog._id)}
                  ml={2}
                  bg="#FAEDEC"
                  color="#353325"
                  _hover={{ bg: "#A18E88" }}
                >
                  Adopt
                </Button>
              </Box>
            ))
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