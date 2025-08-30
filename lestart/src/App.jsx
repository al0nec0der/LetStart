// File: lestart/src/App.jsx

import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
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
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  useEffect(() => {
    const fetchLinks = async () => {
      if (!user) return; 

      try {

        const linksCollection = collection(db, "users", user.uid, "links");

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
  }, [user]); // The effect re-runs when the user logs in or out

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

const handleAddCategory = async (e) => {
  e.preventDefault(); 
  if (!user || newCategoryTitle.trim() === "") return;

  try {
    const linksCollection = collection(db, "users", user.uid, "links");
    const newCategoryDoc = {
      title: newCategoryTitle,
      links: [], // Start with an empty array of links
    };

    const docRef = await addDoc(linksCollection, newCategoryDoc);

    setLinkData([...linkData, { id: docRef.id, ...newCategoryDoc }]);


    setNewCategoryTitle("");
  } catch (error) {
    console.error("Error adding category: ", error);
  }
};


  return (
    <div className="app-layout">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-logo"></div>
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
        <main>
          {user && (
            <form onSubmit={handleAddCategory} className="add-category-form">
              <input
                type="text"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                placeholder="Enter new category name..."
                className="add-category-input"
              />
              <button type="submit" className="add-category-button">
                Add Category
              </button>
            </form>
          )}{" "}
          <div className="link-sections">
            {user ? (
              linkData.map((category) => (
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
              ))
            ) : (
              <div className="welcome-message">
                <h1>Please sign in to view your links.</h1>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
