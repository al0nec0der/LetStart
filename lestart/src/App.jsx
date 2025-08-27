
import { useState, useEffect } from "react";
import { db, auth } from "./firebase"; // Import auth
import { collection, getDocs } from "firebase/firestore";
// Import authentication functions from Firebase
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./App.css";

function App() {
  const [linkData, setLinkData] = useState([]);
  const [user, setUser] = useState(null); // New state to store the logged-in user

  // Effect for fetching links (this is your existing code)
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const linksCollection = collection(db, "my_links");
        const linkSnapshot = await getDocs(linksCollection);
        const linksList = linkSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLinkData(linksList);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    fetchLinks();
  }, []);

  // New Effect to listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // New: Sign-in function
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  // New: Sign-out function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container">
      {/* --- HEADER --- */}
      <header className="app-header">
        <input
          type="search"
          placeholder="Search the web..."
          className="search-bar"
        />

        {/* --- AUTHENTICATION UI --- */}
        <div className="auth-controls">
          {user ? (
            // If user is logged in, show profile pic and sign out button
            <>
              <img src={user.photoURL} alt="Profile" className="profile-pic" />
              <button onClick={handleSignOut} className="auth-button">
                Sign Out
              </button>
            </>
          ) : (
            // If user is logged out, show sign in button
            <button onClick={handleSignIn} className="auth-button">
              Sign In with Google
            </button>
          )}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="link-sections">
        {linkData.map((category) => (
          <section key={category.id} className="category">
            <h2>{category.title}</h2>
            <div className="links">
              {category.links.map((link, index) => (
                <a key={index} href={link.url}>
                  {link.name}
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default App;
