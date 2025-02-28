import { useState, useRef } from "react";
import { app, authentication } from "../../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import "./LogInMethods.css";
import styled from "styled-components";
import google from "./Google.png";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser, setUserInfo, postUsuario } from "../../Redux/actions";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";

const Container = styled.div`
  background-image: url("https://i.blogs.es/b92620/cafe-cafeina/840_560.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  font-family: Poppins;
  height: 90vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: cover;
  @media screen and (max-width: 1000px) {
    height: 70vh;
  }
  @media screen and (max-width: 560px) {
    flex-direction: column;
    margin-top: 5px;
  }
`;

const SignIn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #36885ed1;
  border-radius: 20px 0px 0px 20px;
  width: 35%;
  height: 75vh;
  @media screen and (max-width: 1000px) {
    justify-content: start;
    height: 60vh;
    border-radius: 20px 0px 0px 20px;
  }
  @media screen and (max-width: 560px) {
    width: 85%;
    height: auto;
    border-radius: 20px;
    margin-top: 40px;
  }
  @media screen and (max-width: 350px) {
    width: 85%;
    height: auto;
    border-radius: 20px;
  }
`;

const SignUp = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: white;
  border-radius: 0px 20px 20px 0px;
  width: 45%;
  height: 75vh;
  @media screen and (max-width: 1000px) {
    justify-content: start;
    height: 60vh;
    border-radius: 0px 20px 20px 0px;
  }
  @media screen and (max-width: 560px) {
    margin: 10px;
    width: 85%;
    height: auto;
    border-radius: 20px;
  }
  @media screen and (max-width: 350px) {
    width: 85%;
    height: auto;
    border-radius: 20px;
  }
`;

const Titulo = styled.h1`
  position: absolute;
  top: 10px;
  text-align: center;
  font-size: 30px;
  font-family: Poppins;
  font-weight: bold;
  color: ${(props) => props.color};
  margin: 2rem;
  @media screen and (max-width: 1000px) {
    position: relative;
    font-size: 25px;
    height: 10%;
    top: 5px;
    margin: 0rem;
  }
  @media screen and (max-width: 560px) {
    position: relative;
    font-size: 15px;
    height: 10%;
    top: 5px;
  }
  @media screen and (max-width: 350px) {
    position: relative;
    font-size: 12px;
    top: 5px;
    height: 10%;
  }
`;

const Parrafo = styled.p`
  margin: 20px;
  @media screen and (max-width: 560px) {
    display: none;
  }
`;
const ParrafoRegistro = styled.p`
  margin: 10px;
  @media screen and (max-width: 1000px) {
    margin: 7px;
  }
  @media screen and (max-width: 560px) {
    margin: 4px;
    font-size: 12px;
  }
`;

const Apps = styled.div`
  width: 50%;
  margin: 20px;
  @media screen and (max-width: 560px) {
    margin: 8px;
  }
`;

const BotonGoogle = styled.img`
  width: 30px;
  cursor: pointer;
  @media screen and (max-width: 1200px) {
    width: 20px;
  }
  @media screen and (max-width: 560px) {
    width: 20px;
  }
`;

const Boton = styled.button`
  background-color: ${(props) => props.backgroundColor};
  width: 140px;
  height: 40px;
  border: none;
  position: absolute;
  bottom: 40px;
  color: ${(props) => props.color};
  border-radius: 6px;
  font-size: 16px;
  margin: 10px 0px;
  cursor: pointer;
  font-family: Poppins;
  @media screen and (max-width: 1000px) {
    position: relative;
    bottom: 0px;
  }
  @media screen and (max-width: 560px) {
    position: relative;
    width: 130px;
    height: 25px;
    bottom: 0px;
  }
  @media screen and (max-width: 350px) {
    postition: relative;
    margin: 0px;
    width: 130px;
    height: 25px;
    font-size: 13px;
    margin-bottom: 5px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 560px) {
    flex-direction: column;
  }
`;

const NombreContainer = styled.div`
  display: flex;
  flex-direction: row;
  justifycontent: space-between;
  width: 80%;
`;

const Error = styled.p`
  position: absolute;
  bottom: -15px;
  font-weigth: 600;
  left: 5px;
  color: #ff000091;
  font-size: 13px;
`;

