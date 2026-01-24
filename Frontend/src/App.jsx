import './App.css'
import { RouterProvider } from "react-router-dom";
import router from "./routers/index.jsx";
import { Provider } from "react-redux"
import store from './features/index.js';
import { ToastProvider } from "./contexts/ToastContext.jsx";
import { ConfirmProvider } from "./contexts/ConfirmContext.jsx";

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </ToastProvider>
    </Provider>
  );
}

export default App;