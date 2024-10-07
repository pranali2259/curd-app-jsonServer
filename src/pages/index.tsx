import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  age:string;
}

const CrudApp = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEditing) {
      axios.put(`http://127.0.0.1:5000/users/${editingUser?.id}`, {
        name,
        email,
        age,
      })
        .then(response => {
          setUsers(users.map(user => user.id === editingUser?.id ? response.data : user));
          setIsEditing(false);
          setEditingUser(null);
          setName('');
          setEmail('');
          setage('');
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      axios.post('http://127.0.0.1:5000/users', {
        name,
        email,
        age,
      })
        .then(response => {
          setUsers([...users, response.data]);
          setName('');
          setEmail('');
          setage('');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://127.0.0.1:5000/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setage(user.age);
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4">CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">Age:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={age}
            onChange={(event) => setage(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {isEditing ? 'Update' : 'Create'}
        </button>
      </form>
      <ul className="mt-4">
        {users.map((user) => (
          <li key={user.id} className="py-2">
            <span className="text-gray-700">{user.name}</span> {user.email},{user.age}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
              onClick={() => handleEdit(user)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudApp;