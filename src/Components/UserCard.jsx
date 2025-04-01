import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useSwipeable } from 'react-swipeable';
import '../styles/swipe.css';

const UserCard = ({ user, page }) => {
  // const users = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, about, photoUrl, skills } =
    user;

  // State to manage swipe animation and position
  const [swipeClass, setSwipeClass] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Calculate opacity based on swipe distance
  const leftOpacity = Math.min(Math.abs(Math.min(position.x, 0)) / 100, 1);
  const rightOpacity = Math.min(Math.max(position.x, 0) / 100, 1);

  const handleSendRequest = async (status, userId) => {
    const loadingToast = toast.loading('Sending request...');
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUserFromFeed(userId));
      toast.dismiss(loadingToast);
      toast.success(res?.data?.message);
    } catch (error) {
      console.log(error);
      toast.dismiss(loadingToast);
      toast.error(error?.response?.data || "Failed to send request");
    }
  };

  // Configure swipe handlers
  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (!page) {
        setIsDragging(true);
        setPosition({
          x: e.deltaX,
          y: e.deltaY
        });
      }
    },
    onSwipedLeft: () => {
      if (!page && Math.abs(position.x) > 100) {
        setSwipeClass("swipe-left");
        handleSendRequest("ignored", _id);
      } else {
        setPosition({ x: 0, y: 0 });
      }
      setIsDragging(false);
    },
    onSwipedRight: () => {
      if (!page && Math.abs(position.x) > 100) {
        setSwipeClass("swipe-right");
        handleSendRequest("interested", _id);
      } else {
        setPosition({ x: 0, y: 0 });
      }
      setIsDragging(false);
    },
    onTouchEndOrOnMouseUp: () => {
      if (!swipeClass) {
        setPosition({ x: 0, y: 0 });
      }
      setIsDragging(false);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const cardStyle = {
    transform: `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.1}deg)`,
    transition: isDragging ? 'none' : 'transform 0.5s ease-out',
    position: 'relative' // Add this to position overlays correctly
  };

  return (
    <div 
      {...handlers} 
      className={`card grid-rows-1 bg-base-300 w-96 shadow-xl p-3 ${swipeClass}`}
      style={cardStyle}
    >
      {/* Add overlay elements */}
      <div 
        className="swipe-overlay-left"
        style={{ opacity: leftOpacity }}
      >
        IGNORE
      </div>
      <div 
        className="swipe-overlay-right"
        style={{ opacity: rightOpacity }}
      >
        INTERESTED
      </div>

      <figure>
        <img src={photoUrl} alt="Shoes" draggable={false} className="w-full h-80 object-cover rounded-lg"/>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        {skills && skills.length > 0 && (
          <div>
            <h3 className="font-semibold">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-200 text-blue-700 px-2 py-1 rounded-lg text-sm"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
