import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import Search from "./Search";
import SuggestedHeader from "../SuggestedUsers/SuggestedHeader";

const SidebarItems = () => {
  return (
    <>
        <SuggestedHeader />
      
      <div style={{ borderBottom: "0.5px solid grey" }}>
        <Home />
      </div>
      <div style={{ borderBottom: "0.5px solid grey" }}>
        <Search />
      </div>
      <div style={{ borderBottom: "0.5px solid grey" }}>
        <Notifications />
      </div>
      <div style={{ borderBottom: "0.5px solid grey" }}>
        <CreatePost />
      </div>
    </>
  );
};

export default SidebarItems;
