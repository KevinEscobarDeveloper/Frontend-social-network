import React from "react";
import { useState } from "react";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";

export const Login = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");
  const {setAuth} = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();

    //Datos del formulario
    let userToLogin = form;

    // Peticion al backend
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    //Persistir los datos en el navegador
    if (data.status == "success") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSaved("Login");

      //Set datos en el auth
      setAuth(data.user);
      //Redirección
      setTimeout(() => {
        window.location.reload();
      },1500)

    } else {
      setSaved("Error");
    }
  };
  return (
    <>
      {saved === "Login" ? (
        <strong className="alert alert-success">
          Identificado correctamente
        </strong>
      ) : (
        ""
      )}
      {saved === "Error" ? (
        <strong alert alert-danger>
          No se ha identificado
        </strong>
      ) : (
        ""
      )}
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>
      <div className="content__posts">
        <form className="form-login" onSubmit={loginUser}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed} />
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input
            type="submit"
            value="Identificate"
            className="btn btn-success"
          />
        </form>
      </div>
    </>
  );
};
