

// import React from "react";
// import ReactDOM from "react-dom/client"; // ✅ ADD THIS LINE
// import { ChakraProvider, extendTheme } from "@chakra-ui/react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import App from "./App";
// import Dashboard from "./pages/Dashboard";
// import AdoptPage from "./pages/AdoptPage";

// // Define your custom colors for light and dark modes
// const colors = {
//   brand: {
//     light: {
//       bg: "#FAEDEC",
//       surface: "#FAEDEC",
//       text: "#353325",
//       accent: "#92636B",
//       secondary: "#A18E88",
//     },
//     dark: {
//       bg: "#353325",
//       surface: "#4a473f",
//       text: "#FAEDEC",
//       accent: "#92636B",
//       secondary: "#A18E88",
//     },
//   },
// };

// const theme = extendTheme({ colors });

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ChakraProvider theme={theme}>
//       <Router>
//         <Routes>
//           <Route path="/" element={<App />}>
//             <Route index element={<Dashboard />} />
//             <Route path="adopt/:dogId" element={<AdoptPage />} />
//           </Route>
//         </Routes>
//       </Router>
//     </ChakraProvider>
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom/client";
// import { ChakraProvider, extendTheme } from "@chakra-ui/react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import App from "./App"; // your login/home page
// import Dashboard from "./pages/Dashboard";
// import AdoptPage from "./pages/AdoptPage";

// const colors = {
//   brand: {
//     light: {
//       bg: "#FAEDEC",
//       surface: "#FAEDEC",
//       text: "#353325",
//       accent: "#92636B",
//       secondary: "#A18E88",
//     },
//     dark: {
//       bg: "#353325",
//       surface: "#4a473f",
//       text: "#FAEDEC",
//       accent: "#92636B",
//       secondary: "#A18E88",
//     },
//   },
// };

// const theme = extendTheme({ colors });

// const isAuthenticated = () => !!localStorage.getItem("token");

// function ProtectedRoute({ children }) {
//   if (!isAuthenticated()) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// }

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ChakraProvider theme={theme}>
//       <Router>
//         <Routes>
//           {/* Public login/home page */}
//           <Route path="/" element={<App />} />

//           {/* Protected routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/adopt/:dogId"
//             element={
//               <ProtectedRoute>
//                 <AdoptPage />
//               </ProtectedRoute>
//             }
//           />

//           {/* Catch all */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </ChakraProvider>
//   </React.StrictMode>
// );


import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App"; // your login/home page
import Dashboard from "./pages/Dashboard";
import AdoptPage from "./pages/AdoptPage";

const colors = {
  brand: {
    light: {
      bg: "#FAEDEC",
      surface: "#FAEDEC",
      text: "#353325",
      accent: "#92636B",
      secondary: "#A18E88",
    },
    dark: {
      bg: "#353325",
      surface: "#4a473f",
      text: "#FAEDEC",
      accent: "#92636B",
      secondary: "#A18E88",
    },
  },
};

const theme = extendTheme({ colors });

// Improved isAuthenticated checks token expiration
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;

    const isExpired = Date.now() >= payload.exp * 1000;
    if (isExpired) {
      localStorage.removeItem("token"); // Clear expired token
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public login/home page */}
          <Route path="/" element={<App />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adopt/:dogId"
            element={
              <ProtectedRoute>
                <AdoptPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);