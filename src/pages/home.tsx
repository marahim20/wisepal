import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Header from './Header';
import Footer from "./Footer";


export default function Home() {
  const router = useRouter();

  const categories = [
    {
      title: "Imam",
      description: "Lorem ipsum dolor sit amet.",
      image: "/homepage_images/1.jpg",
    },
    {
      title: "Andrew Tate",
      description: "Lorem ipsum dolor sit amet.",
      image: "/homepage_images/2.jpg",
    },
    {
      title: "Doctor",
      description: "Lorem ipsum dolor sit amet.",
      image: "/homepage_images/3.jpg",
    },
    {
      title: "Lawyer",
      description: "Lorem ipsum dolor sit amet.",
      image: "/homepage_images/4.jpg",
    },
    {
      title: "Gas Lighter",
      description: "Lorem ipsum dolor sit amet.",
      image: "/homepage_images/5.jpg",
    },
    {
      title: "Elon Musk",
      description: "Lorem ipsum dolor sit amet.",
      image: "/homepage_images/1.jpg",
    },
  ];

  const handleClick = (category: {
    title: string;
    description: string;
    image: string;
  }) => {
    router.push(`/chat?category=${category["title"]}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header category={""} />
      <div className={styles.container}>
        <h1 className="text-xl p-4">Select a Category</h1>
        <div className="h-full grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pt-4">
          {categories.map((category, index) => (
            <div
              className="cursor-pointer rounded-xl overflow-hidden hover:transform hover:scale-110 rounded-md transition relative aspect-w-1 aspect-h-1"
              key={index}
              onClick={() => handleClick(category)}
            >
              <div
                id="caption"
                className="absolute bottom-0 z-10 p-4 w-full text-white bg-gradient-to-t from-[#333333]"
              >
                <h3 className="text-lg">{category.title}</h3>
                <p className="text-xs font-light text-opacity-60">{category.description}</p>
              </div>
              <img
                id="photo"
                src={category.image}
                alt={category.title}
                className="relative z-0 w-full h-full object-cover opacity-60"
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
