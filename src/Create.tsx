import { useState } from "react";
import styles from "./Create.module.css";

interface User {
  id: string;
  username: string;
}

const Create = () => {
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");

  const loggedInUser: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const createPoll = async () => {
    if (!loggedInUser) {
      alert("Please log in to create a poll");
      return;
    }

    const pollData = {
      question: question,
      options: [option1, option2, option3, option4].filter((opt) => opt),
      userId: loggedInUser.id,
    };

    try {
      const response = await fetch("/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });

      if (response.ok) {
        console.log("Poll created successfully");
        setQuestion("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
      } else {
        console.error("Failed to create poll");
      }
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Poll</h2>
      <div className={styles.div_container}>
        <input
          className={styles.question}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Write Poll Question"
          required
        />
        <div className={styles.sub_container}>
          <div className={styles.individual_container}>
            <input
              className={styles.input}
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              placeholder="Option 1"
              required
            />
            <input
              className={styles.input}
              value={option3}
              onChange={(e) => setOption3(e.target.value)}
              placeholder="Option 3"
            />
          </div>

          <div className={styles.individual_container}>
            <input
              className={styles.input}
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              placeholder="Option 2"
              required
            />
            <input
              className={styles.input}
              value={option4}
              onChange={(e) => setOption4(e.target.value)}
              placeholder="Option 4"
            />
          </div>
        </div>
      </div>
      <button title="Create" onClick={createPoll} className={styles.btn}>
        Create
      </button>
    </div>
  );
};

export default Create;
