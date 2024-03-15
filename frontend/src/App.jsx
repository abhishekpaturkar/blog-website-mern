import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import EditPost from "./pages/EditPost";
import Register from "./pages/Register";
import { UserContext, UserContextProvider } from "./context/UserContext";
const App = () => {
  const { user } = useContext(UserContext);
  return (
    <UserContextProvider>
      <Routes>
        <Route
          exact
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/posts/post/:id"
          element={user ? <PostDetails /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/write"
          element={user ? <CreatePost /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/logout"
          element={user ? <Logout /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/edit/:id"
          element={user ? <EditPost /> : <Navigate to="/login" />}
        />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </UserContextProvider>
  );
};

export default App;
