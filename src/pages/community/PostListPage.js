"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "./PostListPage.css"
import { mockPosts } from "./mockData"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import AdminPostListView from "./AdminPostListView"
import UserPostListView from "./UserPostListView"

function PostListPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 로그인 상태 관리
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdmin, setIsAdmin] = useState(false) // 관리자 모드 (기본값 false)
  const [reportedPosts, setReportedPosts] = useState([]) // 신고된 게시글 목록
  const [reportedComments, setReportedComments] = useState([]) // 신고된 댓글 목록
  const navigate = useNavigate()

  // 페이징 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5) // 테스트용 총 페이지 수

  useEffect(() => {
    // Fetch posts from backend
    const fetchPosts = async () => {
      try {
        setLoading(true)
        // 실제 API 연결 시 아래 주석을 해제하세요
        // const response = await axios.get('/api/posts');
        // setPosts(response.data);

        // 로컬 스토리지에서 신고 데이터 불러오기 (테스트용)
        const storedReportedPosts = JSON.parse(localStorage.getItem("reportedPosts") || "[]")
        const storedReportedComments = JSON.parse(localStorage.getItem("reportedComments") || "[]")

        setReportedPosts(storedReportedPosts)
        setReportedComments(storedReportedComments)

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

  const handleWriteClick = () => {
    // 로그인 상태 확인
    if (!isLoggedIn) {
      alert("글을 작성하려면 로그인이 필요합니다.")
      return
    }
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

  // 관리자: 게시글 신고 무시
  const handleIgnorePostReport = (postId) => {
    if (!isAdmin) return

    if (window.confirm("이 게시글에 대한 신고를 무시하시겠습니까?")) {
      // 로컬 스토리지에서 신고된 게시글 제거
      const storedReportedPosts = JSON.parse(localStorage.getItem("reportedPosts") || "[]")
      const updatedReportedPosts = storedReportedPosts.filter((report) => report.postId !== postId)
      localStorage.setItem("reportedPosts", JSON.stringify(updatedReportedPosts))

      // 상태 업데이트
      setReportedPosts(updatedReportedPosts)

      alert("게시글 신고가 무시되었습니다.")
    }
  }

  // 관리자: 댓글 신고 무시
  const handleIgnoreCommentReport = (commentId, postId) => {
    if (!isAdmin) return

    if (window.confirm("이 댓글에 대한 신고를 무시하시겠습니까?")) {
      // 로컬 스토리지에서 신고된 댓글 제거
      const storedReportedComments = JSON.parse(localStorage.getItem("reportedComments") || "[]")
      const updatedReportedComments = storedReportedComments.filter(
        (report) => !(report.commentId === commentId && report.postId === postId),
      )
      localStorage.setItem("reportedComments", JSON.stringify(updatedReportedComments))

      // 상태 업데이트
      setReportedComments(updatedReportedComments)

      alert("댓글 신고가 무시되었습니다.")
    }
  }

  // 관리자: 게시글 삭제
  const handleDeletePost = (postId) => {
    if (!isAdmin) return

    if (window.confirm("이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // 실제 구현에서는 API 호출로 대체
      // 테스트용으로 posts 상태에서 해당 게시글 제거
      const updatedPosts = posts.filter((post) => post.id !== postId)
      setPosts(updatedPosts)

      // 로컬 스토리지에서 신고된 게시글 제거
      const storedReportedPosts = JSON.parse(localStorage.getItem("reportedPosts") || "[]")
      const updatedReportedPosts = storedReportedPosts.filter((report) => report.postId !== postId)
      localStorage.setItem("reportedPosts", JSON.stringify(updatedReportedPosts))

      // 상태 업데이트
      setReportedPosts(updatedReportedPosts)

      // 해당 게시글에 대한 댓글 신고도 모두 제거
      const storedReportedComments = JSON.parse(localStorage.getItem("reportedComments") || "[]")
      const updatedReportedComments = storedReportedComments.filter((report) => report.postId !== postId)
      localStorage.setItem("reportedComments", JSON.stringify(updatedReportedComments))
      setReportedComments(updatedReportedComments)

      alert("게시글이 삭제되었습니다.")
    }
  }

  // 관리자: 댓글 삭제
  const handleDeleteComment = (commentId, postId) => {
    if (!isAdmin) return

    if (window.confirm("이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // 실제 구현에서는 API 호출로 대체

      // 로컬 스토리지에서 신고된 댓글 제거
      const storedReportedComments = JSON.parse(localStorage.getItem("reportedComments") || "[]")
      const updatedReportedComments = storedReportedComments.filter(
        (report) => !(report.commentId === commentId && report.postId === postId),
      )
      localStorage.setItem("reportedComments", JSON.stringify(updatedReportedComments))

      // 상태 업데이트
      setReportedComments(updatedReportedComments)

      alert("댓글이 삭제되었습니다.")
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

        {isAdmin ? (
          <AdminPostListView
            isAdmin={isAdmin}
            reportedPosts={reportedPosts}
            reportedComments={reportedComments}
            handlePostClick={handlePostClick}
            handleDeletePost={handleDeletePost}
            handleIgnorePostReport={handleIgnorePostReport}
            handleDeleteComment={handleDeleteComment}
            handleIgnoreCommentReport={handleIgnoreCommentReport}
          />
        ) : (
          <UserPostListView
            posts={posts}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            handleKeyDown={handleKeyDown}
            handleWriteClick={handleWriteClick}
            handlePostClick={handlePostClick}
            currentPage={currentPage}
            getPageNumbers={getPageNumbers}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            isLoggedIn={isLoggedIn}
          />
        )}

        <div className="text-end mt-3 admin-controls">
          <button className="btn btn-outline-secondary me-2" onClick={() => setIsLoggedIn(!isLoggedIn)}>
            테스트: {isLoggedIn ? "로그아웃 상태로 변경" : "로그인 상태로 변경"}
          </button>
          <button className="btn btn-outline-danger me-2" onClick={() => setIsAdmin(!isAdmin)}>
            테스트: {isAdmin ? "일반 사용자 모드로 변경" : "관리자 모드로 변경"}
          </button>
        </div>
      </div>

      {/* 푸터 컴포넌트 */}
      <Footer />
    </>
  )
}

export default PostListPage

