import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/NavBar.css";

const NavBar = ({ folderChange }) => {
  function handleClickHome() {
    folderChange("/Volumes/Cloud/Home/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="#" onClick={handleClickHome}>
          <span className="logo">Own-Cloud</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleClickHome}>
                {" "}
                Meine Dateien
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Papierkorb
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Einstellungen
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
