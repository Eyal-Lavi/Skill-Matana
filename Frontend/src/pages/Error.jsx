import { Link, useRouteError } from "react-router-dom";
import styles from "./Error.module.scss";

function Error() {
  const error = useRouteError();
  const status = error?.status || 404;
  const message = error?.statusText || "Sorry, the page you're looking for doesn't exist.";

  return (
    <div className={styles.errorPage}>
      <div className={styles.card}>
        <h1>Error {status}</h1>
        <p>{message}</p>
        <Link to="/">Go back home</Link>
        <img
          src={getImageForStatus(status)}
          alt="Error illustration"
          className={styles.image}
        />
      </div>
    </div>
  );
}

function getImageForStatus(status) {
  if (status === 404) {
    return "/error_404.jpg";
  }
  return "/error_generic.jpg";
}

export default Error;
