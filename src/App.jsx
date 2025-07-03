// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Heading,
//   Input,
//   Select,
//   Text,
//   VStack,
//   HStack
// } from "@chakra-ui/react";
// import { jwtDecode } from "jwt-decode";
// import { useEffect, useState } from "react";
// import "./App.css";

// const API_BASE = "http://localhost:4000/api";

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [loggedInUser, setLoggedInUser] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [dogs, setDogs] = useState([]);
//   const [adoptedDogs, setAdoptedDogs] = useState([]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [adoptedPage, setAdoptedPage] = useState(1);
//   const [adoptedTotalPages, setAdoptedTotalPages] = useState(1);
//   const [loadingDogs, setLoadingDogs] = useState(false);
//   const [loadingAdopted, setLoadingAdopted] = useState(false);
//   const [error, setError] = useState("");

//   const limit = 5;

//   // Decode token to get logged in username
//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setLoggedInUser(decoded.username || decoded.id || "");
//       } catch {
//         setLoggedInUser("");
//       }
//     } else {
//       setLoggedInUser("");
//     }
//   }, [token]);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken("");
//     setLoggedInUser("");
//     setDogs([]);
//     setAdoptedDogs([]);
//   };

//   const register = async () => {
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Registration failed");
//       alert(data.message);
//       setUsername("");
//       setPassword("");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const login = async () => {
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });
//       const data = await res.json();
//       if (data.token) {
//         setToken(data.token);
//         localStorage.setItem("token", data.token);
//         setUsername("");
//         setPassword("");
//         setPage(1);
//         setAdoptedPage(1);
//       } else {
//         throw new Error("Login failed");
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const fetchMyDogs = async (jwtToken = token, currentPage = page, status = statusFilter) => {
//     setLoadingDogs(true);
//     setError("");
//     try {
//       const query = new URLSearchParams();
//       if (status) query.append("status", status);
//       query.append("page", currentPage);
//       query.append("limit", limit);

//       const res = await fetch(`${API_BASE}/dogs/registered?${query.toString()}`, {
//         headers: { Authorization: `Bearer ${jwtToken}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch dogs");
//       setDogs(data.dogs || []);
//       setTotalPages(Math.ceil(data.total / limit));
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingDogs(false);
//     }
//   };

//   const fetchAdoptedDogs = async (jwtToken = token, currentPage = adoptedPage) => {
//     setLoadingAdopted(true);
//     setError("");
//     try {
//       const query = new URLSearchParams();
//       query.append("page", currentPage);
//       query.append("limit", limit);

//       const res = await fetch(`${API_BASE}/dogs/adopted?${query.toString()}`, {
//         headers: { Authorization: `Bearer ${jwtToken}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch adopted dogs");
//       setAdoptedDogs(data.dogs || []);
//       setAdoptedTotalPages(Math.ceil(data.total / limit));
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingAdopted(false);
//     }
//   };

//   const registerDog = async () => {
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/dogs/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ name, description }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to register dog");
//       alert(data.message);
//       setName("");
//       setDescription("");
//       setPage(1);
//       fetchMyDogs();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const removeDog = async (id) => {
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/dogs/remove/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to remove dog");
//       alert(data.message);
//       fetchMyDogs();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const adoptDog = async (id) => {
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/dogs/adopt/${id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ thankYou: "Thank you for your dog!" }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to adopt dog");
//       alert(data.message);
//       fetchMyDogs();
//       fetchAdoptedDogs();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchMyDogs(token, page, statusFilter);
//       fetchAdoptedDogs(token, adoptedPage);
//     }
//   }, [token, statusFilter, page, adoptedPage]);

//   return (
//     <Box p={6}>
//       <Heading textAlign="center" mb={6}>
//         Julie's Online Dog Adoption Center
//       </Heading>

//       {loggedInUser && (
//         <Box mb={4} p={4} bg="gray.100" borderRadius="md">
//           <Text>
//             <strong>Logged in as:</strong> {loggedInUser}
//           </Text>
//           <Button colorScheme="red" size="sm" mt={2} onClick={logout}>
//             Log Out
//           </Button>
//         </Box>
//       )}

//       {!token && (
//         <Box
//           maxW="400px"
//           mx="auto"
//           p={6}
//           mb={8}
//           borderRadius="md"
//           boxShadow="md"
//           className="auth-box"
//         >
//           <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
//             Register / Login
//           </Text>

//           <VStack spacing={4}>
//             <FormControl id="username" isRequired>
//               <FormLabel>Username</FormLabel>
//               <Input
//                 placeholder="Enter username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </FormControl>

//             <FormControl id="password" isRequired>
//               <FormLabel>Password</FormLabel>
//               <Input
//                 type="password"
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </FormControl>

//             <Button colorScheme="teal" width="full" onClick={register}>
//               Register
//             </Button>
//             <Button colorScheme="blue" width="full" onClick={login}>
//               Login
//             </Button>

