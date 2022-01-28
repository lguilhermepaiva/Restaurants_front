async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const dataRequest = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ email, password }),
  };
  try {
    const response = await fetch("http://localhost:3333/user", dataRequest);
    const data = await response.json();
    if (data.status === 0) {
      if (
        document.getElementById("divErrorLogin").classList.contains("d-none")
      ) {
        document.getElementById("divErrorLogin").classList.toggle("d-none");
      }
      return false;
    }
    localStorage.setItem("token_jwt", "Bearer ".concat(data.token));
    document.getElementById("formLogin").submit();
    return true;
  } catch (error) {
    console.error(error);
  }
}
