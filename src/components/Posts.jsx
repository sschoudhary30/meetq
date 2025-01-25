import React from "react";

const Posts = ({ posts, onSavePost }) => {
  console.log("onSavePost in Posts:", onSavePost); 

  return (
    <div className="posts-section">
      <h4>Posts</h4>
      {posts.length ? (
        posts.map((post) => (
          <div key={post.id} className="post-item">
            <p>{post.content}</p>
            {post.mediaUrl && (
              <img
                src={post.mediaUrl}
                alt="Post Media"
                className="post-media"
              />
            )}
            <button onClick={() => onSavePost(post)}>Save Post</button>
          </div>
        ))
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
};

export default Posts;
