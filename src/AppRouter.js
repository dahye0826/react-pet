import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostListPage from './pages/community/PostListPage';
import PostDetailPage from './pages/community/PostDetailPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/community" element={<PostListPage />} />
        <Route path="/community/write" element={<PostDetailPage />} />
        {/* 다른 페이지들도 여기 추가 */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;