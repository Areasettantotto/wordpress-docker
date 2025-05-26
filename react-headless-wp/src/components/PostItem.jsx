import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
export default function PostItem( { post } ){
	const [featuredImage, setFeaturedImage] = useState('https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg');
	const date = new Date(post.date).toLocaleDateString("it-IT", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	useEffect(() => {
		// Se non c'è featuredmedia, non fare la richiesta
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
			.catch(error => {
				// Se la richiesta fallisce, lascia l'immagine di default
				console.log(error);
			});
	}, [post]);
	return (
		<div className="w-full h-[80vh] md:h-[70vh] flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white/90">
			{/* Lato immagine + titolo sovraimpresso */}
			<div className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center overflow-hidden">
				<img
					src={featuredImage}
					alt="featured"
					className="object-cover w-full h-full brightness-90"
				/>
				<div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
					<h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
						<Link to={`/post/${post.slug}`} state={{ post }} className="hover:underline">
							<span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
						</Link>
					</h2>
				</div>
			</div>
			{/* Lato dettagli */}
			<div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center p-8 gap-4 text-center">
				<h2 className="text-2xl md:text-3xl font-extrabold text-yellow-800 mb-2">
					<span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
				</h2>
				<div className="text-xs text-gray-500 mb-2">
					{post._embedded?.author?.[0]?.name || 'Sconosciuto'}
					{" - "}
					{date}
					{typeof post.id === 'number' && (
						<CommentCount postId={post.id} />
					)}
				</div>
				<div className="text-gray-700 text-base md:text-lg post-excerpt mb-2" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
				<Link
					to={`/post/${post.slug}`}
					state={{ post }}
					className="inline-block px-8 py-3 rounded-full bg-yellow-500 text-white font-bold shadow-lg hover:bg-yellow-600 transition-colors text-lg tracking-wide mt-2 mb-4"
				>
					Vai al dettaglio
				</Link>
				{/* Freccia per scroll automatico */}
				<button
					type="button"
					aria-label="Vai all'articolo successivo"
					className="mt-4 animate-bounce text-yellow-700 text-3xl hover:scale-125 transition-transform"
					onClick={() => {
						// Scrolla al prossimo articolo (prossimo elemento con snap-center)
						const parent = document.querySelector('.snap-x');
						if (parent) {
							const current = parent.querySelector('.snap-center:focus-within, .snap-center:focus, .snap-center:hover, .snap-center');
							let next = current?.nextElementSibling;
							// Salta eventuali spazi o nodi non visibili
							while (next && next.offsetParent === null) next = next.nextElementSibling;
							if (next) next.scrollIntoView({ behavior: 'smooth', inline: 'center' });
						}
					}}
				>
					<span className="block">→</span>
				</button>
			</div>
		</div>
	);
}

function CommentCount({ postId }) {
  const [count, setCount] = useState(null);
  useEffect(() => {
    axios.get(`/wp-json/wp/v2/comments?post=${postId}&status=approve`).then(res => {
      setCount(Array.isArray(res.data) ? res.data.length : 0);
    }).catch(() => setCount(0));
  }, [postId]);
  if (count === null) return null;
  return (
    <span className="text-yellow-700 font-semibold"> - {count} commenti</span>
  );
}
