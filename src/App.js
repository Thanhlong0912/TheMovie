import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import MovieList from "./components/MovieList/MovieList";
import MovieDetail from "./pages/MovieDetail/MovieDetail";

const NotFound = () => (
  <main className="notFound">
    <p>404</p>
    <h1>Không tìm thấy trang</h1>
    <span>Trang này có thể đã được đổi đường dẫn hoặc chưa tồn tại.</span>
    <Link to="/">Về trang chủ</Link>
  </main>
);

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="movie/:id" element={<MovieDetail />}></Route>
          <Route path="movies/:type" element={<MovieList />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
