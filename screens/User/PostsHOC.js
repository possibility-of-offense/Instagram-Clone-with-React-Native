import React from "react";

// Own Dependecies
import LazyLoadListItems from "../../components/UI/ListItems/LazyLoadListItems";

function PostsHOC({
  anotherUser = null,
  error,
  loading,
  posts,
  styles,
  retrieveMore,
}) {
  return (
    <LazyLoadListItems
      anotherUser={anotherUser}
      error={error}
      data={posts}
      loading={loading}
      styles={styles}
      retrieveMore={retrieveMore}
    />
  );
}

export default PostsHOC;
