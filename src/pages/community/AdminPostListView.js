"use client"

function AdminPostListView({
  isAdmin,
  reportedPosts,
  reportedComments,
  handlePostClick,
  handleDeletePost,
  handleIgnorePostReport,
  handleDeleteComment,
  handleIgnoreCommentReport,
}) {
  return (
    <>
      <div className="admin-controls mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="admin-title">
            <i className="bi bi-shield-fill me-2"></i>관리자 모드
          </h4>
        </div>
      </div>

      <div className="reported-content-section">
        {/* 신고된 게시글 섹션 */}
        <div className="reported-posts mb-4">
          <h5 className="section-title">
            <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
            신고된 게시글 ({reportedPosts.length})
          </h5>
          {reportedPosts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>신고 수</th>
                    <th>신고 사유</th>
                    <th>조치</th>
                  </tr>
                </thead>
                <tbody>
                  {reportedPosts.map((post) => (
                    <tr key={post.postId}>
                      <td>{post.postId}</td>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePostClick(post.postId)
                          }}
                          className="text-decoration-none"
                        >
                          {post.title}
                        </a>
                      </td>
                      <td>{post.author}</td>
                      <td>{post.reportCount}</td>
                      <td>
                        <ul className="report-reasons mb-0">
                          {post.reports.map((report, index) => (
                            <li key={index}>
                              {report.reason} ({report.count}회)
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-danger me-1"
                            onClick={() => handleDeletePost(post.postId)}
                          >
                            삭제
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleIgnorePostReport(post.postId)}
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
            <div className="alert alert-info">신고된 게시글이 없습니다.</div>
          )}
        </div>

        {/* 신고된 댓글 섹션 */}
        <div className="reported-comments mb-4">
          <h5 className="section-title">
            <i className="bi bi-chat-left-text-fill me-2 text-warning"></i>
            신고된 댓글 ({reportedComments.length})
          </h5>
          {reportedComments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>게시글</th>
                    <th>작성자</th>
                    <th>댓글 내용</th>
                    <th>신고 수</th>
                    <th>신고 사유</th>
                    <th>조치</th>
                  </tr>
                </thead>
                <tbody>
                  {reportedComments.map((comment) => (
                    <tr key={`${comment.postId}-${comment.commentId}`}>
                      <td>{comment.commentId}</td>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePostClick(comment.postId)
                          }}
                          className="text-decoration-none"
                        >
                          {comment.postTitle}
                        </a>
                      </td>
                      <td>{comment.author}</td>
                      <td>
                        {comment.commentContent.length > 30
                          ? `${comment.commentContent.substring(0, 30)}...`
                          : comment.commentContent}
                      </td>
                      <td>{comment.reportCount}</td>
                      <td>
                        <ul className="report-reasons mb-0">
                          {comment.reports.map((report, index) => (
                            <li key={index}>
                              {report.reason} ({report.count}회)
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-danger me-1"
                            onClick={() => handleDeleteComment(comment.commentId, comment.postId)}
                          >
                            삭제
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleIgnoreCommentReport(comment.commentId, comment.postId)}
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
            <div className="alert alert-info">신고된 댓글이 없습니다.</div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminPostListView

