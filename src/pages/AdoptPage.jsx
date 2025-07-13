import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Textarea,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdoptPage = () => {
  const { dogId } = useParams();
  const [dog, setDog] = useState(null);
  const [message, setMessage] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const { data } = await axios.get(`/api/dogs/${dogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDog(data);
      } catch (error) {
        console.error("Dog fetch error:", error);
        toast({
          title: "Error loading dog",
          description: error?.response?.data?.message || "Something went wrong.",
          status: "error",
          isClosable: true,
        });
      }
    };

    if (!token) {
      toast({
        title: "You must be logged in to adopt.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
      return;
    }

    fetchDog();
  }, [dogId, token, toast, navigate]);

  const handleAdopt = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

      await axios.post(
        `${API_BASE}/dogs/adopt/${dogId}`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Adoption complete!",
        description: `You adopted ${dog?.name}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Adoption error:", error);
      toast({
        title: "Adoption failed",
        description:
          error?.response?.data?.message || error.message || "Something went wrong.",
        status: "error",
        isClosable: true,
      });
    }
  };

  if (!dog) return <Spinner mt={10} />;

  return (
    <Box
      p={6}
      minH="100vh"
      bgImage="url('https://lacaseta.es/wp-content/uploads/2024/05/yorkshire-terrier-raza-600x450.jpg')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Box
        maxW="600px"
        mx="auto"
        mt={10}
        p={6}
        bg="rgba(250, 237, 236, 0.95)" // translucent version of #FAEDEC
        color="#353325"
        borderRadius="xl"
        boxShadow="lg"
      >
        <Heading mb={4}>Adopt {dog.name}</Heading>
        <Text mb={4}>{dog.description}</Text>

        <Textarea
          placeholder="Write a thank-you message to the person who registered this dog..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          mb={4}
          bg="white"
          color="#353325"
        />

        <Button
          onClick={handleAdopt}
          bg="#92636B"
          color="white"
          _hover={{ bg: "#A18E88" }}
        >
          Confirm Adoption
        </Button>
      </Box>
    </Box>
  );
};

export default AdoptPage;