//             {error && (
//               <Text color="red.500" fontWeight="semibold" mt={2} textAlign="center">
//                 {error}
//               </Text>
//             )}
//           </VStack>
//         </Box>
//       )}

//       {token && (
//         <>
//           <Box mb={8} p={4} bg="teal.50" borderRadius="md">
//             <Heading size="md" mb={4}>
//               Register a Dog
//             </Heading>
//             <Input
//               placeholder="Dog's Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               mb={2}
//             />
//             <Input
//               placeholder="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               mb={2}
//             />
//             <Button onClick={registerDog} colorScheme="teal">
//               Submit
//             </Button>
//           </Box>

//           <Box mb={8} p={4} bg="purple.50" borderRadius="md">
//             <Heading size="md" mb={4}>
//               My Registered Dogs
//             </Heading>
//             <Select
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setPage(1);
//               }}
//               mb={4}
//             >
//               <option value="">All</option>
//               <option value="available">Available</option>
//               <option value="adopted">Adopted</option>
//             </Select>

//             {loadingDogs ? (
//               <Text>Loading registered dogs...</Text>
//             ) : (
//               <>
//                 <ul>
//                   {dogs.map((dog) => (
//                     <li key={dog._id}>
//                       <strong>{dog.name}</strong>: {dog.description}{" "}
//                       {dog.adoptedBy ? (
//                         "(Adopted)"
//                       ) : (
//                         <>
//                           <Button size="sm" onClick={() => adoptDog(dog._id)} mr={2}>
//                             Adopt
//                           </Button>
//                           <Button size="sm" onClick={() => removeDog(dog._id)} colorScheme="red">
//                             Remove
//                           </Button>
//                         </>
//                       )}
//                     </li>
//                   ))}
//                 </ul>

//                 <Box mt={4}>
//                   <Button onClick={() => setPage(Math.max(page - 1, 1))} disabled={page <= 1}>
//                     Previous
//                   </Button>
//                   <Text as="span" mx={4}>
//                     Page {page} of {totalPages}
//                   </Text>
//                   <Button
//                     onClick={() => setPage(Math.min(page + 1, totalPages))}
//                     disabled={page >= totalPages}
//                   >
//                     Next
//                   </Button>
//                 </Box>
//               </>
//             )}
//           </Box>

//           <Box mb={8} p={4} bg="green.50" borderRadius="md">
//             <Heading size="md" mb={4}>
//               My Adopted Dogs
//             </Heading>
//             {loadingAdopted ? (
//               <Text>Loading adopted dogs...</Text>
//             ) : (
//               <>
//                 <ul>
//                   {adoptedDogs.map((dog) => (
//                     <li key={dog._id}>
//                       <strong>{dog.name}</strong>: {dog.description} - Thank you:{" "}
//                       {dog.thankYouMessage || "N/A"}
//                     </li>
//                   ))}
//                 </ul>

//                 <Box mt={4}>
//                   <Button
//                     onClick={() => setAdoptedPage(Math.max(adoptedPage - 1, 1))}
//                     disabled={adoptedPage <= 1}
//                   >
//                     Previous
//                   </Button>
//                   <Text as="span" mx={4}>
//                     Page {adoptedPage} of {adoptedTotalPages}
//                   </Text>
//                   <Button
//                     onClick={() => setAdoptedPage(Math.min(adoptedPage + 1, adoptedTotalPages))}
//                     disabled={adoptedPage >= adoptedTotalPages}
//                   >
//                     Next
//                   </Button>
//                 </Box>
//               </>
//             )}
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// }

// export default App;


