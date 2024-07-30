import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const PostPage = ({ setPosts, posts, handleDelete }) => {
    const { id } = useParams();
    const post = posts.find(post => (post.id).toString() === id);

    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const navigate = useNavigate();




    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setBody(post.body);
        }
    }, [post]);

    async function handleEdit(id) {
        const editedPost = { ...post, title, body };

        try {

            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/posts/${id}`, editedPost);
            const updatedPost = response.data;

            const updatedPosts = posts.map(post =>
                post.id === id ? updatedPost : post
            );

            setPosts(updatedPosts);
            setEdit(false);
            navigate("/");


        } catch (error) {
            console.error("Error:", error.message);
        }
    }


    return (
        <main className="PostPage">
            <article className="post">
                {post &&
                    <>
                        {edit ?
                            <input className="title-input"
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)} /> : <h2>{post.title}</h2>}
                        <p className="postDate">{post.datetime}</p>
                        {edit ? <textarea className="title-input"
                            rows={5}
                            value={body}
                            onChange={e => setBody(e.target.value)} ></textarea> :
                            <p className="postBody">{post.body}</p>}
                        <div>
                            <button style={{ marginRight: "1rem" }} onClick={() => handleDelete(post.id)}>
                                Delete Post
                            </button>
                            <button style={{ marginLeft: "1rem", backgroundColor: edit ? "cornflowerblue" : "#a9a9a9" }}
                                onClick={() => {
                                    setEdit(!edit);
                                    if (edit) {
                                        handleEdit(post.id);
                                    }
                                }}>
                                {edit ? "Save" : "Edit Post"}
                            </button>
                        </div>
                    </>
                }

                {!post &&
                    <>
                        <h2>Post Not Found</h2>
                        <p>Well, that's disappointing.</p>
                        <p>
                            <Link to='/'>Visit Our Homepage</Link>
                        </p>
                    </>
                }
            </article>
        </main>
    );
}

export default PostPage;
