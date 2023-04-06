// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1d2333] py-4 text-center w-[100vw] text-white mt-auto">
      {/* <p className="text-sm">
        &copy; {new Date().getFullYear()} WisePal. All rights reserved.
      </p> */}
      <p className="text-sm text-gray-500">
        Your{" "}
        <a
          href="mailto:sohail21400@gmail.com"
          target="_blank"
          className="text-gray-300"
        >
          feedback
        </a>{" "}
        is appreciated!
      </p>
    </footer>
  );
};

export default Footer;
