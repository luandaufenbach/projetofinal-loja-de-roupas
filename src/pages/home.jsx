import { useState } from "react";
import Navbar from "../components/navbar";

export default function Home() {
  const [userUid, setUserUid] = useState([]);
  return (
    <div className="PageHome">
      <Navbar userUid={userUid} />
    </div>
  );
}
