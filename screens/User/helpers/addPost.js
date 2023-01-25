import "react-native-get-random-values";
import { nanoid } from "nanoid";
import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Own Dependencies
import { db, storage } from "../../../firebase/config";

const handleAddPost = async ({ navigation, post, setPost, user }) => {
  const id = await nanoid();

  if (!post.image || post.description === "") {
    setPost((prev) => ({ ...prev, error: "Fill the input and set an image!" }));
    return;
  }

  setPost((prev) => ({ ...prev, loading: true }));

  try {
    let userPostImageRef;

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", post.image, true);
      xhr.send(null);
    });

    userPostImageRef = ref(storage, `users/${user.uid}/${id}/postImage`);

    uploadBytes(userPostImageRef, blob).then((snapshot) => {
      getDownloadURL(userPostImageRef)
        .then((url) => {
          return addDoc(collection(db, "users", user.uid, "posts"), {
            userId: user.uid,
            description: post.description,
            postImage: url,
            timestamp: serverTimestamp(),
            likes: 0,
            comments: 0,
            popular: false,
          })
            .then((data) => {
              updateDoc(doc(db, "users", user.uid), {
                posts: increment(1),
              })
                .then(() => {
                  setPost((prev) => ({
                    ...prev,
                    description: "",
                    image: null,
                    loading: false,
                  }));
                  navigation.navigate("Profile", {
                    screen: "All Posts",
                  });
                })
                .catch((err) =>
                  setPost((prev) => ({
                    ...prev,
                    error: "Couldn't add document! Try again!",
                  }))
                );
            })
            .catch((err) =>
              setPost((prev) => ({
                ...prev,
                error: "Couldn't add document! Try again!",
              }))
            );
        })
        .catch((err) =>
          setPost((prev) => ({
            ...prev,
            error: "Couldn't upload the image! Try again!",
          }))
        );
    });
  } catch (error) {
    setPost((prev) => ({
      ...prev,
      error: "Couldn't upload the image! Try again!",
    }));
  }
};

export default handleAddPost;
