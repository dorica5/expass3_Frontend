import styles from "./App.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Option {
  id: string;
  caption: string;
  votes: { length: number }[];
}

interface Poll {
  id: string;
  question: string;
  options: { [key: string]: Option };
}

interface User {
  id: string;
  username: string;
}

function Home() {
  const navigate = useNavigate();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loggedInUser: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  const username = loggedInUser?.username;

  useEffect(() => {
    if (loggedInUser) {
      const userSelections = JSON.parse(
        localStorage.getItem("userSelections") || "{}"
      );
      const currentPoll = polls[currentPollIndex];
      if (userSelections[loggedInUser.id]?.[currentPoll?.id]) {
        setSelectedOption(userSelections[loggedInUser.id][currentPoll.id]);
      }
    }
  }, [currentPollIndex, polls, loggedInUser]);

  const signOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchPolls = async () => {
    try {
      const response = await fetch("/polls");
      if (response.ok) {
        const data = await response.json();
        setPolls(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setLoading(false);
    }
  };

  const submitVote = async (pollId: string, optionId: string) => {
    if (!loggedInUser) {
      alert("Please log in to vote");
      return;
    }

    try {
      const response = await fetch(
        `/polls/${pollId}/options/${optionId}/votes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUser.id, optionId }),
        }
      );
      if (response.ok) {
        setSelectedOption(optionId);

        const userSelections = JSON.parse(
          localStorage.getItem("userSelections") || "{}"
        );
        if (!userSelections[loggedInUser.id]) {
          userSelections[loggedInUser.id] = {};
        }
        userSelections[loggedInUser.id][pollId] = optionId;
        localStorage.setItem("userSelections", JSON.stringify(userSelections));

        fetchPolls();
      } else {
        console.error("Failed to submit vote. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const getPercentage = (votes: number, totalVotes: number): number => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const goToNextPoll = () => {
    setCurrentPollIndex((prevIndex) =>
      prevIndex < polls.length - 1 ? prevIndex + 1 : 0
    );
    setSelectedOption(null);
  };

  const goToPreviousPoll = () => {
    setCurrentPollIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : polls.length - 1
    );
    setSelectedOption(null);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const goToCreate = () => {
    navigate("/create");
  };

  if (loading) {
    return <div>Loading polls...</div>;
  }

  if (polls.length === 0) {
    return (
      <div className={styles.no_post_container}>
        <h2>No polls available</h2>
        <button onClick={goToCreate} className={styles.btn}>
          Create Poll
        </button>
        <button onClick={signOut} className={styles.btn}>
          Sign Out
        </button>
      </div>
    );
  }

  const currentPoll = polls[currentPollIndex];
  const optionsArray = Object.keys(currentPoll.options).map(
    (key) => currentPoll.options[key]
  );
  const totalVotes = optionsArray.reduce(
    (sum, opt) => sum + opt.votes.length,
    0
  );

  return (
    <div className={styles.container}>
      <div className={styles.top_nav}>
        <button onClick={goToCreate}>Create</button>
        <button onClick={signOut}>Sign out</button>
      </div>
      <div className={styles.main_container}>
        <div className={styles.greeting}>
          <span className={styles.number}>
            <p># {currentPoll.id}</p>
          </span>
          <h2 className={styles.title}>Hello {username}, ready to vote?</h2>
        </div>
        <h3 className={styles.question}>{currentPoll.question}</h3>

        <div className={styles.options}>
          {optionsArray.map((option) => (
            <div
              key={option.id}
              className={`${styles.option} ${
                selectedOption === option.id ? styles.selected : ""
              }`}
              onClick={() => {
                submitVote(currentPoll.id, option.id);
              }}
            >
              {option.caption} -{" "}
              {getPercentage(option.votes.length, totalVotes)}%
              {selectedOption === option.id && (
                <span className={styles.tick}>✔️</span>
              )}
            </div>
          ))}
        </div>

        <div className={styles.top_nav}>
          <button onClick={goToPreviousPoll}>Previous</button>
          <button onClick={goToNextPoll}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
