import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        // silently ignore
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/feed")}
              className="text-sky-700 font-extrabold text-xl"
            >
              in
            </button>
            <div className="hidden sm:flex items-center bg-gray-100 px-3 py-1 rounded">
              <span className="text-gray-500 mr-2">🔍</span>
              <input
                className="bg-transparent outline-none text-sm placeholder-gray-500"
                placeholder="Search"
              />
            </div>
          </div>

          {/* Center: Nav icons */}
          <div className="hidden md:flex items-center gap-6 text-gray-600">
            <Link to="/feed" className="flex flex-col items-center hover:text-black">
              <span className="text-lg">🏠</span>
              <span className="text-xs">Home</span>
            </Link>
            <button className="flex flex-col items-center hover:text-black">
              <span className="text-lg">👥</span>
              <span className="text-xs">My Network</span>
            </button>
            <button className="flex flex-col items-center hover:text-black">
              <span className="text-lg">💼</span>
              <span className="text-xs">Jobs</span>
            </button>
            <button className="flex flex-col items-center hover:text-black">
              <span className="text-lg">💬</span>
              <span className="text-xs">Messaging</span>
            </button>
            <button className="flex flex-col items-center hover:text-black">
              <span className="text-lg">🔔</span>
              <span className="text-xs">Notifications</span>
            </button>
          </div>

          {/* Right: Profile */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium text-gray-800 max-w-[130px] truncate">
                  {user?.name || "Guest"}
                </span>
                <span className="text-[10px] text-gray-500">Me</span>
              </div>
              <span className="text-gray-500">▾</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md py-2">
                <div className="px-3 pb-2 border-b border-gray-100">
                  <div className="font-semibold text-sm text-gray-800">{user?.name || "Guest"}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email || ""}</div>
                </div>
                <button
                  onClick={() => navigate("/feed")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

