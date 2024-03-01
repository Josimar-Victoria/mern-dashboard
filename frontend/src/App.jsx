import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { About, Dashboard, Home, Projects, SignIn, SignUp } from './pages';


export default function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      {/* <Header /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        {/* <Route path='/search' element={<Search />} /> */}
        {/* <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route> */}
        {/* <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route> */}

        <Route path='/projects' element={<Projects />} />
        {/* <Route path='/post/:postSlug' element={<PostPage />} /> */}
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}