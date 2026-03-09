import "./App.css";
import { useLeadGenerator } from "./hooks/useLeadGenerator";
import { Header } from "./components/Header";
import { LeadForm } from "./components/LeadForm";
import { ErrorBox } from "./components/ErrorBox";
import { ResultBox } from "./components/ResultBox";

function App() {
  const { url, setUrl, email, loading, error, generateLead } =
    useLeadGenerator();

  return (
    <div className="container">
      <Header />
      <LeadForm
        url={url}
        onUrlChange={setUrl}
        onSubmit={generateLead}
        loading={loading}
      />
      <ErrorBox message={error} />
      <ResultBox email={email} hasError={!!error} />
    </div>
  );
}

export default App;
