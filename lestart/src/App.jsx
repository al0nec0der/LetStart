import { useState } from "react"; 
import "./App.css";


const initialLinkData = [
  {
    title: "Work",
    links: [
      { name: "Gmail", url: "https://mail.google.com" },
      { name: "GitHub", url: "https://github.com" },
      { name: "LinkedIn", url: "https://linkedin.com" },
    ],
  },
  {
    title: "Learning",
    links: [
      { name: "React Docs", url: "https://react.dev" },
      { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
      { name: "Stack Overflow", url: "https://stackoverflow.com" },
    ],
  },
  {
    title: "Social",
    links: [
      { name: "YouTube", url: "https://youtube.com" },
      { name: "X (Twitter)", url: "https://twitter.com" },
      { name: "Reddit", url: "https://reddit.com" },
    ],
  },
];

function App() {

  const [linkData, setLinkData] = useState(initialLinkData);

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
        
          <section key={category.title} className="category">
            <h2>{category.title}</h2>
            <div className="links">
              {category.links.map((link) => (
                <a key={link.url} href={link.url}>
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
