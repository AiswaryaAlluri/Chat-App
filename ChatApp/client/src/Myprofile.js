import React, { useContext, useState, useEffect } from 'react';
import { store } from './App';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import avatar from './avatar.png';


const Myprofile = () => {
  const [token, setToken] = useContext(store);
  const [data, setData] = useState(null); // User data
  const [allmsg, setAllmsg] = useState([]); // All messages
  const [newmsg,setNewmsg]= useState(''); // New message input
  // Fetch user profile
  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/myprofile', {
          headers: { 'x-token': token }
        })
        .then(res => setData(res.data))
        .catch(err => console.log(err));

      // Fetch all messages
      axios
        .get('http://localhost:5000/getmsg', {
          headers: { 'x-token': token }
        })
        .then(res => setAllmsg(res.data))
        .catch(err => console.log(err));
    }
  }, [token]);
 const submitHandler =e =>{
    e.preventDefault();
     axios
        .post('http://localhost:5000/addmsg',{text:newmsg},{
          headers: { 'x-token': token }

        }).then(res=>setAllmsg(res.data)).catch((err) => console.log(err))
        setNewmsg('');

 }
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  return (
    <center>
      <br />
      <div className="card" style={{ width: '28rem', textAlign: 'left' }}>
        <img className="card-img-top" src={avatar} alt="Profile" />
        <div className="card-body">
          {data ? (
            <>
              <h5 className="card-title">Welcome: {data.username}</h5>
              <button
                className="btn btn-primary"
                onClick={() => setToken(null)}
              >
                Logout
              </button>

              <hr />
              <h4>Messages</h4>
              {allmsg.length > 0 ? (
                allmsg.map((message, index) => (
                  <div className="card mb-2" key={index}>
                    <div className="card-body">
                      <h6 className="card-subtitle mb-2 text-muted">
                        {message.username}
                      </h6>
                      <p className="card-text">{message.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Messages Loading...</p>
              )}
            </>
          ) : (
            <h4>Loading Profile...</h4>
          )}
          <form onSubmit={submitHandler}>
            <input type="text" onChange={e=> setNewmsg(e.target.value)} value={newmsg} placeholder="Type a message..." />
            <input type="submit" value="Send" className="btn btn-success" />
          </form>

        </div>
      </div>
    </center>
  );
};

export default Myprofile;
