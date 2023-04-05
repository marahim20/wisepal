// Header.tsx
import React from 'react';

interface HeaderProps {
  category: string;
}

const Header: React.FC<HeaderProps> = ({ category }) => {
  return (
    <div className="flex items-center justify-between bg-[#1d2333] py-4 px-8 shadow-md">
      <div className="text-xl">
        <a href="/">WisePal</a>
      </div>
      <div className="text-lg font-semibold text-gray-700">
        <h4>{category}</h4>
      </div>
      <div className="space-x-4">
        <a
          href="mailto:sohail21400@gmail.com"
          target="_blank"
          className=""
        >
          Contact
        </a>
        {/* <a href="https://instagram.com/sohail21400" target="_blank" className="text-indigo-600 hover:text-indigo-800">Instagram</a> */}
      </div>
    </div>
  );
};

export default Header;
