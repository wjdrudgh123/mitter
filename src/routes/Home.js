import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import Mweet from "components/Mweet";
import MweetFactory from "components/MweetFactory";

const Home = ({ userObj }) => {
  const [mweets, setMweets] = useState([]);

  const getMweets = async () => {
    const dbMweets = await dbService.collection("mweets").get();
    dbMweets.forEach((document) => {
      const mweetObject = {
        ...document.data(),
        id: document.id,
      };
      setMweets((prev) => [mweetObject, ...prev]);
    });
  };

  useEffect(() => {
    //getMweets();
    dbService.collection("mweets").onSnapshot((snapshot) => {
      const mweetsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMweets(mweetsArray);
    });
  }, []);

  return (
    <div className="container">
      <MweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {mweets.map((mweet) => (
          <Mweet
            key={mweet.id}
            mweetObj={mweet}
            isOwner={mweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}; // Function Component
export default Home;
