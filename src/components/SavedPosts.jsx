import React from "react";

const SavedPosts = ({ posts }) => {
  return (
    <div>
      {posts.length ? (
        posts.map((post) => (
          <div key={post.id} className="saved-post">
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No saved posts yet.</p>
      )}
    </div>
  );
};

export default SavedPosts;
