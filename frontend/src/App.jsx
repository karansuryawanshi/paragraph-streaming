import React, { useState } from "react";

const ParagraphStreamer = () => {
  const [inputText, setInputText] = useState("");
  const [streamedWords, setStreamedWords] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  let ws;

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const speakWord = async () => {
    const text = inputText;
    console.log(text);

    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.lang = "hi-IN";

      setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setTimeout(() => {
      startStreaming();
    }, 100);
  };

  const startStreaming = (word) => {
    if (!inputText.trim()) return;

    setStreamedWords([]);
    setIsStreaming(true);
    ws = new WebSocket("https://paragraph-streaming-ixqr.vercel.app/");

    ws.onopen = () => {
      ws.send(inputText);
    };

    ws.onmessage = (event) => {
      if (event.data === "END_STREAM") {
        setIsStreaming(false);
        ws.close();
      } else {
        setStreamedWords((prevWords) => [...prevWords, event.data]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f4f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            marginBottom: "20px",
            fontSize: "2.5em",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Word-by-Word Streaming with Voice
        </p>
        <textarea
          style={{
            border: "2px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            background: "#f8f9fa",
            fontSize: "1em",
            width: "100%",
            resize: "none",
            marginBottom: "20px",
            color: "black",
          }}
          rows="5"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter a large paragraph here"
          disabled={isStreaming}
        />
        <button
          onClick={speakWord}
          disabled={isStreaming}
          style={{
            backgroundColor: isStreaming ? "#007bff" : "#28a745",
            color: "#ffffff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontSize: "1em",
            cursor: isStreaming ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {isStreaming ? "Streaming..." : "Start Streaming"}
        </button>
        <div
          style={{
            marginTop: "20px",
            fontSize: "1.2em",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          {streamedWords.join(" ")}
        </div>
      </div>
    </div>
  );
};

export default ParagraphStreamer;
