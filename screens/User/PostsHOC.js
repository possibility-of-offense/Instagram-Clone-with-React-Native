import React from "react";

// Own Dependecies
import LazyLoadListItems from "../../components/UI/ListItems/LazyLoadListItems";

function PostsHOC({ error, loading, posts, styles, retrieveMore }) {
  return (
    <LazyLoadListItems
      error={error}
      data={posts}
      loading={loading}
      styles={styles}
      retrieveMore={retrieveMore}
    />
  );
}

export default PostsHOC;
