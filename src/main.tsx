import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Component, ReactNode } from "react";

class ErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: any) {
    console.error("React crash:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding: 40, fontFamily: "monospace", background: "#fff1f0", color: "#c0392b", border: "2px solid #e74c3c", borderRadius: 8, margin: 20}}>
          <h2 style={{marginTop:0}}>⚠️ App crashed — error details:</h2>
          <pre style={{whiteSpace: "pre-wrap", wordBreak: "break-all"}}>{this.state.error.message}\n\n{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
