import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";
import { Global } from "../../helpers/Global";
import { UserList } from "../user/UserList";


export const Followers = () => {

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const [userProfile, setUserProfile] = useState({});
    const params = useParams();


  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setUserProfile);
  }, []);

  const getUsers = async (nextPage = 1) => {
    //efecto de carga
    setLoading(true);

    //Sacar userId de la url
    const userId = params.userId;

    //Peticion para sacar usuarios
    const request = await fetch(Global.url + "follow/followers/" + userId+"/"+nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "applcation/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    let cleanUsers = [];

    //Recorrer y limpiar follows para quedarme con followed
    data.follows.forEach(follow =>{
        cleanUsers = [...cleanUsers, follow.user];
    });
    data.users = cleanUsers;

    //Crear un estado para poder listarlos
    if (data.users && data.status === "success") {
      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }
      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);
      //Paginación
      if (users.length >= (data.total - data.users.length)) {
        setMore(false);
      }
    }
  };

 



  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Seguidores de  {userProfile.name} {userProfile.surname}</h1>
      </header>

     <UserList users={users} getUsers={getUsers} following={following}
                setFollowing={setFollowing}
                more={more} loading={loading}
                page={page} setPage={setPage}/>
     
      <br />
    </>
  );
};
