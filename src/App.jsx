import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./components/Player";
import { Toaster } from "sonner";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
            <AppRouter />
            <Toaster position="top-center" richColors />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;