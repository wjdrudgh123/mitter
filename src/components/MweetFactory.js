import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const MweetFactory = ({ userObj }) => {
  const [mweet, setMweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    if (mweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`); // 파일에 대한 reference를 생성
      const response = await attachmentRef.putString(attachment, "data_url"); // 파일, 포맷(data_url 지정되 있음)
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const mweetObj = {
      text: mweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection("mweets").add(mweetObj); //collection(collection name)
    setMweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setMweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event; // 파일 정보
    const theFile = files[0];
    // FileReader Api 사용
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // 파일을 다 읽으면 실행되는 콜백
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile); // readAsDataUrl을 이용해 파일을 읽음(이미지를 특정 text로 바꿈)
  };
  const onClearAttachment = () => setAttachment("");

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={mweet}
          onChange={onChange}
        />
        <input
          type="file"
          id="attach-file"
          accept="image/*"
          onChange={onFileChange}
          style={{ opacity: 0 }}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add Photo</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      {attachment && (
        <div className="factoryForm__attachment">
          <img src={attachment} style={{ backgroundImage: attachment }} />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default MweetFactory;
