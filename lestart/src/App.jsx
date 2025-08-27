import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import "./App.css";

function App() {
  const [linkData, setLinkData] = useState([]);

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

  return (
    <div className="container">
      <header>
        <input
          type="search"
          placeholder="Search the web..."
          className="search-bar"
        />
      </header>
      <main className="link-sections">
        {linkData.map((category) => (
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
        ))}
      </main>
    </div>
  );
}

export default App;
