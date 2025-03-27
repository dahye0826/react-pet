"use client"

import { useState, useEffect } from "react"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "./PostListPage.css"
import { mockPosts } from "./mockData"

function PostListPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 로그인 상태 관리
  const [searchTerm, setSearchTerm] = useState("")

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <>
      {/* 네비게이션 바 */}
      <nav className="navbar navbar-expand-lg navbar-light mb-4">
        <div className="container">
          <a className="navbar-brand" href="/">
            <i className="bi bi-house-heart me-2"></i>
            반려동물지도
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <i className="bi bi-map me-1"></i>
                  지도
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/community">
                  <i className="bi bi-people me-1"></i>
                  커뮤니티
                </a>
              </li>
            </ul>

            {/* 로그인 상태에 따라 다른 메뉴 표시 */}
            <div className="d-flex">
              {isLoggedIn ? (
                <>
                  <a href="/mypage" className="btn me-2">
                    <i className="bi bi-person-circle me-1"></i>
                    마이페이지
                  </a>
                  <button className="btn logout-btn">
                    <i className="bi bi-box-arrow-right me-1"></i>
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="btn me-2">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    로그인
                  </a>
                  <a href="/signup" className="btn btn-primary">
                    <i className="bi bi-person-plus me-1"></i>
                    회원가입
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-4 custom-table">
        <div className="review-header text-center">
          <h2 className="mb-4">REVIEW</h2>
          <p className="mb-4">반려동물과 함께한 소중한 추억을 공유해주세요</p>
          <p className="subtitle mb-5">당신의 특별한 순간들이 다른 반려인들에게 영감이 될 수 있어요</p>
        </div>

        <div className="search-container mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="제목 검색..."
              aria-label="제목 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="btn btn-primary" type="button" onClick={handleSearch}>
              <i className="bi bi-search"></i>
            </button>
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

        <div className="d-flex justify-content-between mt-4">
          <div>
            <button className="btn btn-outline-secondary me-2">
              <i className="bi bi-arrow-left"></i> 이전
            </button>
            <button className="btn btn-outline-secondary">
              다음 <i className="bi bi-arrow-right"></i>
            </button>
          </div>
          <button className="btn btn-primary">
            <i className="bi bi-pencil-square me-1"></i> 글쓰기
          </button>
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            style={{ fontSize: "0.8rem" }}
          >
            테스트: {isLoggedIn ? "로그아웃 상태로 변경" : "로그인 상태로 변경"}
          </button>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="footer mt-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <h5 className="footer-title">
                <i className="bi bi-house-heart me-2"></i>
                반려동물지도
              </h5>
              <p className="footer-description mt-3">
                반려동물과 함께하는 모든 순간을 더 특별하게 만들어주는 공간입니다. 다양한 장소 정보와 경험을 공유하며 더
                행복한 반려생활을 만들어가요.
              </p>
            </div>

            <div className="col-lg-3 mb-4 mb-lg-0">
              <h5 className="footer-subtitle">바로가기</h5>
              <ul className="footer-links">
                <li>
                  <a href="/">
                    <i className="bi bi-map me-2"></i>지도
                  </a>
                </li>
                <li>
                  <a href="/community">
                    <i className="bi bi-people me-2"></i>커뮤니티
                  </a>
                </li>
                <li>
                  <a href="/mypage">
                    <i className="bi bi-person-circle me-2"></i>마이페이지
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-4 mb-4 mb-lg-0">
              <h5 className="footer-subtitle">문의하기</h5>
              <ul className="footer-contact">
                <li>
                  <i className="bi bi-envelope me-2"></i>petmap@example.com
                </li>
                <li>
                  <i className="bi bi-telephone me-2"></i>02-123-4567
                </li>
                <li>
                  <i className="bi bi-geo-alt me-2"></i>서울시 강남구 테헤란로 123
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom mt-4 pt-3">
            <div className="row">
              <div className="col-md-6 mb-2 mb-md-0">
                <p className="copyright">© 2023 반려동물지도. All rights reserved.</p>
              </div>
              <div className="col-md-6 text-md-end">
                <a href="/terms" className="footer-bottom-link me-3">
                  이용약관
                </a>
                <a href="/privacy" className="footer-bottom-link">
                  개인정보처리방침
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default PostListPage
