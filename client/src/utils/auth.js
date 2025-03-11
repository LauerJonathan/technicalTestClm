function isTokenPresent() {
  // Vérifier si le token existe dans le localStorage
  const token = localStorage.getItem("token");
  // Retourner true si le token est trouvé, sinon false
  return token !== null;
}
export { isTokenPresent };
