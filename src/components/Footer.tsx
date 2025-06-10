import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-black py-4 px-6 mt-10">
      <div className="max-w-7xl mx-auto flex justify-center items-center text-sm font-semibold">
        <p>&copy; {new Date().getFullYear()} Dashboard. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
