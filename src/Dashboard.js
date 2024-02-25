import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [poems, setPoems] = useState([]);
  const [newPoemTitle, setNewPoemTitle] = useState('');
  const [newPoemContent, setNewPoemContent] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    fetchUserData();
    fetchPoems();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://panel.mait.ac.in:8001/auth/user-details/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(response.data);
    } catch (error) {
      setError('Error fetching user data');
    }
  };

  const fetchPoems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://panel.mait.ac.in:8001/poem/get/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPoems(response.data);
    } catch (error) {
      setError('Error fetching poems');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  const handleNewPoemSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://panel.mait.ac.in:8001/poem/create/',
        {
          title: newPoemTitle,
          content: newPoemContent
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNewPoemTitle('');
      setNewPoemContent('');
      fetchPoems(); // Refresh the list of poems after creating a new one
      alert('Poem created successfully!');
    } catch (error) {
      setError('Error creating poem');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p>{error}</p>}
      {userData && (
        <div>
          <h3>Welcome {userData.name} to your dashboard!</h3>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
      <h3>Create a New Poem</h3>
      <form onSubmit={handleNewPoemSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={newPoemTitle} onChange={(e) => setNewPoemTitle(e.target.value)} />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={newPoemContent} onChange={(e) => setNewPoemContent(e.target.value)} />
        </div>
        <button type="submit">Create Poem</button>
      </form>
      <h3>Poems:</h3>
      {poems.map(poem => (
        <div key={poem.id}>
          <h4>{poem.title}</h4>
          <p>{poem.content}</p>
        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
