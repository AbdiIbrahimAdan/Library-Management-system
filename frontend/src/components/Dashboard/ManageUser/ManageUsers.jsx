import React, { useEffect } from 'react';
import useUserStore from '../../../store/userStore';
import './ManageUsers.css';

const ManageUsers = () => {
  const { users, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers(); // Fetch users on mount
  }, [fetchUsers]);

  if (!users || users.length === 0) {
    return <p>No users available.</p>; // Display empty message if no users
  }

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
