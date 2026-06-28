import { Switch, Route, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import QuizSetupPage from '@/pages/QuizSetupPage';
import QuizPage from '@/pages/QuizPage';
import ResultPage from '@/pages/ResultPage';
import AdminPage from '@/pages/AdminPage';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/category/:categoryId" component={CategoryPage} />
        <Route path="/category/:categoryId/module/:moduleId/setup" component={QuizSetupPage} />
        <Route path="/quiz" component={QuizPage} />
        <Route path="/result" component={ResultPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </ThemeProvider>
  );
}

export default App;