import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  VStack
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:4000/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dogs, setDogs] = useState([]);
  const [adoptedDogs, setAdoptedDogs] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adoptedPage, setAdoptedPage] = useState(1);
  const [adoptedTotalPages, setAdoptedTotalPages] = useState(1);
  const [loadingDogs, setLoadingDogs] = useState(false);
  const [loadingAdopted, setLoadingAdopted] = useState(false);
  const [error, setError] = useState("");

  const limit = 5;

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedInUser(decoded.username || decoded.id || "");
      } catch {
        setLoggedInUser("");
      }
    } else {
      setLoggedInUser("");
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setLoggedInUser("");
    setDogs([]);
    setAdoptedDogs([]);
  };

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
        setPage(1);
        setAdoptedPage(1);
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMyDogs = async (jwtToken = token, currentPage = page, status = statusFilter) => {
    setLoadingDogs(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (status) query.append("status", status);
      query.append("page", currentPage);
      query.append("limit", limit);

      const res = await fetch(`${API_BASE}/dogs/registered?${query.toString()}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch dogs");
      setDogs(data.dogs || []);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDogs(false);
    }
  };

  const fetchAdoptedDogs = async (jwtToken = token, currentPage = adoptedPage) => {
    setLoadingAdopted(true);
    setError("");
    try {
      const query = new URLSearchParams();
      query.append("page", currentPage);
      query.append("limit", limit);

      const res = await fetch(`${API_BASE}/dogs/adopted?${query.toString()}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch adopted dogs");
      setAdoptedDogs(data.dogs || []);
      setAdoptedTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAdopted(false);
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
      if (!res.ok) throw new Error(data.message || "Failed to register dog");
      alert(data.message);
      setName("");
      setDescription("");
      setPage(1);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove dog");
      alert(data.message);
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
        body: JSON.stringify({ thankYou: "Thank you for your dog!" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to adopt dog");
      alert(data.message);
      fetchMyDogs();
      fetchAdoptedDogs();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyDogs(token, page, statusFilter);
      fetchAdoptedDogs(token, adoptedPage);
    }
  }, [token, statusFilter, page, adoptedPage]);

  return (
    <Box p={6} bg="#353325" color="#A18E88" minH="100vh">
      <Heading textAlign="center" mb={6} color="#FAEDEC">
        Julie's Online Dog Adoption Center
      </Heading>

      {loggedInUser && (
        <Box mb={4} p={4} bg="#FAEDEC" borderRadius="md">
          <Text color="#353325">
            <strong>Logged in as:</strong> {loggedInUser}
          </Text>
          <Button bg="#92636B" color="white" size="sm" mt={2} onClick={logout} _hover={{ bg: "#A18E88" }}>
            Log Out
          </Button>
        </Box>
      )}

      {!token && (
        <Box
          maxW="400px"
          mx="auto"
          p={6}
          mb={8}
          borderRadius="md"
          boxShadow="md"
          bg="#FAEDEC"
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="#353325">
            Register / Login
          </Text>

          <VStack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button bg="#92636B" color="white" width="full" onClick={register} _hover={{ bg: "#A18E88" }}>
              Register
            </Button>
            <Button bg="#A18E88" color="white" width="full" onClick={login} _hover={{ bg: "#92636B" }}>
              Login
            </Button>

            {error && (
              <Text color="red.500" fontWeight="semibold" mt={2} textAlign="center">
                {error}
              </Text>
            )}
          </VStack>
        </Box>
      )}

      {token && (
        <>
          <Box mb={8} p={4} bg="#FAEDEC" borderRadius="md">
            <Heading size="md" mb={4} color="#353325">
              Register a Dog
            </Heading>
            <Input
              placeholder="Dog's Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              mb={2}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              mb={2}
            />
            <Button onClick={registerDog} bg="#92636B" color="white" _hover={{ bg: "#A18E88" }}>
              Submit
            </Button>
          </Box>

          <Box mb={8} p={4} bg="#FAEDEC" borderRadius="md">
            <Heading size="md" mb={4} color="#353325">
              My Registered Dogs
            </Heading>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              mb={4}
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="adopted">Adopted</option>
            </Select>

            {loadingDogs ? (
              <Text>Loading registered dogs...</Text>
            ) : (
              <>
                <ul>
                  {dogs.map((dog) => (
                    <li key={dog._id}>
                      <strong>{dog.name}</strong>: {dog.description}{" "}
                      {dog.adoptedBy ? (
                        "(Adopted)"
                      ) : (
                        <>
                          <Button size="sm" onClick={() => adoptDog(dog._id)} mr={2} bg="#92636B" color="white" _hover={{ bg: "#A18E88" }}>
                            Adopt
                          </Button>
                          <Button size="sm" onClick={() => removeDog(dog._id)} colorScheme="red">
                            Remove
                          </Button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <Box mt={4}>
                  <Button onClick={() => setPage(Math.max(page - 1, 1))} disabled={page <= 1}>
                    Previous
                  </Button>
                  <Text as="span" mx={4}>
                    Page {page} of {totalPages}
                  </Text>
                  <Button
                    onClick={() => setPage(Math.min(page + 1, totalPages))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
          </Box>

          <Box mb={8} p={4} bg="#FAEDEC" borderRadius="md">
            <Heading size="md" mb={4} color="#353325">
              My Adopted Dogs
            </Heading>
            {loadingAdopted ? (
              <Text>Loading adopted dogs...</Text>
            ) : (
              <>
                <ul>
                  {adoptedDogs.map((dog) => (
                    <li key={dog._id}>
                      <strong>{dog.name}</strong>: {dog.description} - Thank you: {dog.thankYouMessage || "N/A"}
                    </li>
                  ))}
                </ul>

                <Box mt={4}>
                  <Button onClick={() => setAdoptedPage(Math.max(adoptedPage - 1, 1))} disabled={adoptedPage <= 1}>
                    Previous
                  </Button>
                  <Text as="span" mx={4}>
                    Page {adoptedPage} of {adoptedTotalPages}
                  </Text>
                  <Button
                    onClick={() => setAdoptedPage(Math.min(adoptedPage + 1, adoptedTotalPages))}
                    disabled={adoptedPage >= adoptedTotalPages}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;