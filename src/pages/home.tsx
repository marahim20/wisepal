import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import systemMessages from "./api/systemMessages";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  const router = useRouter();

  const handleClick = (item: any) => {
    router.push(`/chat?category=${item["category"]}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header category={""} />
      <div className={styles.container}>
        <h1 className="p-4 text-xl">Select a Category</h1>
        <div className="grid h-full grid-cols-2 gap-8 pt-4 md:grid-cols-3 md:gap-16">
          {systemMessages.map((item, index) => (
            <div
              className="relative overflow-hidden transition cursor-pointer rounded-xl hover:transform hover:scale-110 aspect-w-1 aspect-h-1"
              key={index}
              onClick={() => handleClick(item)}
            >
              <div
                id="caption"
                className="absolute bottom-0 z-10 p-4 w-full text-white bg-gradient-to-t from-[#333333]"
              >
                <h3 className="text-lg">{item.category}</h3>
                <p className="text-xs font-light text-opacity-60">
                  {item.description}
                </p>
              </div>
              <img
                id="photo"
                src={item.image}
                alt={item.category}
                className="relative z-0 object-cover w-full h-full opacity-60"
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
