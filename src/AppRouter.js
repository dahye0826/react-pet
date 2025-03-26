import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostListPage from './pages/community/PostListPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/community" element={<PostListPage />} />
        {/* 다른 페이지들도 여기 추가 */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;