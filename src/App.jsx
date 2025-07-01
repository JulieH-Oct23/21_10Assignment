import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

function App() {
  // Authentication and dog registration states
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dogs, setDogs] = useState([]);
  const [adoptedDogs, setAdoptedDogs] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Filtering and pagination states for registered dogs
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Pagination state for adopted dogs
  const [adoptedPage, setAdoptedPage] = useState(1);
  const [adoptedTotalPages, setAdoptedTotalPages] = useState(1);

  const limit = 5;

  // User Registration
  const register = async () => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    alert(data.message);
  };

  // User Login
  const login = async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      fetchMyDogs(data.token, 1, statusFilter);
      fetchAdoptedDogs(data.token, 1);
    } else {
      alert("Login failed");
    }
  };

  // Fetch user's registered dogs with filtering and pagination
  const fetchMyDogs = async (jwtToken = token, currentPage = page, status = statusFilter) => {
    const query = new URLSearchParams();
    if (status) query.append("status", status);
    query.append("page", currentPage);
    query.append("limit", limit);

    const res = await fetch(`${API_BASE}/dogs/registered?${query.toString()}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    const data = await res.json();
    setDogs(data.dogs || []);
    setTotalPages(Math.ceil(data.total / limit));
  };

  // Fetch adopted dogs with pagination
  const fetchAdoptedDogs = async (jwtToken = token, currentPage = adoptedPage) => {
    const query = new URLSearchParams();
    query.append("page", currentPage);
    query.append("limit", limit);

    const res = await fetch(`${API_BASE}/dogs/adopted?${query.toString()}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    const data = await res.json();
    setAdoptedDogs(data.dogs || []);
    setAdoptedTotalPages(Math.ceil(data.total / limit));
  };

  // Register a new dog
  const registerDog = async () => {
    const res = await fetch(`${API_BASE}/dogs/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });
    const data = await res.json();
    alert(data.message);
    fetchMyDogs();
  };

  // Remove a dog
  const removeDog = async (id) => {
    const res = await fetch(`${API_BASE}/dogs/remove/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    alert(data.message);
    fetchMyDogs();
  };

  useEffect(() => {
    if (token) {
      fetchMyDogs(token, 1, statusFilter);
      fetchAdoptedDogs(token, 1);
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Julie's Online Dog Adoption Center</h1>

      <div>
        <h2>Register / Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
      </div>

      {token && (
        <>
          <div>
            <h2>Register a Dog</h2>
            <input
              placeholder="Dog's Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={registerDog}>Submit</button>
          </div>

          <div>
            <h2>My Registered Dogs</h2>

            <div>
              <label>Status Filter: </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                  fetchMyDogs(token, 1, e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>

            <ul>
              {dogs.map((dog) => (
                <li key={dog._id}>
                  <strong>{dog.name}</strong>: {dog.description}{" "}
                  {dog.adoptedBy ? "(Adopted)" : "(Available)"}
                  {!dog.adoptedBy && (
                    <button onClick={() => removeDog(dog._id)}>Remove</button>
                  )}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => {
                  const newPage = Math.max(page - 1, 1);
                  setPage(newPage);
                  fetchMyDogs(token, newPage, statusFilter);
                }}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span style={{ margin: "0 10px" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => {
                  const newPage = Math.min(page + 1, totalPages);
                  setPage(newPage);
                  fetchMyDogs(token, newPage, statusFilter);
                }}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h2>My Adopted Dogs</h2>
            <ul>
              {adoptedDogs.map((dog) => (
                <li key={dog._id}>
                  <strong>{dog.name}</strong>: {dog.description} - Thank you:{" "}
                  {dog.thankYouMessage || "N/A"}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => {
                  const newPage = Math.max(adoptedPage - 1, 1);
                  setAdoptedPage(newPage);
                  fetchAdoptedDogs(token, newPage);
                }}
                disabled={adoptedPage <= 1}
              >
                Previous
              </button>
              <span style={{ margin: "0 10px" }}>
                Page {adoptedPage} of {adoptedTotalPages}
              </span>
              <button
                onClick={() => {
                  const newPage = Math.min(adoptedPage + 1, adoptedTotalPages);
                  setAdoptedPage(newPage);
                  fetchAdoptedDogs(token, newPage);
                }}
                disabled={adoptedPage >= adoptedTotalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;