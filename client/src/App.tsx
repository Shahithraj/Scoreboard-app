import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import DashBoard from "./pages/DashBoard/DashBoard";
import CreateTeamForm from "./pages/CreateForm/components/CreateTeamForm";
import CreateMemberForm from "./pages/CreateForm/components/CreateMemberForm";
import MemberList from "./pages/MemberList/MemberList";
import CreateGameForm from "./pages/CreateForm/components/CreateGameForm";
import AddScoreForm from "./pages/Score/AddScoreForm";
import TeamLeaderboard from "./pages/LeaderBoard/components/TeamLeaderBoard";
import MemberLeaderBoard from "./pages/LeaderBoard/components/MemberLeaderBoard";
import TeamList from "./pages/TeamList/TeamList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/create/team" element={<CreateTeamForm />} />
          <Route path="/create/member" element={<CreateMemberForm />} />
          <Route path="/create/game" element={<CreateGameForm />} />
          <Route path="/leaderboard/team" element={<TeamLeaderboard />} />
          <Route path="/leaderboard/member" element={<MemberLeaderBoard />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/teams" element={<TeamList />} />
          <Route path="/score" element={<AddScoreForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
