import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Layout from "@/pages/Layout";
import Home from "@/pages/Home";
import AuthPage from "@/pages/AuthPage";
import SectionView from "@/pages/SectionView";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <ProtectedRoute
        path="/"
        component={() => (
          <Layout>
            <Home />
          </Layout>
        )}
      />
      <ProtectedRoute
        path="/prosper"
        component={() => (
          <Layout>
            <SectionView section="prosper" />
          </Layout>
        )}
      />
      <ProtectedRoute
        path="/bankermart"
        component={() => (
          <Layout>
            <SectionView section="bankermart" />
          </Layout>
        )}
      />
      <ProtectedRoute
        path="/time"
        component={() => (
          <Layout>
            <SectionView section="time" />
          </Layout>
        )}
      />
      <Route path="/auth">
        <AuthPage />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}