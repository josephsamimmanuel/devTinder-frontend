import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { createSocketConnection } from '../utils/socket';

function Chat() {
  const chatUser = useSelector((store) => store?.chatUser?.chatUser);
  const user = useSelector((store) => store?.user);
  const userFirstName = user?.firstName;
  const userId = user?._id;
  const chatUserId = chatUser?._id;
  const [socket, setSocket] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // If userId or chatUserId is not available, return
    if (!userId || !chatUserId) return;

    const newSocket = createSocketConnection();
    setSocket(newSocket);

    // As soon as the page loads, socket connection is made and joinchat event is emitted
    newSocket.on('connect', () => {
      console.log('Socket connected, emitting joinChat');
      newSocket.emit('joinChat', { userId, chatUserId });
    });

    // Load existing messages
    newSocket.on('loadMessages', (loadedMessages) => {
      const formattedMessages = loadedMessages.map(msg => ({
        id: msg._id,
        sender: msg.senderId._id === userId ? 'You' : msg.senderId.firstName,
        content: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'delivered'
      }));
      setMessages(formattedMessages);
    });

    newSocket.on('receiveMessage', ({firstName, message, userId: senderId, chatUserId, timestamp}) => {
      setMessages((prevMessages) => [...prevMessages, {
        sender: senderId === userId ? 'You' : firstName, 
        content: message, 
        time: new Date(timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'delivered'
      }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, chatUserId, userFirstName]); 
  console.log(messages)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    // Match the backend's room ID format by sorting the IDs
    const roomId = [userId, chatUserId].sort().join("-");    
    socket.emit('sendMessage', {
      roomId,
      firstName: user?.firstName,
      message: newMessage,
      userId,
      chatUserId,
    });
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className='w-2/5 mx-auto rounded-md shadow-md border border-gray-300 p-4 flex flex-col gap-4'>
        <div className='flex justify-center items-center gap-2'>
            <img src={chatUser?.photoUrl} alt="profile" className='w-10 h-10 rounded-full border border-gray-300 p-1' />
            <h1 className='text-2xl font-bold'>Chat with {chatUser?.firstName} {chatUser?.lastName}</h1>
        </div>
        <span className='text-xs text-gray-500 text-center'>Last seen 2 hours ago</span>
        <hr className='border-gray-300' />
        <div className='flex flex-col gap-2 overflow-y-auto hide-scrollbar max-h-[400px]'>
            {messages.map((message, index) => (
                <div key={index} className={`flex flex-col ${message.sender === 'You' ? 'items-end' : 'items-start'} gap-1 w-2/3 ${message.sender === 'You' ? 'ml-auto' : 'mr-auto'}`}>
                    <div className='flex items-center gap-2'>
                        <span className='font-bold'>{message.sender}</span>
                    </div>
                    <p className={`${message.sender === 'You' ? 'bg-white text-black' : 'bg-[#646EE4] text-white'} p-2 rounded-md w-full break-words whitespace-normal`}>{message.content}</p>
                    <div className='flex items-center gap-2'>
                        {message.status === 'delivered' && <span className='text-xs'>Delivered</span>}
                        {message.status === 'seen' && <span className='text-xs'>Seen</span>}
                        <span className='text-xs'>{message.time} </span>
                    </div>
                </div>
            ))}
        </div>
        <hr className='border-gray-300' />
        <div className='flex gap-2 justify-between w-full'>
            <input 
                type="text" 
                placeholder="Type a message..." 
                className='border border-gray-300 p-2 rounded-md w-full' 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button 
                className='btn btn-primary' 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
            >
                Send
            </button>
        </div>
    </div>
  );
}

export default Chat
