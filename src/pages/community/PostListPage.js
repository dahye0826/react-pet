"use client"
import { Navigate, useNavigate} from "react-router-dom"
import { useState, useEffect } from "react"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "./PostListPage.css"
import { mockPosts } from "./mockData"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function PostListPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 로그인 상태 관리
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch posts from backend
    const fetchPosts = async () => {
      try {
        setLoading(true)
        // 실제 API 연결 시 아래 주석을 해제하세요
        // const response = await axios.get('/api/posts');
        // setPosts(response.data);

        // 테스트용 목업 데이터
        setTimeout(() => {
          // 날짜 형식 확인 - 시간 제거
          const formattedPosts = mockPosts.map((post) => ({
            ...post,
            createdAt: post.createdAt.split(" ")[0], // 날짜 부분만 사용
          }))
          setPosts(formattedPosts)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching posts:", error)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    // 실제 구현에서는 API 호출로 대체
    setLoading(true)
    setTimeout(() => {
      const filteredPosts = mockPosts
        .filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((post) => ({
          ...post,
          createdAt: post.createdAt.split(" ")[0], // 날짜 부분만 사용
        }))
      setPosts(filteredPosts)
      setLoading(false)
    }, 300)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <>
      {/* 네비게이션 바 컴포넌트 */}
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="container mt-4 custom-table">
        <div className="review-header text-center">
          <h2 className="mb-4">우리의 발자국 이야기</h2>
          <p className="subtitle mb-5">반려동물과 함께 떠난 소중한 시간을 남겨보세요.</p>
        </div>

        <div className="search-container mb-4">
          <div className="d-flex align-items-center position-relative">
            {/* 글쓰기 버튼 - 왼쪽 고정 */}
            <div className="position-absolute start-0">
              <button className="btn btn-primary write-btn" 
              onClick={()=> navigate("/community/wirte")}>
                <i className="bi bi-pencil-square me-1"></i> 글쓰기
              </button>
            </div>

            {/* 제목 검색 - 가운데 정렬 */}
            <div className="input-group w-50 mx-auto">
              <input
                type="text"
                className="form-control"
                placeholder="제목 검색..."
                aria-label="제목 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-primary" type="button" onClick={handleSearch}>
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="post-list-container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-list-item p-3 border-bottom">
                <h5 className="mb-1">{post.title}</h5>
                <p className="text-muted small mb-1">{post.preview}</p>

                <div className="d-flex justify-content-between text-muted small">
                  <div className="d-flex">
                    <span className="me-2">{post.author}</span>
                    <span className="me-3">{post.createdAt}</span>
                    <span>
                      <i className="bi bi-chat-left-text me-1"></i> {post.commentCount}
                    </span>
                  </div>
                  <div>
                    <i className="bi bi-eye me-1"></i> {post.viewCount}
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <div>
            <button className="btn btn-outline-secondary me-2">
              <i className="bi bi-arrow-left"></i> 이전
            </button>
            <button className="btn btn-outline-secondary">
              다음 <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="text-end mt-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            style={{ fontSize: "0.8rem" }}
          >
            테스트: {isLoggedIn ? "로그아웃 상태로 변경" : "로그인 상태로 변경"}
          </button>
        </div>
      </div>

      {/* 푸터 컴포넌트 */}
      <Footer />
    </>
  )
}

export default PostListPage

