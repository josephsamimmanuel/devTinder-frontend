import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { useState } from "react";
import { validatePassword } from "../utils/validation";
import toast from "react-hot-toast";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const validateFields = (field, value) => {
    switch (field) {
      case "newPassword":
        return validatePassword(value) ? "" : "Invalid new password";
      case "confirmPassword":
        return value === formData.newPassword ? "" : "Passwords do not match";
      default:
        return "";
    }
  };

  const handleValidation = () => {
    const newErrors = {
      newPassword: formData.newPassword === "" ? "New password is required" : validateFields('newPassword', formData.newPassword),
      confirmPassword: formData.confirmPassword === "" ? "Confirm password is required" : validateFields('confirmPassword', formData.confirmPassword),
    };
    setError(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateFields(name, value);
    setError((prev) => ({ 
      ...prev, 
      [name]: errorMessage 
    }));
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out...');
    try {
      const res = await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      navigate("/login");
      toast.dismiss(loadingToast);
      toast.success(res?.data?.message);
    } catch (err) {
      console.log(err);
      toast.dismiss(loadingToast);
      toast.error(err?.response?.data || "Logout failed");
    }
  };
  
  const handleSaveChanges = async () => {
    if (!handleValidation()) return;
    try {
      const response = await axios.patch(
        `${BASE_URL}/profile/password`,
        { password: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }, 
        { 
          withCredentials: true,
        }
      );
      
      if (response.status === 200) {
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
        setError({
          newPassword: "",
          confirmPassword: "",
        });
        document.getElementById('my_modal_1').close();
      }
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full bg-neutral text-white shadow-lg z-50">
      <div className="navbar px-5 flex justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition">
          DevTinder 🔥
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-400 font-semibold px-4 py-2 rounded-xl shadow-md text-center">
              👋 Welcome, {user.firstName}!
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:bg-gray-700 transition"
              >
                <div className="w-10 rounded-full border border-gray-500">
                  <img alt="User Photo" src={user.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-gray-900 text-gray-300 border border-gray-700 rounded-md shadow-lg mt-3 w-52 p-2 right-0 z-50"
              >
                <li>
                  <Link to="/profile" className="justify-between hover:bg-gray-800 rounded-md p-2">
                    Profile <span className="badge badge-success">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="justify-between hover:bg-gray-800 rounded-md p-2">
                    Connections <span className="badge badge-error">💗</span>
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="justify-between hover:bg-gray-800 rounded-md p-2">
                    Requests <span className="badge badge-warning">👁️</span>
                  </Link>
                </li>
                <li>
                  <button className="text-red-400 hover:text-red-300 hover:bg-gray-800 w-full p-2 rounded-md" onClick={() => document.getElementById('my_modal_1').showModal()}>Change Password</button>

                  <dialog id="my_modal_1" className="modal flex justify-center items-center">
                    <div className="bg-base-200 border border-base-300 p-6 rounded-lg w-full max-w-md">
                      <h2 className="text-xl font-bold mb-4">Change Password</h2>

                      <div className="flex flex-col gap-4 h-full">
                        <label>
                          <span className="font-medium">New Password</span>
                          <input 
                            type="password" 
                            name="newPassword"
                            value={formData.newPassword}
                            className="input w-full mt-1 p-2 border rounded-md" 
                            placeholder="New Password" 
                            onChange={handleFieldChange}
                          />
                        </label>
                        {error.newPassword && <p className="text-red-500 text-sm">{error.newPassword}</p>}

                        <label>
                          <span className="font-medium">Confirm Password</span>
                          <input 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            className="input w-full mt-1 p-2 border rounded-md" 
                            placeholder="Confirm Password" 
                            onChange={handleFieldChange}
                          />
                        </label>
                        {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
                      </div>

                      <div className="flex justify-end gap-4 mt-6">
                        <form method="dialog">
                          <button className="btn bg-gray-300 text-gray-700 px-4 py-2 rounded-md" onClick={() => {
                            setFormData({
                              newPassword: "",
                              confirmPassword: "",
                            });
                            setError({
                              newPassword: "",
                              confirmPassword: "",
                            });
                            document.getElementById('my_modal_1').close()}}>Close</button>
                        </form>
                        <button className="btn bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleSaveChanges}>Save Changes</button>
                      </div>
                    </div>
                  </dialog>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-gray-800 w-full p-2 rounded-md"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
