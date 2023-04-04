import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  const categories = [
    {
      title: "Imam",
      description: "Lorem ipsum dolor sit amet.",
      image: "https://via.placeholder.com/250",
    },
    {
      title: "Andrew Tate",
      description: "Lorem ipsum dolor sit amet.",
      image: "https://via.placeholder.com/250",
    },
    {
      title: "Doctor",
      description: "Lorem ipsum dolor sit amet.",
      image: "https://via.placeholder.com/250",
    },
    {
      title: "Lawyer",
      description: "Lorem ipsum dolor sit amet.",
      image: "https://via.placeholder.com/250",
    },
    {
      title: "Gas Lighter",
      description: "Lorem ipsum dolor sit amet.",
      image: "https://via.placeholder.com/250",
    },
    {
      title: "Elon Musk",
      description: "Lorem ipsum dolor sit amet.",
      image: "https://via.placeholder.com/250",
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
    <div className={styles.container}>
      <h1>Select a Category</h1>
      <div className={styles.grid}>
        {categories.map((category, index) => (
          <div
            className={styles.card}
            key={index}
            onClick={() => handleClick(category)}
          >
            <img src={category.image} alt={category.title} />
            <div className={styles.title}>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
