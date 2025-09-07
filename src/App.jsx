// File: lestart/src/App.jsx

import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
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
  const [activeAddLinkForm, setActiveAddLinkForm] = useState(null); // Stores the ID of the category being edited
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

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

  const handleAddLink = async (e, categoryId) => {
    e.preventDefault();
    if (!user || newLinkName.trim() === "" || newLinkUrl.trim() === "") return;

    const formattedUrl = newLinkUrl.startsWith("http")
      ? newLinkUrl
      : `https://${newLinkUrl}`;

    const newLink = { name: newLinkName, url: formattedUrl };

    try {
      const categoryDocRef = doc(db, "users", user.uid, "links", categoryId);

      await updateDoc(categoryDocRef, {
        links: arrayUnion(newLink),
      });

      const updatedLinkData = linkData.map((category) => {
        if (category.id === categoryId) {
          return { ...category, links: [...category.links, newLink] };
        }
        return category;
      });
      setLinkData(updatedLinkData);
      setNewLinkName("");
      setNewLinkUrl("");
      setActiveAddLinkForm(null);
    } catch (error) {
      console.error("Error adding link: ", error);
    }
  };

  const handleDeleteLink = async (categoryId, linkToDelete) => {
    if (!user) return;
    try {
      const categoryDocRef = doc(db, "users", user.uid, "links", categoryId);
      await updateDoc(categoryDocRef, {
        links: arrayRemove(linkToDelete),
      });
      const updatedLinkData = linkData.map((category) => {
        if (category.id === categoryId) {
          const updatedLinks = category.links.filter(
            (link) => link.url !== linkToDelete.url
          );
          return { ...category, links: updatedLinks };
        }
        return category;
      });
      setLinkData(updatedLinkData);
    } catch (error) {
      console.error("Error deleting link: ", error);
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
                  {/* MODIFIED: Category header now includes an "Add Link" button */}
                  <div className="category-header">
                    <h2>{category.title}</h2>
                    <button
                      onClick={() => setActiveAddLinkForm(category.id)}
                      className="add-link-button"
                    >
                      +
                    </button>
                  </div>

                  {/* NEW: Conditionally rendered form for adding a link */}
                  {activeAddLinkForm === category.id && (
                    <form
                      onSubmit={(e) => handleAddLink(e, category.id)}
                      className="add-link-form"
                    >
                      <input
                        type="text"
                        value={newLinkName}
                        onChange={(e) => setNewLinkName(e.target.value)}
                        placeholder="Link Name"
                      />
                      <input
                        type="text"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="URL (e.g., google.com)"
                      />
                      <button type="submit">Save Link</button>
                    </form>
                  )}

                  <div className="links">
                    {category.links.map((link, index) => (
                      <div key={index} className="link-item">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.name}
                        </a>
                        <button
                          onClick={() => handleDeleteLink(category.id, link)}
                          className="delete-button"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="welcome-message">
                {/* ... no changes here ... */}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
