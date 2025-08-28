const average = (arr) =>
  arr.length > 0
    ? arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)
    : 0;

export default function WatchedSummary({ watched = [] }) {
  const avgImdbRating =
    watched.length > 0 ? average(watched.map((movie) => movie.imdbRating)) : 0;
  const avgUserRating =
    watched.length > 0 ? average(watched.map((movie) => movie.userRating)) : 0;
  const avgRuntime =
    watched.length > 0 ? average(watched.map((movie) => movie.runtime)) : 0;
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
