// TODO: focus on the text field on load
// TODO: display the category in the chat window
// TODO: inject persona system message
// TODO: 

import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/router';
import Head from "next/head";
import styles from "../styles/Chat.module.css";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import Header from './Header';
import Footer from './Footer';



export default function Chat() {
  const router = useRouter();
  const [category, setCategory] = useState('');

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! How can I help?" },
  ]);

  useEffect(() => {
    if (router.query.category) {
      setCategory(router.query.category as string);
    }
  }, [router.query]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  // Focus on text field on load
  // useEffect(() => {
  //   textAreaRef.current.focus();
  // }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }
    setLoading(true);
    const context = [...messages, { role: "user", content: userInput }];
    setMessages(context);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context,
        // prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText + " " + response.body + " " + response.status);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      // setResponse((prev) => prev + chunkValue);

      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.role === "assistant") {
          const newMessage = {
            role: "assistant",
            content: lastMessage.content + chunkValue,
          };
          const newMessages = [...prevMessages];
          newMessages.splice(-1, 1, newMessage);
          return newMessages;
        } else {
          return [...prevMessages, { role: "assistant", content: chunkValue }];
        }
      });
    }
    setLoading(false);

    // Reset user input
    setUserInput("");
  };

  const handleEnter = (e: any) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>WisePal</title>
        <meta name="description" content="WisePal interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header category={category} />

      <main className={styles.main}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {messages.map((message, index) => {
              return (
                // The latest message sent by the user will be animated while waiting for a response
                <div
                  key={index}
                  className={
                    message.role === "user" &&
                    loading &&
                    index === messages.length - 1
                      ? styles.usermessagewaiting
                      : message.role === "assistant"
                      ? styles.apimessage
                      : styles.usermessage
                  }
                >
                  {/* Display the correct icon depending on the message type */}
                  {message.role === "assistant" ? (
                    <Image
                      src="/wisepal.png"
                      alt="AI"
                      width="27"
                      height="27"
                      className={styles.boticon}
                      priority={true}
                    />
                  ) : (
                    <Image
                      src="/usericon.png"
                      alt="Me"
                      width="27"
                      height="27"
                      className={styles.usericon}
                      priority={true}
                    />
                  )}
                  <div className={styles.markdownanswer}>
                    {/* Messages are being rendered in Markdown format */}
                    <ReactMarkdown linkTarget={"_blank"}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.cloudform}>
            <form onSubmit={handleSubmit} className="flex justify-between">
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                // type="text"
                id="userInput"
                name="userInput"
                placeholder={
                  loading ? "Waiting for response..." : "Type your question..."
                }
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={styles.textarea}
              />
              <button
                type="submit"
                disabled={loading}
                className={styles.generatebutton}
              >
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <CircularProgress color="inherit" size={20} />{" "}
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg
                    viewBox="0 0 20 20"
                    className={styles.svgicon}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
          {/* <footer className={styles.footer}>
            <p>
              Your{" "}
              <a href="mailto:sohail21400@gmail.com" target="_blank">
                feedback
              </a>{" "}
              is appreciated!
            </p>
          </footer> */}
        </div>
      </main>
      <Footer />
    </div>
  );

  // return (
  //   <div className="w-full max-w-xl">
  //     <textarea
  //       value={userInput}
  //       onChange={(e) => setInput(e.target.value)}
  //       rows={4}
  //       maxLength={200}
  //       className="focus:ring-neu w-full rounded-md border border-neutral-400
  //        p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900"
  //       placeholder={"e.g. What is React?"}
  //     />
  //     {!loading ? (
  //       <button
  //         className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-black/80"
  //         onClick={(e) => generateResponse(e)}
  //       >
  //         Generate Response &rarr;
  //       </button>
  //     ) : (
  //       <button
  //         disabled
  //         className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white"
  //       >
  //         <div className="animate-pulse font-bold tracking-widest">...</div>
  //       </button>
  //     )}
  //     {response && (
  //       <div className="mt-8 rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
  //         {response}
  //       </div>
  //     )}
  //   </div>
  // );
}
