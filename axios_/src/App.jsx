import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import axios from 'axios';

const initialState = [  
  {
    id: 1,
    title: "My First Post",
    datetime: "July 01, 2021 11:17:36 AM",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
  },
  {
    id: 2,
    title: "My 2nd Post",
    datetime: "July 01, 2021 11:17:36 AM",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
  },
  {
    id: 3,
    title: "My 3rd Post",
    datetime: "July 01, 2021 11:17:36 AM",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
  },
  {
    id: 4,
    title: "My Fourth Post",
    datetime: "July 01, 2021 11:17:36 AM",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
  },
]

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();





  const [error, setError] = useState(null)
  const [fetching, setFetching] = useState(false)



  useEffect(() => {
    setFetching(true)
    setError(null)

    async function fetchPosts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error(error.message);
        setError("Error fetching posts " + error.message);
      } finally {
        setFetching(false);
      }
    }

    fetchPosts();
  }, []);





  useEffect(() => {
    const filteredPosts = posts.filter((post) => {
      if (
        post.title.toUpperCase().includes(search.toUpperCase()) ||
        post.body.toUpperCase().includes(search.toUpperCase())
      ) {
        return true;
      } else {
        return false;
      }
    });

    setSearchResults(filteredPosts);
  }, [posts, search]);



  const handleSubmit = (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };




    const newPosts = [newPost, ...posts]
    setPosts(newPosts);
    setPostTitle("");
    setPostBody("");
    navigate("/");
  };





  const handleDelete = (id) => {
    console.log(id);

    const filteredPosts = posts.filter(post => post.id !== id)
    setPosts(filteredPosts);
    navigate("/")
  };







  return (
    <div className='App'>
      <Header title='React JS Blog' />
      <Nav search={search} setSearch={setSearch} />
      {fetching && <p>Loading...</p>}
      <Routes>
        <Route path='/' element={<Home posts={searchResults} />} />
        <Route
          path='/post'
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />
        <Route path='/post/:id' element={<PostPage handleDelete={handleDelete} posts={posts} setPosts={setPosts} />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
