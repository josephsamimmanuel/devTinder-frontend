import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axiosInstance from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      const user = await axiosInstance.get("/profile/view");
      dispatch(addUser(user.data.data));
      toast.success(user.data.message);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      console.error('Error fetching user:', err);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);

  // Check if current path is login
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      <Navbar />
      <div className={isLoginPage ? "" : "pt-20"}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
