import './App.css'
import { RouterProvider } from "react-router-dom";
import router from "./routers/index.jsx";
import { Provider } from "react-redux"
import store from './features/index.js';

function App() {
  return <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>;
}

export default App;