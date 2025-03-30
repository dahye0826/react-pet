"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "./WritePostPage.css"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function WritePostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationOptions, setLocationOptions] = useState([])
  const [showMap, setShowMap] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 }) // 서울 중심
  const [markers, setMarkers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // 실제 구현에서는 로그인 상태 확인 필요
  const mapRef = useRef(null)
  const navigate = useNavigate()

  // 지도 초기화 (실제 구현에서는 Google Maps API 또는 Kakao Maps API 사용)
  useEffect(() => {
    if (showMap && mapRef.current) {
      // 이 부분은 실제 구현에서 지도 API 초기화 코드로 대체
      console.log("지도 초기화")
    }
  }, [showMap])

  // 장소 검색 기능
  const searchLocations = (query) => {
    if (!query.trim()) {
      setLocationOptions([])
      return
    }

    // 실제 구현에서는 지도 API의 장소 검색 서비스 사용
    // 예시 데이터
    const mockLocations = [
      {
        id: 1,
        name: "해운대 해수욕장",
        address: "부산광역시 해운대구 우동",
        lat: 35.1586,
        lng: 129.1603,
      },
      {
        id: 2,
        name: "가평 글램핑장",
        address: "경기도 가평군 청평면",
        lat: 37.7352,
        lng: 127.429,
      },
      {
        id: 3,
        name: "멍멍 애견카페",
        address: "서울시 강남구 테헤란로 123",
        lat: 37.5087,
        lng: 127.0632,
      },
      {
        id: 4,
        name: "펫 프렌들리 호텔",
        address: "서울시 중구 명동길 67",
        lat: 37.5635,
        lng: 126.9856,
      },
      {
        id: 5,
        name: "동물병원 24시",
        address: "서울시 송파구 올림픽로 89",
        lat: 37.5115,
        lng: 127.0547,
      },
    ]

    const filtered = mockLocations.filter((loc) => loc.name.toLowerCase().includes(query.toLowerCase()))
    setLocationOptions(filtered)

    // 검색 결과가 있으면 지도에 마커 표시
    if (filtered.length > 0) {
      setMarkers(filtered)
      // 첫 번째 결과로 지도 중심 이동
      setMapCenter({ lat: filtered[0].lat, lng: filtered[0].lng })
    }
  }

  const handleLocationChange = (e) => {
    const query = e.target.value
    setLocation(query)
    searchLocations(query)
  }

  const selectLocation = (loc) => {
    setSelectedLocation(loc)
    setLocation(loc.name)
    setLocationOptions([])
    setShowMap(true)
    setMapCenter({ lat: loc.lat, lng: loc.lng })

    // 선택한 위치에만 마커 표시
    setMarkers([loc])
  }

  const handleShowMap = () => {
    setShowMap(true)
    // 검색어가 있으면 검색 실행
    if (location.trim()) {
      searchLocations(location)
    }
  }

  const handleCloseMap = () => {
    setShowMap(false)
  }

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      // 실제 구현에서는 API 호출로 대체
      console.log("제출된 데이터:", {
        title,
        content,
        location: selectedLocation ? selectedLocation.name : location,
        locationData: selectedLocation,
      })

      // 성공 시 게시글 목록 페이지로 이동
      setTimeout(() => {
        alert("게시글이 등록되었습니다.")
        navigate("/community")
      }, 1000)
    } catch (error) {
      console.error("게시글 등록 오류:", error)
      alert("게시글 등록에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="container mt-4 write-post-container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h2 className="text-center mb-0">게시글 작성</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="postTitle" className="form-label">
                      제목
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="postTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력하세요"
                      required
                    />
                  </div>

                  <div className="mb-3 position-relative">
                    <label htmlFor="postLocation" className="form-label">
                      관련 장소 (선택사항)
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="postLocation"
                        value={location}
                        onChange={handleLocationChange}
                        placeholder="장소를 검색하세요"
                      />
                      <button type="button" className="btn btn-outline-secondary" onClick={handleShowMap}>
                        <i className="bi bi-map me-1"></i> 지도에서 찾기
                      </button>
                    </div>

                    {locationOptions.length > 0 && !showMap && (
                      <div className="location-dropdown">
                        {locationOptions.map((loc) => (
                          <div key={loc.id} className="location-item" onClick={() => selectLocation(loc)}>
                            <div className="location-name">{loc.name}</div>
                            <div className="location-address">{loc.address}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 지도 표시 영역 */}
                  {showMap && (
                    <div className="map-container mb-3">
                      <div className="map-header">
                        <h5>장소 선택</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={handleCloseMap}
                          aria-label="Close"
                        ></button>
                      </div>

                      <div className="map-search mb-2">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="장소 검색..."
                            value={location}
                            onChange={handleLocationChange}
                          />
                          <button type="button" className="btn btn-primary" onClick={() => searchLocations(location)}>
                            <i className="bi bi-search"></i>
                          </button>
                        </div>
                      </div>

                      <div className="map-view" ref={mapRef}>
                        {/* 실제 구현에서는 여기에 지도가 렌더링됨 */}
                        <div className="mock-map">
                          <div className="mock-map-center">
                            <div className="text-center">
                              <p>
                                지도 영역 (위도: {mapCenter.lat.toFixed(4)}, 경도: {mapCenter.lng.toFixed(4)})
                              </p>
                              {markers.length > 0 && (
                                <div className="mock-markers">
                                  <h6>표시된 장소:</h6>
                                  <ul className="list-group">
                                    {markers.map((marker) => (
                                      <li
                                        key={marker.id}
                                        className={`list-group-item ${selectedLocation && selectedLocation.id === marker.id ? "active" : ""}`}
                                        onClick={() => selectLocation(marker)}
                                      >
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div>
                                            <strong>{marker.name}</strong>
                                            <div className="small">{marker.address}</div>
                                          </div>
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-primary"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              selectLocation(marker)
                                              handleCloseMap()
                                            }}
                                          >
                                            선택
                                          </button>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="map-footer mt-2">
                        <small className="text-muted">
                          * 실제 구현 시 Google Maps 또는 Kakao Maps API를 사용하여 지도가 표시됩니다.
                        </small>
                      </div>
                    </div>
                  )}

                  {selectedLocation && (
                    <div className="selected-location mb-3">
                      <div className="alert alert-success mb-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>선택된 장소:</strong> {selectedLocation.name}
                            <div>{selectedLocation.address}</div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setSelectedLocation(null)
                              setLocation("")
                            }}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="postContent" className="form-label">
                      내용
                    </label>
                    <textarea
                      className="form-control"
                      id="postContent"
                      rows="10"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="내용을 입력하세요"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="postImage" className="form-label">
                      이미지 첨부 (선택사항)
                    </label>
                    <input type="file" className="form-control" id="postImage" accept="image/*" multiple />
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/community")}>
                      취소
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          등록 중...
                        </>
                      ) : (
                        "게시글 등록"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default WritePostPage

