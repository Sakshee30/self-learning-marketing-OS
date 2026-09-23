import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "../ui";

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string | undefined };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: undefined };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("GrowthOS render failure", {
      error,
      componentStack: info.componentStack
    });
  }

  private reset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="GrowthOS hit a rendering error"
          description={this.state.message ?? "The interface failed safely. No autonomous action was executed."}
          onRetry={this.reset}
        />
      );
    }

    return this.props.children;
  }
}
