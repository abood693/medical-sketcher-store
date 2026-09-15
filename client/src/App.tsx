import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import LegalPage from "@/pages/LegalPage";
import OwnerStudio from "@/pages/OwnerStudio";
import Downloads from "@/pages/Downloads";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function OwnerRoute() {
  return <OwnerStudio />;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><CartProvider><Toaster /><Switch><Route path="/" component={Home} /><Route path="/admin" component={OwnerRoute} /><Route path="/downloads" component={Downloads} /><Route path="/terms" component={() => <LegalPage type="terms" />} /><Route path="/privacy" component={() => <LegalPage type="privacy" />} /><Route path="/ar/terms" component={() => <LegalPage type="terms" />} /><Route path="/ar/privacy" component={() => <LegalPage type="privacy" />} /><Route path="/de/terms" component={() => <LegalPage type="terms" />} /><Route path="/de/privacy" component={() => <LegalPage type="privacy" />} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></CartProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
