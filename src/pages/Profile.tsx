import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/user';

const Profile: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });


  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load user info</p>;

  return (
    <div>
      <h1 className="text-xl font-bold">Welcome {data.firstName + " " + data.lastName}</h1>
      <p className="mt-1 text-gray-700">Email : {data.email}</p>
    </div>
  );
};

export default Profile;
