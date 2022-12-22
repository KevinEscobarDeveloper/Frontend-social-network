import React, { useEffect } from "react";
import { useState } from "react";
import avatar from "../../assets/img/user.png";
import { GetProfile } from "../../helpers/GetProfile";
import { useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../publication/PublicationList";

export const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const params = useParams();
  const [ifollow, setiFollow] = useState(false);
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [counters, setCounters] = useState({});

  useEffect(() => {
    getDataUser();
    getCounters();
    setMore(true);
    getPublications(1, true);
  }, []);

  useEffect(() => {
    getDataUser();
    getCounters();
    getPublications(1, true);
  }, [params]);



  const getDataUser = async () => {
    let dataUser = await GetProfile(params.userId, setUser);
    if (dataUser.following && dataUser.following._id) setiFollow(true);
  };
  const getCounters = async () => {
    const request = await fetch(Global.url + "user/counters/" + params.userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.following) {
      setCounters(data);
    }
  };

  const follow = async (userId) => {
    // Peticion al backend para guardar el follow
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();
    //Cuando este todo correcto
    if (data.status === "success") {
      //Actualizar estado de following, agregando el nuevo follow
      setiFollow(true);
    }
  };

  const unFollow = async (userId) => {
    // Peticion al backend para borrar el follow
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();
    //Cuando este todo correcto
    if (data.status === "success") {
      setiFollow(false);
    }
  };

  const getPublications = async (nextPage = 1, newProfile = false) => {
    const request = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await request.json();

    if (data.status === "success") {
      let newPublications = data.publications;
      if (!newProfile && publications.length >= 1) {
        newPublications = [...publications, ...data.publications];
      }

      if(newProfile) {
        let newPublications = data.publications;
        setMore(true);
        setPage(1);
      }
      setPublications(newPublications);

      if (!newProfile && publications.length >= data.total - data.publications.length) {
        setMore(false);
      }

      if(data.pages <= 1){
        setMore(false);
      }
    }
  };




  return (
    <>
      <header className="aside__profile-info">
        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            {user.image != "default.png" && (
              <img
                src={Global.url + "user/avatar/" + user.image}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
            {user.image == "default.png" && (
              <img
                src={avatar}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
          </div>

          <div className="general-info__container-names">
            <div className="container-names__name">
              <h1>
                {user.name} {user.surname}
              </h1>
              {user._id != auth._id &&
                (ifollow ? (
                  <button
                    onClick={() => unFollow(user._id)}
                    className="content__button content__button--right post__button"
                  >
                    Dejar de seguir
                  </button>
                ) : (
                  <button
                    onClick={() => follow(user._id)}
                    className="content__button content__button--right"
                  >
                    Seguir
                  </button>
                ))}
            </div>
            <h2 className="container-names__nickname">{user.nick}</h2>
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="profile-info__stats">
          <div className="stats__following">
            <Link
              to={"/social/siguiendo/" + user._id}
              className="following__link"
            >
              <span className="following__title">Siguiendo</span>
              <span className="following__number">
                {counters.following >= 1 ? counters.following : 0}
              </span>
            </Link>
          </div>
          <div className="stats__following">
            <Link
              to={"/social/seguidores/" + user._id}
              className="following__link"
            >
              <span className="following__title">Seguidores</span>
              <span className="following__number">
                {counters.followed >= 1 ? counters.followed : 0}
              </span>
            </Link>
          </div>

          <div className="stats__following">
            <Link to={"/social/perfil/" + user._id} className="following__link">
              <span className="following__title">Publicaciones</span>
              <span className="following__number">
                {counters.publications >= 1 ? counters.publications : 0}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <PublicationList 
        publications = {publications}
        page = {page}
        setPage= {setPage}
        more = {more}
        setMore = {setMore}
        getPublications = {getPublications}
      />
      
    </>
  );
};
