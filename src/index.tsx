import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import "./AxiosConfig";
import Loading from "./components/Loading";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <GoogleOAuthProvider
    clientId={process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID || ""}
  >
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Provider store={store}>
        <ToastContainer position="bottom-right" />
        <App />
      </Provider>
      <Loading />
    </ThemeProvider>
  </GoogleOAuthProvider>
);

reportWebVitals();
