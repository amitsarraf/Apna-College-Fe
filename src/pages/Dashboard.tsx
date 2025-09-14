import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/user";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const {  setUser } = useUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });


  useEffect(() => {
    if (data?.user || data) {
      const currentUser = data.user || data;
      setUser(currentUser);

      if (currentUser.role === "ADMIN") {
        navigate("/reviewerdashboard");
      } else if (currentUser.role === "CANDIDATE") {
        navigate("/candidatedashboard");
      } else if (currentUser.role === "REVIEWER") {
        navigate("/reviewerdashboard"); // adjust if needed
      }
    } else if (isError) {
      navigate("/login");
    }
  }, [data, isError, navigate, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return null; 
};

export default Home;
