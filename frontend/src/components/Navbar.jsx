import { useState } from "react";
import { Menu, X } from "lucide-react"; // Import icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <span className="bg-purple-500 text-white rounded-full p-2 text-lg font-bold">
            📩
          </span>
          <span className="text-xl font-semibold text-gray-900">Estatery</span>
        </div>

        {/* Center: Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li className="hover:text-purple-600 cursor-pointer">Dashboard</li>
          <li className="hover:text-purple-600 cursor-pointer">
            Manage Property
          </li>
          <li className="hover:text-purple-600 cursor-pointer">Manage Users</li>
          <li className="hover:text-purple-600 cursor-pointer">Messages</li>
          <li className="hover:text-purple-600 cursor-pointer">Settings</li>
        </ul>

        {/* Right: Buttons */}
        <div className="hidden md:flex space-x-4">
          <button className="px-4 py-2 border border-gray-500 text-gray-700 rounded-lg hover:bg-gray-100">
            Login
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Sign up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-4 border-t">
          <ul className="space-y-4 text-center text-gray-700 font-medium">
            <li className="hover:text-purple-600 cursor-pointer">Dashboard</li>
            <li className="hover:text-purple-600 cursor-pointer">
              Manage Property
            </li>
            <li className="hover:text-purple-600 cursor-pointer">
              Manage Users
            </li>
            <li className="hover:text-purple-600 cursor-pointer">Messages</li>
            <li className="hover:text-purple-600 cursor-pointer">Settings</li>
          </ul>
          <div className="mt-4 flex flex-col items-center space-y-2">
            <button className="px-4 py-2 border border-gray-500 text-gray-700 rounded-lg w-40">
              Login
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg w-40">
              Sign up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
