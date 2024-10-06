import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { useParams, useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";

const EditExercises = () => {
  const { id } = useParams();  // Access route params using useParams
  const navigate = useNavigate(); // For redirecting after form submission

  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/exercises/${id}`)
      .then(response => {
        setUsername(response.data.username);
        setDescription(response.data.description);
        setDuration(response.data.duration);
        setDate(new Date(response.data.date));
      })
      .catch(error => console.log(error));

    axios.get('http://localhost:4000/users/')
      .then(response => {
        if (response.data.length > 0) {
          setUsers(response.data.map(user => user.username));
        }
      })
      .catch(error => console.log(error));
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
  
    const exercise = {
      username,
      description,
      duration,
      date,
    };
  
    try {
      // Wait for the server response before redirecting
      const response = await axios.post(`http://localhost:4000/exercises/update/${id}`, exercise);
      console.log(response.data);
  
      // Redirect to home after successfully updating
      navigate('/');
    } catch (error) {
      console.error("There was an error updating the exercise!", error);
    }
  };
  

  return (
    <div>
      <h3>Edit Exercise Log</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <select
            required
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          >
            {users.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
        <div className="form-group mt-2">
          <label>Description: </label>
          <input
            type="text"
            required
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group mt-2">
          <label>Duration (in minutes): </label>
          <input
            type="text"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="form-group mt-2">
          <label>Date: </label>
          <div>
            <DatePicker
              selected={date}
              onChange={(newDate) => setDate(newDate)}
            />
          </div>
        </div>
        <div className="form-group mt-2">
          <input type="submit" value="Edit Exercise Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};

export default EditExercises;
