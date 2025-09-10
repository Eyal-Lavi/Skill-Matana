// pages/Search.jsx
import "./Search.scss";
import { Github, Linkedin } from "lucide-react";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import SearchInput from "../utils/components/SearchInput";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import NewContactModal from "../components/NewContactModal/NewContactModal";

import { selectSearch } from "../features/search/SearchSelectors";
// import { selectUserId } from "../features/auth/AuthSelectors";
import { useConnectionActions } from "../components/ContactManagement/hooks/useConnectionActions";

function Search() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);

  const { users, loading, error, hasSearched, hasFullFilled } =
    useSelector(selectSearch);


  const { handleSendConnectionRequest } = useConnectionActions(); 

  const openModalForUser = useCallback((userIdTarget, userNameTarget) => {
    setSelectedUserId(userIdTarget);
    setSelectedUserName(userNameTarget);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserName(null);
  }, []);

  const handleSendRequest = useCallback(
    async (message = "") => {
      if (!selectedUserId) return;
      await handleSendConnectionRequest(selectedUserId, message);
      // בהצלחה: סגירה וניקוי
      setIsModalOpen(false);
      setSelectedUserId(null);
      setSelectedUserName(null);
    },
    [selectedUserId, handleSendConnectionRequest]
  );

  return (
    <div className="container">
      <SearchInput />

      <div className="search-results">
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && hasSearched && hasFullFilled && !error && users.length === 0 && (
          <p>No results found.</p>
        )}

        {!hasSearched && !loading && (
          <p>🔍 Start by entering a name or selecting a skill</p>
        )}

        {users.map((user) => (
          <ProfileCard
            key={user.id}
            avatarUrl={user.Images.find((img) => img.typeId === 1)?.url}
            name={`${user.firstName} ${user.lastName}`}
            skills={user.skills}
            title={user.title}
            bio={user.bio ?? "No bio available."}
            socialLinks={[
              { id: "github", icon: Github, label: "GitHub", href: user.githubUrl },
              { id: "linkedin", icon: Linkedin, label: "LinkedIn", href: user.linkedinUrl },
            ]}
            actionButton={{
              text: "Contact Me",
              onClick: () => openModalForUser(user.id, `${user.firstName} ${user.lastName}`),
            }}
          />
        ))}
      </div>

      <NewContactModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSendRequest={handleSendRequest} // מקבל message מהמודאל
        targetUserName={selectedUserName}
      />
    </div>
  );
}

export default Search;
