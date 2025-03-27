import "./Navbar.css"
function Navbar({ isLoggedIn }) {
    return (
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
    )
  }
  
  export default Navbar
  
  