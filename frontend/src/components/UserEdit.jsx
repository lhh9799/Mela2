import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DefaultButton from "../components/DefaultButton";
import styled from "styled-components";
import { fetchUser, followUser } from "../API/UserAPI";
import defaultprofile from "../assets/images/default-profile.png";
import { getImg } from "../API/FileAPI";
import { isFollow } from "../API/UserAPI";
import instagram from "../assets/images/instagram.png";
import youtube from "../assets/images/youtube.png";
import { CreateChat } from "../API/ChatAPI";

function UserEdit(props) {
  const [isFollowed, setIsFollowed] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserPortfolio, setCurrentUserPortfolio] = useState("");
  const [currentUserPosition, setCurrentUserPosition] = useState([]);
  const [currentUserGenre, setCurrentUserGenre] = useState([]);
  const [currentUserShorts, setCurrentUserShorts] = useState([]);
  const [loginUser, setLoginUser] = useState("");
  const [loginUserPortfolio, setLoginUserPortfolio] = useState("");
  const [imgURL, setImgURL] = useState("");
  // const currentUser = props.currentUser
  // const loginUser = props.loginUser

  const navigate = useNavigate();

  const goUpdate = () => {
    navigate("/users");
  };

  // 장르 //
  const genres = {
    1: "Pop",
    2: "Rock",
    3: "Hiphop",
    4: "Classic",
    5: "Jazz",
    6: "R&B",
    7: "Disco",
    8: "Electrionic",
    9: "Balad",
    10: "Country",
    11: "Reggae",
    12: "Folk",
    13: "Etc",
  };

  // 포지션 //
  const positions = {
    1: "보컬",
    2: "작곡",
    3: "작사",
    4: "세션",
    5: "믹싱",
    6: "기타",
  };

  useEffect(() => {
    setCurrentUser(props.currentUser);
    setCurrentUserPortfolio(props.currentUserPortfolio);
    setCurrentUserPosition(props.currentUserPosition);
    setCurrentUserGenre(props.currentUserGenre);
    setCurrentUserShorts(props.currentUserShorts);
    setLoginUser(props.loginUser);
    setLoginUserPortfolio(props.loginPortfolio);
  }, [props.currentUser, props.loginUser]);

  console.log("genre", currentUserGenre);
  console.log("position", currentUserPosition);

  useEffect(() => {
    const imgInfo = async () => {
      try {
        if (currentUserPortfolio.portfolio_picture_file_idx) {
          const response = await getImg(
            currentUserPortfolio.portfolio_picture_file_idx.fileIdx
          );
          // console.log(response)
          setImgURL(response.message);
        } else {
          setImgURL(defaultprofile);
        }
      } catch (err) {
        console.error(err);
      }
    };

    imgInfo();
    const followInfo = async () => {
      try {
        const response = await isFollow(currentUser.emailId);
        setIsFollowed(response);
      } catch (err) {
        // console.log(currentUser)
        // console.log(err)
      }
    };

    followInfo();
  }, [currentUser, currentUserPortfolio]);
  // console.log(currentUser)
  // console.log(currentUserPortfolio)
  // console.log(loginUser)
  // console.log(loginUserPortfolio)

  const handleFollow = async () => {
    if (loginUser && currentUser && loginUser.emailId !== currentUser.emailId) {
      try {
        await followUser(currentUser.emailId);
        setIsFollowed(!isFollowed);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 채팅 연결
  const [roomIdx, setRoomIdx] = useState("");
  const [otheruserid, setOtheruserid] = useState();

  const handleChat = async () => {
    const otheruserid = currentUser.userIdx;

    try {
      const response = await CreateChat({ otheruserid: otheruserid });
      console.log(response);
      setRoomIdx(response);
      navigate(`/message/${response}`);
      setOtheruserid("");
    } catch (err) {
      console.log(err);
    }
  };

  if (!loginUser || !currentUser || !currentUser.userIdx) {
    return (
      <div>
        <p>로딩 중...</p>
        <button
          onClick={() => console.log(currentUser.emailId === loginUser.emailId)}
        >
          51243
        </button>
        <button onClick={() => console.log(currentUser)}>1243</button>
        <button onClick={() => console.log(loginUser)}>lgue</button>
        <button onClick={() => console.log(loginUser.emailId)}>lgue</button>
        <button onClick={() => console.log(currentUser.emailId)}>123</button>
      </div>
    );
  }

  const instagramURL = currentUserPortfolio.instagram;
  const youtubeURL = currentUserPortfolio.youtube;

  const getImgURL = async () => {
    const response = await getImg(
      currentUserPortfolio.portfolio_picture_file_idx
    );
    console.log(response);
    setImgURL(response.data);
  };

  return (
    <>
      <Container>
        {currentUser.emailId === loginUser.emailId ? (
          <>
            <div className="main">
              <div className="header">
                <div className="userInfo">
                  <div className="image">
                    <Img
                      src={imgURL ? imgURL : defaultprofile}
                      alt="프로필 이미지"
                    />
                  </div>
                  <div className="name">
                    <Title>{loginUser.nickname}</Title>
                    <p style={{ marginBottom: "10px" }}>{loginUser.name}</p>
                    <p>{loginUserPortfolio.selfIntro}</p>
                  </div>
                </div>
                <DefaultButton
                  text={"Edit"}
                  backgroundcolor={"#6C7383"}
                  fontcolor={"white"}
                  width={"4rem"}
                  height={"2rem"}
                  onClick={goUpdate}
                />
              </div>
              <div className="genre">
                <span>Like genre : </span>
                <ul>
                  {currentUserGenre.map((genreId) =>
                    genres[genreId] ? (
                      <li key={genreId}>{genres[genreId]}</li>
                    ) : null
                  )}
                </ul>
              </div>
              <div className="position">
                <span>Position : </span>
                <ul>
                  {currentUserPosition.map((positionId) =>
                    positions[positionId] ? (
                      <li key={positionId}>{positions[positionId]}</li>
                    ) : null
                  )}
                </ul>
              </div>
              <div className="sns">
                <p>SNS</p>
                <URL
                  onClick={() => {
                    window.open(instagramURL);
                  }}
                  src={instagram}
                  alt="인스타그램"
                />
                <URL
                  onClick={() => {
                    window.open(youtubeURL);
                  }}
                  src={youtube}
                  alt="유튜브"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="header">
              <div className="userInfo">
                <div className="image">
                  <Img
                    src={
                      currentUserPortfolio.portfolio_picture_file_idx
                        ? currentUserPortfolio.portfolio_picture_file_idx
                        : defaultprofile
                    }
                    alt="프로필 이미지"
                  />
                </div>
                <div className="name">
                  <Title>{currentUser.nickname}</Title>
                  <p style={{ marginBottom: "10px" }}>{currentUser.name}</p>
                  <p>{currentUser.selfIntro}</p>
                </div>
              </div>
              <div className="buttons">
                <DefaultButton
                  text={"채팅하기"}
                  backgroundcolor={"#873ffa"}
                  width={"5rem"}
                  height={"2rem"}
                  onClick={handleChat}
                />
                <br />
                <DefaultButton
                  fontcolor={"white"}
                  text={isFollowed ? "Unfollow" : "Follow"}
                  backgroundcolor={isFollowed ? "#6C7383" : "#254ef8"}
                  width={"5rem"}
                  height={"2rem"}
                  onClick={handleFollow}
                />
              </div>
            </div>
            <div className="genre">
              <span>Like genre : </span>
              <ul>
                {currentUserGenre.map((genreId) =>
                  genres[genreId] ? (
                    <li key={genreId}>{genres[genreId]}</li>
                  ) : null
                )}
              </ul>
            </div>
            <div className="position">
              <span>Position : </span>
              <ul>
                {currentUserPosition.map((positionId) =>
                  positions[positionId] ? (
                    <li key={positionId}>{positions[positionId]}</li>
                  ) : null
                )}
              </ul>
            </div>
            <div className="sns">
              <p>SNS</p>
              <URL
                onClick={() => {
                  window.open(instagramURL);
                }}
                src={instagram}
                alt="인스타그램"
              />
              <URL
                onClick={() => {
                  window.open(youtubeURL);
                }}
                src={youtube}
                alt="유튜브"
              />
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export default UserEdit;

const Container = styled.div`
  flex: 2;
  padding: 1rem;
  margin: 20px;
  display: flex;
  flex-direction: column;
  background-color: #202c44;
  border-radius: 20px;
  color: white;

  .header {
    display: flex;
    justify-content: space-between;
  }

  .image {
    display: flex;
  }

  .userInfo {
    display: flex;
  }

  .name {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
  }

  .genre {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .sns {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
  }

  .btn-wrapper {
    align-self: flex-end;
  }
`;

const Title = styled.h3`
  margin-bottom: 10px;
  font-weight: bold;
`;

const Img = styled.img`
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  border: 2px solid white;
`;

const URL = styled.img`
  width: 23px;
  height: 23px;
  padding-right: 2%;
  margin-left: 10px;

  &:hover {
    cursor: pointer;
  }
`;
