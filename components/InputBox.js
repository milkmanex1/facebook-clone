import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
import {
  db,
  addDoc,
  deleteDoc,
  colRef,
  serverTimestamp,
  storage,
  ref,
} from "../firebase";
import {
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
const InputBox = () => {
  const { data: session, status } = useSession();

  const inputRef = useRef(null);
  const filepickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);
  const [testImage, setTestImage] = useState(null);
  useEffect(() => {
    // console.log(imageToPost);
  }, [imageToPost]);

  function sendPost(e) {
    e.preventDefault();
    //dont allow user to send post if input value is empty
    if (!inputRef.current.value) {
      return;
    } else {
      //add a new post
      addDoc(colRef, {
        message: inputRef.current.value,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        timestamp: serverTimestamp(),
      }).then((docSN) => {
        if (imageToPost) {
          console.log("uploading image..");
          removeImage();
          const storageRef = ref(storage, `posts/${docSN.id}`);
          const uploadTask = uploadBytesResumable(storageRef, testImage);
          //v8 syntax
          //   const uploadTask = storage
          //     .ref(`posts/${doc.id}`)
          //     .putString(imageToPost, "data_url");

          uploadTask.on(
            "state_change",
            null,
            (error) => console.log(error),
            () => {
              console.log("time to get download url");
              getDownloadURL(storageRef).then((url) => {
                // const xhr = new XMLHttpRequest();
                // xhr.responseType = "blob";
                // xhr.onload = (event) => {
                //   const blob = xhr.response;
                // };
                // xhr.open("GET", url);
                // xhr.send();
                console.log(url);
                setDoc(
                  doc(db, "posts", docSN.id),
                  {
                    postImage: url,
                  },
                  { merge: true }
                );
              });

              //v8 syntax
              //   storage
              //     .ref(`posts/${doc.id}`)
              //     .getDownloadURL()
              //     .then((url) => {
              //       db.collection("posts").doc(doc.id).set(
              //         {
              //           postImage: url,
              //         },
              //         { merge: true }
              //       );
              //     });
            }
          );
        }
      });

      //clear the input
      inputRef.current.value = "";
    }
  }
  //Need to use FileReader to display the image obtained from input type=image
  function addImageToPost(e) {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      setTestImage(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  }

  function removeImage() {
    setImageToPost(null);
  }

  return (
    <div className="blurryBackground p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6 border-2">
      <div className="flex space-x-3 p-4 items-center">
        <Image
          className="rounded-full"
          src={session.user.image}
          width={40}
          height={40}
          layout="fixed"
        ></Image>
        <form className="flex flex-1">
          <input
            type="text"
            ref={inputRef}
            className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
            placeholder={`What's on your mind, ${session.user.name}?`}
          />
          <button className="hidden" type="submit" onClick={sendPost}>
            Submit
          </button>
        </form>
        {imageToPost && (
          <div className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer">
            <img className="h-10 object-contain" src={imageToPost} alt="" />
            <p
              onClick={removeImage}
              className="text-xs text-red-500 text-center cursor-pointer"
            >
              Remove
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-evenly p-3 border-t-0 ">
        <div className="inputIcon">
          <VideoCameraIcon className="h-7 text-red-500"></VideoCameraIcon>
          <p className="text-xs sm:text-sm xl:text-base mainText">Live Video</p>
        </div>
        <div
          className="inputIcon"
          onClick={() => {
            filepickerRef.current.click();
          }}
        >
          <CameraIcon className="h-7 text-green-500"></CameraIcon>
          <p className="text-xs sm:text-sm xl:text-base mainText">
            Photo/Video
          </p>
          <input
            ref={filepickerRef}
            onChange={addImageToPost}
            type="file"
            hidden
          />
        </div>
        <div className="inputIcon">
          <EmojiHappyIcon className="h-7 text-yellow-300"></EmojiHappyIcon>
          <p className="text-xs sm:text-sm xl:text-base mainText">
            Feeling/Activity
          </p>
        </div>
        {/* <button
          className="rounded-md bg-slate-400 text-white p-1 text-sm"
          onClick={uploadImage}
        >
          Test Button
        </button> */}
      </div>
    </div>
  );
};

export default InputBox;

//Notes: uploadString allows the image to be uploaded to the storage, but will not be appended to the post

//Whereas uploadBytesResumable will append it, but image will not be displayed in the storage

//holy shit i did it. Blindly whacking all solutions in the dark
//Found a youtube video which used uploadBytesResumable
//The only diff is that he did not convert the image to a dataURL. He just took the image from the e.target.files[0]

//So the issue was that I was uploading a wrong type of image file.

//Why the fuck Sonny code so fucking stupid man...