export default function Login({ setUser }) {
  const [isSignUp, setIsSignUp] = useState(false),
    [flag, setFlag] = useState({}),
    [error, setError] = useState({ login: {}, signUp: {} });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const emailLRef = useRef(null);
  const passLRef = useRef(null);

  const handleChange = (e) => {
    setFlag({
      ...flag,
      [e.target.name]: e.target.value,
    });
  };

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    signInWithPopup(authentication, provider).then(async (res) => {
      const user = { ...res.user };

      await axios
        .get("https://proyecto-final-gp1.herokuapp.com/usuarios")
        .then(
          (res) => res.data.filter((usuario) => usuario.mail === user.email)[0]
        )
        .then((res) => {
          user.rol = res.isAdmin ? "admin" : "user";
          user.visualizacion = res.isAdmin ? "admin" : "user";
        })
        .catch(() => {
          user.rol = "user";
          user.visualizacion = "user";
        });

      localStorage.setItem("user", JSON.stringify(user));

      dispatch(setUserInfo(user));

      setUser(user);
      dispatch(getUser(user.email));

      // Definimos si vienen desde la pagina o si pegaron el Link
      location.key === "default" ? navigate("/") : navigate(-1);
    });
  };

  const createUser = (mail, pass, nombre, apellido) => {
    app
      .auth()
      .createUserWithEmailAndPassword(mail, pass)
      .then((res) => {
        res.user
          .updateProfile({
            displayName: nombre,
          })
          .then(() => {
            const user = { ...res.user };
            const body = {
              id: res.user.uid,
              nombre,
              apellido,
              contraseña: pass,
              mail,
            };

            user.displayName = `${nombre} ${apellido}`;
            user.rol = "user";
            user.visualizacion = "user";
            user.email = res.user.email;
            user.uid = res.user.uid;

            localStorage.setItem("user", JSON.stringify(user));

            dispatch(setUserInfo(user));

            setUser(user);
            dispatch(getUser(mail));

            dispatch(postUsuario(body));

            // Definimos si vienen desde la pagina o si pegaron el Link
            location.key === "default" ? navigate("/") : navigate(-1);
          });
      });
  };

  const logIn = (mail, pass) => {
    app
      .auth()
      .signInWithEmailAndPassword(mail, pass)
      .then(async (res) => {
        const user = { ...res.user.multiFactor.user };

        await axios
          .get("https://proyecto-final-gp1.herokuapp.com/usuarios")
          .then(
            (res) =>
              res.data.filter((usuario) => usuario.mail === user.email)[0]
          )
          .then((res) => {
            user.rol = res.isAdmin ? "admin" : "user";
            user.visualizacion = res.isAdmin ? "admin" : "user";
          })
          .catch(() => {
            user.rol = "user";
            user.visualizacion = "user";
          });

        localStorage.setItem("user", JSON.stringify(user));

        dispatch(getUser(mail));

        dispatch(setUserInfo(user));

        setUser(user);

        // Definimos si vienen desde la pagina o si pegaron el Link
        location.key === "default" ? navigate("/") : navigate(-1);
      })
      .catch(() => {
        setError({
          ...error,
          login: { contraseña: "usuario o contraseña no valido" },
        });
        console.log(error);
      });
  };

  const validateSubmit = (props) => {
    let errors = { login: {}, signUp: {} };

    if (props.type) {
      if (!props.nombre) {
        errors.signUp.nombre = "Debés ingresar tu nombre";
      }

      if (!props.apellido) {
        errors.signUp.apellido = "Necesitamos tu apellido";
      }

      if (!props.mail) {
        errors.signUp.correo = "El mail no puede ir vacío";
      }

      if (!props.pass) {
        errors.signUp.contraseña = "Ingresá una contraseña segura";
      }
    } else {
      if (!props.mailL) {
        errors.login.correo = "Ingresá tu correo";
      }

      if (!props.passL) {
        errors.login.contraseña = "Y ahora tu contraseña";
      }
    }

    return errors;
  };

  const handleNoEmail = (props) => {
    Swal.fire({
      title: "Ingresar correo",
      text: "Correo es obligatorio para reestablecer contraseña",
      icon: "warning",
      iconColor: "red",
      color: "#222",
      confirmButtonColor: "grey",
      confirmButtonText: "Aceptar",
    });
  };

  const handleForgotPass = (e) => {
    e.preventDefault();

    const email = emailLRef.current.value;

    if (email) {
      sendPasswordResetEmail(authentication, email).then(() => {
        emailLRef.current.value = "";

        Swal.fire({
          title: "Mail enviado",
          text: "Revisa tu correo para reestablecer la contraseña",
          icon: "success",
          iconColor: "green",
          color: "#222",
          confirmButtonColor: "grey",
          confirmButtonText: "Aceptar",
        });
      });
    } else {
      handleNoEmail();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mail = emailRef.current.value;
    const pass = passRef.current.value;
    const nombre = nombreRef.current.value;
    const apellido = apellidoRef.current.value;
    const mailL = emailLRef.current.value;
    const passL = passLRef.current.value;

    if (isSignUp) {
      if (mail && pass && nombre && apellido) {
        createUser(mail, pass, nombre, apellido);
      } else {
        setError(validateSubmit({ mail, pass, nombre, apellido, type: true }));
      }
    } else {
      if (mailL && passL) {
        logIn(mailL, passL);
      } else {
        setError(validateSubmit({ mailL, passL, type: false }));
      }
    }
  };

  return (
    <Container>
      <SignIn>
        <Titulo color="white" className="titulo-login">
          Bienvenido!
        </Titulo>

        <Form onSubmit={handleSubmit}>
          <Parrafo>
            Para continuar conectado con nosotros ingresá con tu cuenta
          </Parrafo>

          <Boton
            onClick={() => setIsSignUp(false)}
            color="black"
            backgroundColor="white"
            type="submit"
          >
            Iniciar Sesion
          </Boton>

          <div className="grupo-login">
            <input
              className="input-login"
              type="email"
              id="emailLField"
              name="correo"
              ref={emailLRef}
              onChange={handleChange}
              placeholder=" "
            />
            <span className="barra-login"></span>
            <label className="label-login" htmlFor="emailLField">
              Correo
            </label>
            {error.login.correo && <Error>{error.login.correo}</Error>}
          </div>

          <div className="grupo-login">
            <input
              className="input-login"
              type="password"
              id="passwordLField"
              name="contraseña"
              ref={passLRef}
              onChange={handleChange}
              placeholder=" "
            />
            <span className="barra-login"></span>
            <label className="label-login" htmlFor="passwordLField">
              Contraseña
            </label>
            {error.login.contraseña && <Error>{error.login.contraseña}</Error>}
          </div>

          <div className="barra-login">
            <p
              style={{ cursor: "pointer", margin: "5px" }}
              onClick={handleForgotPass}
            >
              Forgot Password?
            </p>
          </div>
        </Form>
      </SignIn>

      <SignUp onSubmit={handleSubmit}>
        <Titulo color="#36885ed1" className="titulo-login">
          Crear Cuenta
        </Titulo>

        <Apps>
          <BotonGoogle src={google} onClick={googleSignIn} />
        </Apps>
        <ParrafoRegistro>O registrate con tu correo</ParrafoRegistro>

        <Form style={{ margin: "0px 0px 40px 0px" }} onSubmit={handleSubmit}>
          <NombreContainer>
            <div className="grupo-login" style={{ width: "50%" }}>
              <input
                className="input-login"
                type="text"
                id="nombreField"
                name="nombre"
                ref={nombreRef}
                onChange={handleChange}
                placeholder=" "
              />
              <span className="barra-login"></span>
              <label className="label-login" htmlFor="nombreField">
                Nombre
              </label>

              {error.signUp.nombre && <Error>{error.signUp.nombre}</Error>}
            </div>

            <div className="grupo-login" style={{ width: "150px" }}>
              <input
                className="input-login"
                type="text"
                id="apellidoField"
                name="apellido"
                ref={apellidoRef}
                onChange={handleChange}
                placeholder=" "
              />
              <span className="barra-login"></span>
              <label className="label-login" htmlFor="apellidoText">
                Apellido
              </label>

              {error.signUp.apellido && <Error>{error.signUp.apellido}</Error>}
            </div>
          </NombreContainer>

          <div className="grupo-login">
            <input
              className="input-login"
              type="email"
              id="emailField"
              name="correo"
              ref={emailRef}
              onChange={handleChange}
              placeholder=" "
            />
            <span className="barra-login"></span>
            <label className="label-login" htmlFor="emailField">
              Correo
            </label>

            {error.signUp.correo && <Error>{error.signUp.correo}</Error>}
          </div>

          <div className="grupo-login">
            <input
              className="input-login"
              type="password"
              id="passwordField"
              name="contraseña"
              ref={passRef}
              onChange={handleChange}
              placeholder=" "
            />
            <span className="barra-login"></span>
            <label className="label-login" htmlFor="passwordField">
              Contraseña
            </label>

            {error.signUp.contraseña && (
              <Error>{error.signUp.contraseña}</Error>
            )}
          </div>
        </Form>

        <Boton
          color="white"
          backgroundColor="#36885eeb"
          className="boton-logedinmethods"
          onClick={() => setIsSignUp(true)}
        >
          Registrarse
        </Boton>
      </SignUp>
    </Container>
  );
}
