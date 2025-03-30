"use client"

import { useNavigate } from "react-router-dom"
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
  const [isAdmin, setIsAdmin] = useState(true) // 관리자 모드 (테스트를 위해 기본값 true)
  const [showReportList, setShowReportList] = useState(true) // 신고 목록 표시 여부 (기본값 true로 변경)
  const navigate = useNavigate()

  // 페이징 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5) // 테스트용 총 페이지 수

  // 테스트용 신고 데이터
  const [reportedPosts, setReportedPosts] = useState([
    {
      postId: 1,
      title: "강아지랑 부산여행",
      author: "멍멍맘",
      reportCount: 2,
      reports: [
        { reason: "부적절한 내용", count: 1 },
        { reason: "기타", count: 1 },
      ],
    },
    {
      postId: 3,
      title: "반려견 동반 카페 추천",
      author: "멍멍파파",
      reportCount: 1,
      reports: [{ reason: "스팸 또는 광고", count: 1 }],
    },
  ])

  // useEffect 훅을 수정하여 로컬 스토리지에서 신고 데이터를 불러오도록 합니다.
  useEffect(() => {
    // Fetch posts from backend
    const fetchPosts = async () => {
      try {
        setLoading(true)
        // 실제 API 연결 시 아래 주석을 해제하세요
        // const response = await axios.get('/api/posts');
        // setPosts(response.data);

        // 로컬 스토리지에서 신고 데이터 불러오기 (테스트용)
        const storedReports = JSON.parse(localStorage.getItem("reportedPosts") || "[]")
        if (storedReports.length > 0) {
          setReportedPosts(storedReports)
        }

        // 테스트용 목업 데이터
        setTimeout(() => {
          // 날짜 형식 확인 - 시간 제거
          const formattedPosts = mockPosts.map((post) => ({
            ...post,
            createdAt: post.createdAt.split(" ")[0], // 날짜 부분만 사용
            // 테스트용 신고 데이터 추가
            reportCount: storedReports.find((rp) => rp.postId === post.id)?.reportCount || 0,
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
          reportCount: reportedPosts.find((rp) => rp.postId === post.id)?.reportCount || 0,
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

  const handleWriteClick = () => {
    navigate("/community/write")
  }

  const handlePostClick = (postId) => {
    navigate(`/community/post/${postId}`)
  }

  // 페이지 변경 핸들러 추가
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)

    // 실제 구현에서는 여기서 해당 페이지의 데이터를 불러옵니다
    setLoading(true)
    setTimeout(() => {
      // 테스트용 데이터 - 페이지 번호에 따라 다른 데이터를 보여줍니다
      const formattedPosts = mockPosts.map((post) => ({
        ...post,
        id: post.id + (page - 1) * 4, // 페이지별로 다른 ID 부여
        title: `${post.title} - 페이지 ${page}`,
        createdAt: post.createdAt.split(" ")[0],
        reportCount: reportedPosts.find((rp) => rp.postId === post.id)?.reportCount || 0,
      }))
      setPosts(formattedPosts)
      setLoading(false)
    }, 500)
  }

  // 페이지네이션 UI를 위한 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // 한 번에 보여줄 페이지 번호 개수

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = startPage + maxPagesToShow - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  // handleIgnoreReport 함수를 수정하여 로컬 스토리지에서도 신고를 제거하도록 합니다.
  const handleIgnoreReport = (postId, e) => {
    e.stopPropagation() // 이벤트 버블링 방지

    if (window.confirm("이 게시글에 대한 신고를 무시하시겠습니까?")) {
      // 실제 구현에서는 API 호출로 대체
      console.log(`게시글 ${postId} 신고 무시`)

      // 목업 데이터 업데이트 - 신고 목록에서 제거
      const updatedReportedPosts = reportedPosts.filter((post) => post.postId !== postId)
      setReportedPosts(updatedReportedPosts)

      // 로컬 스토리지에서도 제거
      localStorage.setItem("reportedPosts", JSON.stringify(updatedReportedPosts))

      alert("신고가 무시되었습니다.")
    }
  }

  // handleDeletePost 함수를 수정하여 로컬 스토리지에서도 신고를 제거하도록 합니다.
  const handleDeletePost = (postId, e) => {
    e.stopPropagation() // 이벤트 버블링 방지

    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // 실제 구현에서는 API 호출로 대체
      console.log(`게시글 ${postId} 삭제`)

      // 목업 데이터 업데이트
      const updatedPosts = posts.filter((post) => post.id !== postId)
      setPosts(updatedPosts)

      // 신고 목록에서도 제거
      const updatedReportedPosts = reportedPosts.filter((post) => post.postId !== postId)
      setReportedPosts(updatedReportedPosts)

      // 로컬 스토리지에서도 제거
      localStorage.setItem("reportedPosts", JSON.stringify(updatedReportedPosts))

      alert("게시글이 삭제되었습니다.")
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
              <button className="btn btn-primary write-btn" onClick={handleWriteClick}>
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

        {/* 관리자 도구 */}
        {isAdmin && (
          <div className="admin-section mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-shield me-2"></i>
                관리자 도구
              </h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowReportList(!showReportList)}>
                {showReportList ? "신고 목록 숨기기" : "신고 목록 보기"}
              </button>
            </div>

            {showReportList && (
              <div className="report-list mt-3">
                {reportedPosts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>게시글 ID</th>
                          <th>제목</th>
                          <th>작성자</th>
                          <th>신고 건수</th>
                          <th>신고 사유</th>
                          <th>조치</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportedPosts.map((post) => (
                          <tr key={post.postId}>
                            <td>{post.postId}</td>
                            <td>
                              <a href={`/community/post/${post.postId}`} className="text-decoration-none">
                                {post.title}
                              </a>
                            </td>
                            <td>{post.author}</td>
                            <td>{post.reportCount}</td>
                            <td>
                              {post.reports.map((report, index) => (
                                <div key={index}>
                                  {report.reason}: {report.count}건
                                </div>
                              ))}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => handleDeletePost(post.postId, e)}
                                >
                                  삭제
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={(e) => handleIgnoreReport(post.postId, e)}
                                >
                                  무시
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-info mt-2">신고된 게시글이 없습니다.</div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="post-list-container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="post-list-item p-3 border-bottom"
                onClick={() => handlePostClick(post.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="mb-1">{post.title}</h5>
                </div>
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
                    <span>
                      <i className="bi bi-eye me-1"></i> {post.viewCount}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(1)} aria-label="First">
                  <i className="bi bi-chevron-double-left"></i>
                </button>
              </li>
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>

              {getPageNumbers().map((number) => (
                <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(number)}>
                    {number}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(totalPages)} aria-label="Last">
                  <i className="bi bi-chevron-double-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="text-end mt-3 admin-controls">
          <button className="btn btn-warning me-2" onClick={() => setIsAdmin(!isAdmin)}>
            <i className="bi bi-shield me-1"></i>
            테스트: {isAdmin ? "일반 사용자 모드로 전환" : "관리자 모드로 전환"}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setIsLoggedIn(!isLoggedIn)}>
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

