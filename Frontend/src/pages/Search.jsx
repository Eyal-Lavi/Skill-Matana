import "./Search.scss";
import { Github, Linkedin, Search as SearchIcon, Users, AlertCircle, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import SearchInput from "../utils/components/SearchInput";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import NewContactModal from "../components/NewContactModal/NewContactModal";

import { selectSearch } from "../features/search/SearchSelectors";

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
      setIsModalOpen(false);
      setSelectedUserId(null);
      setSelectedUserName(null);
    },
    [selectedUserId, handleSendConnectionRequest]
  );

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="header-content">
          <div className="header-title">
            <SearchIcon className="header-icon" size={32} />
            <h1>Discover Talent</h1>
          </div>
          <p className="header-subtitle">
            Find skilled professionals and connect with amazing people
          </p>
        </div>
      </div>

      <div className="search-section">
        <SearchInput />
      </div>

      <div className="search-results-section">
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Searching for the best matches...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <AlertCircle className="error-icon" size={48} />
            <h3>Oops! Something went wrong</h3>
            <p className="error-message">{error}</p>
          </div>
        )}

        {!loading && hasSearched && hasFullFilled && !error && users.length === 0 && (
          <div className="empty-state">
            <Users className="empty-icon" size={64} />
            <h3>No results found</h3>
            <p>Try adjusting your search criteria or filters to find more results.</p>
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="welcome-state">
            <div className="welcome-icon-wrapper">
              <Sparkles className="welcome-icon" size={64} />
            </div>
            <h2>Ready to discover?</h2>
            <p>Start by entering a name or selecting a skill to find talented professionals</p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <>
            <div className="results-header">
              <h2>
                Found <span className="results-count">{users.length}</span> {users.length === 1 ? 'result' : 'results'}
              </h2>
            </div>
            <div className="search-results">
              {users.map((user, index) => (
                <div 
                  key={user.id} 
                  className="profile-card-wrapper"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProfileCard
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
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <NewContactModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSendRequest={handleSendRequest} 
        targetUserName={selectedUserName}
      />
    </div>
  );
}

export default Search;
