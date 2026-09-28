import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Vocabulary from "./Vocabulary";
import Grammar from "./Grammar";
import AIQuiz from "./AIQuiz";
import AITutor from "./AITutor";
import Pronunciation from "./Pronunciation";
import Progress from "./Progress";
import Translation from "./Translation";

function App() {
  const path = window.location.pathname;

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  // Register page
  if (path === "/register") {
    return <Register />;
  }

  // User must have BOTH user ID and JWT token
  if (!userId || !token) {
    return <Login />;
  }

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  if (path === "/vocabulary") {
    return <Vocabulary />;
  }

  if (path === "/grammar") {
    return <Grammar />;
  }

  if (path === "/ai-quiz") {
    return <AIQuiz />;
  }

  if (path === "/ai-tutor") {
    return <AITutor />;
  }

  if (path === "/pronunciation") {
    return <Pronunciation />;
  }

  if (path === "/progress") {
    return <Progress />;
  }

  if (path === "/translation") {
    return <Translation />;
  }

  return <Dashboard />;
}

export default App;