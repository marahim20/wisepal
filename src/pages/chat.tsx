import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/Chat.module.css";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "./Header";
import Footer from "./Footer";

export default function Chat() {
  const router = useRouter();
  const [category, setCategory] = useState("");

  var [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey." },
  ]);

  useEffect(() => {
    if (router.query.category) {
      setCategory(router.query.category as string);
    }
  }, [router.query]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null); // Explicitly set the type to HTMLDivElement

  // Focus on text field on load
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  // Add this useEffect to scroll to the bottom of the message list when messages change
  useEffect(() => {
    if (messageListRef.current) {
      const messageList = messageListRef.current;
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  // log function
  const logMessage = async (
    role: string,
    message: string,
    category: string
  ) => {
    try {
      await fetch("/api/logMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          message,
          category,
        }),
      });
    } catch (error) {
      console.error("Error logging message:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }
    // Capitalize the first letter of the user input
    userInput = userInput.charAt(0).toUpperCase() + userInput.slice(1);

    setLoading(true);
    const context = [...messages, { role: "user", content: userInput }];
    setMessages(context);

    // log user input
    await logMessage("user", userInput, category);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context,
        category,
      }),
    });

    if (!response.ok) {
      throw new Error(
        response.statusText + " " + response.body + " " + response.status
      );
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
    <div className="flex flex-col max-h-screen">
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
            <form
              onSubmit={handleSubmit}
              className="flex justify-between items-center border border-[#30373d] rounded-lg"
            >
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
