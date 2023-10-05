import {MainComp} from './components/Main';
import {BrowserRouter} from "react-router-dom"
import {QueryClient, QueryClientProvider} from "react-query"


const queryClient=new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <MainComp/>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;


