import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to SphereFilxInterview Platform 
        </h1>
        <p className="text-gray-600 mb-8">
          Please login or sign up to continue.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
