import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/wp-json/wp/v2/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error('HTTP error ' + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        console.log('Dati ricevuti:', data);
      })
      .catch((err) => {
        console.error('Errore fetch:', err);
        alert('Errore fetch: ' + err.message);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Post da WordPress</h1>
      {posts.length === 0 && <p>Caricamento in corso...</p>}
      <ul className="post-list">
        {posts.map((post, idx) => (
          <li
            key={post.id}
            className="post-item"
            style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
          >
            <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
