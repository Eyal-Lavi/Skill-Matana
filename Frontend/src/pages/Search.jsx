//import { Search as SerachIcon} from "lucide-react";
import "./Search.scss";
import SearchInput from "../utils/components/SearchInput";
import ProfileCard from "../components/ProfileCard";
import { useSelector } from "react-redux";
import { selectSearch } from "../features/search/SearchSelectors";

function Search() {
  const { users, loading, error ,hasSearched} = useSelector(selectSearch);
  console.log(users);
  
  return (
    <div className="container">
      <SearchInput />
      <div className="search-results">
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && hasSearched && !error && users.length === 0 && <p>No results found.</p>}
        {!hasSearched && <p>🔍 Start by entering a name or selecting a skill</p>}
        {users.map((user) => (
          <ProfileCard
            key={user.id}
            avatarUrl={user.Images.find(img => img.typeId === 1)?.url}
            name={user.firstName + " " + user.lastName}
            skills={user.Skills}
            title={user.title}
            bio={user.bio ?? "No bio available."}
            socialLinks={user.socialLinks}
            actionButton={{ text: "Contact Me", href: "#" }}
          />
        ))}
      </div>
    </div>
  );
}

export default Search;
