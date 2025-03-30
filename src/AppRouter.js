import { BrowserRouter, Routes, Route } from "react-router-dom"
import PostListPage from "./pages/community/PostListPage"
import PostDetailPage from "./pages/community/PostDetailPage"
import EditPostPage from "./pages/community/EditPostPage"
import WritePostPage from "./pages/community/WritePostPage"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/community" element={<PostListPage />} />
        <Route path="/community/write" element={<WritePostPage />} />
        <Route path="/community/post/:id" element={<PostDetailPage />} />
        <Route path="/community/edit/:id" element={<EditPostPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

