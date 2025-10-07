import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from 'use-debounce';

const URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [debounceSearchTerm] = useDebounce(searchTerm, 1000);

  const fetchData = async (query = '') => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query ? `${URL}/search/movie?query=${query}`  : `${URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.log(error);

      setErrorMessage("Error fetching movies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(debounceSearchTerm);
  }, [debounceSearchTerm]);
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <h2 className="mt-[40px] mb-[40px]">All movies</h2>
        <section className="all-movies">
          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            movieList.map(movie => <MovieCard key={movie.id} movie={movie}/>)
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
