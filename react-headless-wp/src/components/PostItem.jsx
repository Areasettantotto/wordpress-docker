import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

export default function PostItem({ post, index, total }) {
  const [featuredImage, setFeaturedImage] = useState('https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg');
  const date = new Date(post.date).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  useEffect(() => {
    const mediaLink = post?._links?.["wp:featuredmedia"]?.[0]?.href;
    if (!mediaLink) {
      return;
    }
    axios
      .get(mediaLink)
      .then(res => {
        if (typeof res.data.source_url === "string") {
          setFeaturedImage(res.data.source_url);
        }
      })
      .catch(() => {});
  }, [post]);
  const author = post._embedded?.author?.[0];
  const authorName = author?.name || 'Autore sconosciuto';
  const avatarUrl = author?.avatar_urls?.['48'] || 'https://www.gravatar.com/avatar/?d=mp&f=y';

  return (
    <div className="w-full h-[80vh] md:h-[70vh] flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white/90 dark:bg-gray-900/90 transition-colors duration-300">
      {/* Immagine e titolo sovrapposto */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center overflow-hidden">
        <img
          src={featuredImage}
          alt="featured"
          className="object-cover w-full h-full brightness-90 dark:brightness-75 transition-all duration-300"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
            <Link to={`/post/${post.slug}`} state={{ post }} className="hover:underline">
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Link>
          </h2>
        </div>
      </div>
      {/* Dettagli articolo */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center p-8 gap-4 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-800 dark:text-yellow-300 mb-2">
          <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </h2>
        <div className="text-xs text-gray-500 dark:text-gray-300 mb-2 flex flex-col md:flex-row items-center justify-center gap-2">
          <img src={avatarUrl} alt={authorName} className="w-8 h-8 rounded-full mr-2 border-2 border-yellow-400 dark:border-yellow-300" />
          <span>{authorName}</span>
          <span className="hidden md:inline">-</span>
          <span>{date}</span>
        </div>
        <div className="text-gray-700 dark:text-gray-200 text-base md:text-lg post-excerpt mb-2" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        <Link
          to={`/post/${post.slug}`}
          state={{ post }}
          className="inline-block px-8 py-3 rounded-full bg-yellow-500 text-white font-bold shadow-lg hover:bg-yellow-600 transition-colors text-lg tracking-wide mt-2 mb-4"
        >
          Vai al dettaglio
        </Link>
        {/* Navigazione tra articoli */}
        <div className="flex flex-row gap-4 justify-center mt-4">
          <button
            type="button"
            aria-label="Torna all'articolo precedente"
            className={`animate-bounce text-yellow-700 dark:text-yellow-300 text-3xl hover:scale-125 transition-transform rotate-180 ${index === 0 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50' : ''}`}
            onClick={() => {
              if (index > 0) {
                document.querySelectorAll('article')[index - 1]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
              }
            }}
            disabled={index === 0}
          >
            <span className="block">→</span>
          </button>
          <button
            type="button"
            aria-label="Vai all'articolo successivo"
            className={`animate-bounce text-yellow-700 dark:text-yellow-300 text-3xl hover:scale-125 transition-transform ${index === total - 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50' : ''}`}
            onClick={() => {
              if (index < total - 1) {
                document.querySelectorAll('article')[index + 1]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
              }
            }}
            disabled={index === total - 1}
          >
            <span className="block">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
