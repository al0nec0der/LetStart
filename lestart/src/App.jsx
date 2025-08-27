// File: lestart/src/App.jsx

import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./App.css";

function App() {
  const [linkData, setLinkData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      // We will update this logic in the next step to fetch user-specific links
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

    if (user) {
      // Only fetch links if a user is logged in
      fetchLinks();
    } else {
      setLinkData([]); // Clear links if user is logged out
    }
  }, [user]); // Re-run this effect when the user state changes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="app-layout">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-logo">{/* We can add a logo here later */}</div>
        <div className="sidebar-title">
          <span>S</span>
          <span>T</span>
          <span>A</span>
          <span>R</span>
          <span>T</span>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="main-content">
        <header className="main-header">
          <input type="search" placeholder="Search..." className="search-bar" />
          <div className="auth-controls">
            {user ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="auth-button sign-out"
                >
                  Sign Out
                </button>
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="profile-pic"
                />
              </>
            ) : (
              <button onClick={handleSignIn} className="auth-button">
                👤
              </button>
            )}
          </div>
        </header>

        <main className="link-sections">
          {user ? (
            linkData.map((category) => (
              <section key={category.id} className="category">
                <h2>{category.title}</h2>
                <div className="links">
                  {category.links.map((link, index) => (
                    <a key={index} href={link.url}>
                      {link.title}
                    </a>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="welcome-message">
              <h1>Please sign in to view your links.</h1>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
