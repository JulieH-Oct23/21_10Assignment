import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const API_BASE = "https://dbb5-75-174-60-205.ngrok-free.app"

function AvailableDogs({ token }) {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAvailableDogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dogs/registered?status=Available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch available dogs");
      setDogs(data.dogs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAvailableDogs();
    }
  }, [token]);

  if (loading) return <Spinner />;

  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={4} bg="#FAEDEC" borderRadius="md" maxW="600px" mx="auto">
      <Heading size="md" mb={4} color="#353325">
        Available Dogs for Adoption
      </Heading>
      {dogs.length === 0 ? (
        <Text>No available dogs at the moment.</Text>
      ) : (
        <ul>
          {dogs.map((dog) => (
            <li key={dog._id}>
              <strong>{dog.name}</strong>: {dog.description}
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
}

export default AvailableDogs;