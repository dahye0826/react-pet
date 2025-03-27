import "./Footer.css"
function Footer() {
    return (
      <footer className="footer mt-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <h5 className="footer-title">
                <i className="bi bi-house-heart me-2"></i>
                반려동물지도
              </h5>
              <p className="footer-description mt-3">
              반려동물과 함께 걷는 길은 오래 마음에 남는 여행입니다.
              이곳은 그 발자국 하나하나를 담는 공간입니다.
              특별했던 하루, 함께 걷던 길,우리만의 반려 이야기를 여기서 함께 이어가요.
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
    )
  }
  
  export default Footer
  
  