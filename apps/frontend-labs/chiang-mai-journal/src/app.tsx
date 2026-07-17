import { Navigate, Route, Routes } from 'react-router'
import { ArticlePage } from './pages/article-page'
import { HomePage } from './pages/home-page'

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/stories/city-lettering" element={<ArticlePage />} />
    <Route path="*" element={<Navigate replace to="/" />} />
  </Routes>
)

export { App }
