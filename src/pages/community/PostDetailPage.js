"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "./PostDetailPage.css"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function PostDetailPage() {
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(true) // 테스트용
  const [currentUserId, setCurrentUserId] = useState(999) // 테스트용 현재 사용자 ID
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")

  // 댓글 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState("")

  const { id } = useParams()
  const navigate = useNavigate()

  console.log("PostDetailPage rendered with id:", id) // 디버깅용

  useEffect(() => {
    // 게시글 상세 정보 가져오기
    const fetchPostDetail = async () => {
      try {
        console.log("Fetching post details for id:", id) // 디버깅용
        setLoading(true)

        // 실제 구현에서는 API 호출로 대체
        // 테스트용 목업 데이터
        setTimeout(() => {
          const mockPostDetail = {
            id: Number(id),
            title: "강아지랑 부산여행",
            content: `
              <p>지난 주말 우리 댕댕이와 함께한 부산 여행 후기입니다.</p>
              <p>해운대에서 아침 일출을 보고, 광안리에서 야경을 즐겼어요. 생각보다 많은 장소가 반려견 동반이 가능해서 좋았습니다.</p>
              <p>특히 해운대 해변은 이른 아침과 저녁에는 반려견과 함께 산책할 수 있어요. 모래사장을 뛰어다니는 우리 강아지의 모습이 정말 행복해 보였습니다.</p>
              <p>숙소는 '멍멍 펜션'이라는 곳을 이용했는데, 반려견 전용 놀이터와 샤워 시설이 있어서 편리했어요.</p>
              <p>부산에서 반려견과 함께 갈 수 있는 맛집도 몇 군데 찾았는데, 해운대 근처의 '바다 테라스'라는 카페는 야외 테라스에서 반려견과 함께 식사할 수 있어 좋았습니다.</p>
              <p>다음에 또 방문하게 된다면 태종대나 오륙도 쪽도 가보고 싶네요. 반려견과 함께하는 여행은 항상 특별한 것 같아요!</p>
            `,
            author: "멍멍맘",
            authorId: 1,
            createdAt: "2023-05-15",
            updatedAt: "2023-05-15",
            viewCount: 142,
            locationName: "해운대 해수욕장",
            locationId: 1,
            images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
          }

          const mockComments = [
            {
              id: 1,
              postId: Number(id),
              author: "냥이집사",
              authorId: 2,
              content: "정말 좋은 정보 감사합니다! 저도 다음 달에 부산 여행을 계획 중인데 참고할게요.",
              createdAt: "2023-05-16",
            },
            {
              id: 2,
              postId: Number(id),
              author: "여행자",
              authorId: 3,
              content: "해운대에서 반려견과 함께 할 수 있는 시간이 정해져 있나요? 좀 더 자세히 알 수 있을까요?",
              createdAt: "2023-05-16",
            },
            {
              id: 3,
              postId: Number(id),
              author: "멍멍맘",
              authorId: 1,
              content:
                "네, 해운대는 성수기에는 오전 8시 이전, 오후 6시 이후에 반려견 출입이 가능해요. 비성수기에는 좀 더 자유롭습니다.",
              createdAt: "2023-05-17",
            },
          ]

          console.log("Setting post data:", mockPostDetail) // 디버깅용
          setPost(mockPostDetail)
          setComments(mockComments)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("게시글 로딩 오류:", error)
        setLoading(false)
      }
    }

    fetchPostDetail()
  }, [id])

  const handleCommentSubmit = (e) => {
    e.preventDefault()

    if (!commentText.trim()) return

    // 실제 구현에서는 API 호출로 대체
    const newComment = {
      id: comments.length + 1,
      postId: Number(id),
      author: "현재 사용자", // 실제 구현에서는 로그인한 사용자 정보 사용
      authorId: currentUserId, // 현재 사용자 ID
      content: commentText,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setComments([...comments, newComment])
    setCommentText("")
  }

  // 댓글 수정 시작
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id)
    setEditCommentText(comment.content)
  }

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditCommentText("")
  }

  // 댓글 수정 저장
  const handleSaveComment = (commentId) => {
    if (!editCommentText.trim()) {
      alert("댓글 내용을 입력해주세요.")
      return
    }

    // 실제 구현에서는 API 호출로 대체
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content: editCommentText,
          updatedAt: new Date().toISOString().split("T")[0], // 수정 시간 추가
        }
      }
      return comment
    })

    setComments(updatedComments)
    setEditingCommentId(null)
    setEditCommentText("")
  }

  // 댓글 삭제
  const handleDeleteComment = (commentId) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      // 실제 구현에서는 API 호출로 대체
      const filteredComments = comments.filter((comment) => comment.id !== commentId)
      setComments(filteredComments)
    }
  }

  const handleGoBack = () => {
    navigate("/community")
  }

  const handleLocationClick = () => {
    if (post?.locationId) {
      navigate(`/location/${post.locationId}`)
    }
  }

  const handleEditClick = () => {
    navigate(`/community/edit/${id}`)
  }

  const handleReportClick = () => {
    setShowReportModal(true)
  }

  const handleReportSubmit = () => {
    if (!reportReason) {
      alert("신고 사유를 선택해주세요.")
      return
    }

    // 실제 구현에서는 API 호출로 대체
    console.log("신고 데이터:", {
      postId: id,
      reason: reportReason,
      description: reportDescription,
    })

    // 로컬 스토리지에 신고 데이터 저장 (테스트용)
    const existingReports = JSON.parse(localStorage.getItem("reportedPosts") || "[]")

    // 이미 신고된 게시글인지 확인
    const existingReportIndex = existingReports.findIndex((report) => report.postId === Number(id))

    if (existingReportIndex !== -1) {
      // 이미 신고된 게시글이면 신고 사유 추가
      const existingReport = existingReports[existingReportIndex]
      const existingReasonIndex = existingReport.reports.findIndex((r) => r.reason === reportReason)

      if (existingReasonIndex !== -1) {
        // 같은 사유로 이미 신고된 경우 카운트 증가
        existingReport.reports[existingReasonIndex].count += 1
      } else {
        // 새로운 사유로 신고된 경우 사유 추가
        existingReport.reports.push({ reason: reportReason, count: 1 })
      }

      existingReport.reportCount += 1
      existingReports[existingReportIndex] = existingReport
    } else {
      // 새로운 신고 게시글 추가
      existingReports.push({
        postId: Number(id),
        title: post.title,
        author: post.author,
        reportCount: 1,
        reports: [{ reason: reportReason, count: 1 }],
      })
    }

    localStorage.setItem("reportedPosts", JSON.stringify(existingReports))

    alert("신고가 접수되었습니다.")
    setShowReportModal(false)
    setReportReason("")
    setReportDescription("")
  }

  console.log("Loading state:", loading) // 디버깅용
  console.log("Post data before render:", post) // 디버깅용

  if (loading) {
    return (
      <>
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="container mt-4 mb-5">
        <div className="post-detail-container">
          <div className="post-header">
            <button className="btn btn-sm btn-outline-secondary mb-3" onClick={handleGoBack}>
              <i className="bi bi-arrow-left me-1"></i> 목록으로
            </button>

            <h1 className="post-title">{post.title}</h1>

            <div className="post-meta">
              <div className="d-flex align-items-center">
                <div className="author-avatar">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="ms-2">
                  <div className="author-name">{post.author}</div>
                  <div className="post-date">
                    {post.createdAt}
                    {post.updatedAt !== post.createdAt && <span className="ms-2">(수정됨)</span>}
                  </div>
                </div>
              </div>

              <div className="post-stats">
                <span className="me-3">
                  <i className="bi bi-eye me-1"></i> {post.viewCount}
                </span>
                <span>
                  <i className="bi bi-chat-left-text me-1"></i> {comments.length}
                </span>
              </div>
            </div>

            {post.locationName && (
              <div className="post-location mt-2" onClick={handleLocationClick}>
                <i className="bi bi-geo-alt me-1"></i>
                <span className="location-name">{post.locationName}</span>
              </div>
            )}
          </div>

          <div className="post-content mt-4">
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>

            {post.images && post.images.length > 0 && (
              <div className="post-images mt-4">
                {post.images.map((image, index) => (
                  <div key={index} className="post-image-container mb-3">
                    <img src={image || "/placeholder.svg"} alt={`게시글 이미지 ${index + 1}`} className="post-image" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="post-actions mt-4 d-flex justify-content-between">
            {post.authorId === currentUserId ? ( // 현재 사용자가 작성자인 경우
              <div>
                <button className="btn btn-outline-secondary me-2" onClick={handleEditClick}>
                  <i className="bi bi-pencil-square me-1"></i> 수정
                </button>
                <button className="btn btn-outline-danger">
                  <i className="bi bi-trash me-1"></i> 삭제
                </button>
              </div>
            ) : (
              <div></div> // 작성자가 아닌 경우 왼쪽에 빈 div
            )}

            {/* 작성자가 아닌 경우에만 신고 버튼 표시 */}
            {post.authorId !== currentUserId && isLoggedIn && (
              <button className="btn btn-outline-warning" onClick={handleReportClick}>
                <i className="bi bi-exclamation-triangle me-1"></i> 신고하기
              </button>
            )}
          </div>

          <div className="post-comments mt-5">
            <h4 className="comments-title">댓글 {comments.length}개</h4>

            {isLoggedIn ? (
              <form onSubmit={handleCommentSubmit} className="comment-form mt-3">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="댓글을 작성해주세요"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    댓글 등록
                  </button>
                </div>
              </form>
            ) : (
              <div className="alert alert-info mt-3">
                댓글을 작성하려면 <a href="/login">로그인</a>이 필요합니다.
              </div>
            )}

            <div className="comments-list mt-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    {editingCommentId === comment.id ? (
                      // 댓글 수정 폼
                      <div className="comment-edit-form">
                        <textarea
                          className="form-control mb-2"
                          rows="3"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          required
                        ></textarea>
                        <div className="d-flex justify-content-end">
                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={handleCancelEdit}>
                            취소
                          </button>
                          <button className="btn btn-sm btn-primary" onClick={() => handleSaveComment(comment.id)}>
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 일반 댓글 표시
                      <>
                        <div className="comment-header">
                          <div className="d-flex align-items-center">
                            <div className="comment-avatar">
                              <i className="bi bi-person-circle"></i>
                            </div>
                            <div className="ms-2">
                              <div className="comment-author">{comment.author}</div>
                              <div className="comment-date">
                                {comment.createdAt}
                                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                                  <span className="ms-2 text-muted">(수정됨)</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {comment.authorId === currentUserId && ( // 현재 사용자가 댓글 작성자인 경우
                            <div className="comment-actions">
                              <button
                                className="btn btn-sm btn-link text-decoration-none"
                                onClick={() => handleEditComment(comment)}
                              >
                                수정
                              </button>
                              <button
                                className="btn btn-sm btn-link text-decoration-none text-danger"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="comment-content mt-2">{comment.content}</div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 신고하기 모달 */}
      {showReportModal && <div className="modal-backdrop show"></div>}

      <div className={`modal ${showReportModal ? "show d-block" : ""}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
                게시글 신고하기
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowReportModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label fw-bold">신고 사유</label>
                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reportReason"
                      id="reason1"
                      value="부적절한 내용"
                      checked={reportReason === "부적절한 내용"}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="reason1">
                      부적절한 내용
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reportReason"
                      id="reason2"
                      value="스팸 또는 광고"
                      checked={reportReason === "스팸 또는 광고"}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="reason2">
                      스팸 또는 광고
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reportReason"
                      id="reason3"
                      value="저작권 침해"
                      checked={reportReason === "저작권 침해"}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="reason3">
                      저작권 침해
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reportReason"
                      id="reason4"
                      value="욕설 또는 혐오 발언"
                      checked={reportReason === "욕설 또는 혐오 발언"}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="reason4">
                      욕설 또는 혐오 발언
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reportReason"
                      id="reason5"
                      value="기타"
                      checked={reportReason === "기타"}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="reason5">
                      기타
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
                취소
              </button>
              <button type="button" className="btn btn-danger" onClick={handleReportSubmit}>
                신고하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-4">
        <div className="text-end">
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setIsLoggedIn(!isLoggedIn)}>
            테스트: {isLoggedIn ? "로그아웃 상태로 변경" : "로그인 상태로 변경"}
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setCurrentUserId(currentUserId === 1 ? 999 : 1)}
          >
            테스트: {currentUserId === 1 ? "일반 사용자로 변경" : "작성자로 변경"}
          </button>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default PostDetailPage

