import { useModStore } from "./state/modStore";
import { ModeSelector } from "./components/ModeSelector";
import { SimpleLayout } from "./components/SimpleMode/SimpleLayout";
import { AdvancedLayout } from "./components/AdvancedMode/AdvancedLayout";

function App() {
  const { mode } = useModStore();

  if (!mode) {
    return <ModeSelector />;
  }

  return mode === "simple" ? <SimpleLayout /> : <AdvancedLayout />;
}

export default App;
