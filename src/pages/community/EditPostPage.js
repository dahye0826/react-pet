"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "./WritePostPage.css" // 같은 스타일 사용
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function EditPostPage() {
  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationOptions, setLocationOptions] = useState([])
  const [showMap, setShowMap] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 }) // 서울 중심
  const [markers, setMarkers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [loading, setLoading] = useState(true)
  const [existingImages, setExistingImages] = useState([])
  const mapRef = useRef(null)
  const navigate = useNavigate()

  console.log("EditPostPage rendered with id:", id) // 디버깅용

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        console.log("Fetching post data for editing, id:", id) // 디버깅용
        setLoading(true)

        // 실제 구현에서는 API 호출로 대체
        setTimeout(() => {
          // 테스트용 목업 데이터
          const mockPostData = {
            id: Number.parseInt(id),
            title: "강아지랑 부산여행",
            content: `지난 주말 우리 댕댕이와 함께한 부산 여행 후기입니다.
해운대에서 아침 일출을 보고, 광안리에서 야경을 즐겼어요. 생각보다 많은 장소가 반려견 동반이 가능해서 좋았습니다.
특히 해운대 해변은 이른 아침과 저녁에는 반려견과 함께 산책할 수 있어요. 모래사장을 뛰어다니는 우리 강아지의 모습이 정말 행복해 보였습니다.
숙소는 '멍멍 펜션'이라는 곳을 이용했는데, 반려견 전용 놀이터와 샤워 시설이 있어서 편리했어요.`,
            author: "멍멍맘",
            createdAt: "2023-05-15",
            locationName: "해운대 해수욕장",
            locationData: {
              id: 1,
              name: "해운대 해수욕장",
              address: "부산광역시 해운대구 우동",
              lat: 35.1586,
              lng: 129.1603,
            },
            images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
          }

          console.log("Setting post data for editing:", mockPostData) // 디버깅용
          setTitle(mockPostData.title)
          setContent(mockPostData.content)

          if (mockPostData.locationData) {
            setLocation(mockPostData.locationData.name)
            setSelectedLocation(mockPostData.locationData)
          }

          if (mockPostData.images && mockPostData.images.length > 0) {
            setExistingImages(mockPostData.images)
          }

          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("게시글 데이터 로딩 오류:", error)
        alert("게시글 데이터를 불러오는데 실패했습니다.")
        navigate("/community")
      }
    }

    fetchPostData()
  }, [id, navigate])

  // 지도 초기화 (실제 구현에서는 Google Maps API 또는 Kakao Maps API 사용)
  useEffect(() => {
    if (showMap && mapRef.current) {
      // 이 부분은 실제 구현에서 지도 API 초기화 코드로 대체
      console.log("지도 초기화")

      // 선택된 위치가 있으면 지도 중심 설정
      if (selectedLocation) {
        setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng })
        setMarkers([selectedLocation])
      }
    }
  }, [showMap, selectedLocation])

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
      console.log("수정된 데이터:", {
        id,
        title,
        content,
        location: selectedLocation ? selectedLocation.name : location,
        locationData: selectedLocation,
        existingImages,
      })

      // 성공 시 게시글 상세 페이지로 이동
      setTimeout(() => {
        alert("게시글이 수정되었습니다.")
        navigate(`/community/post/${id}`)
      }, 1000)
    } catch (error) {
      console.error("게시글 수정 오류:", error)
      alert("게시글 수정에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 기존 이미지 삭제
  const handleRemoveImage = (index) => {
    const newImages = [...existingImages]
    newImages.splice(index, 1)
    setExistingImages(newImages)
  }

  console.log("Loading state in EditPostPage:", loading) // 디버깅용

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

      <div className="container mt-4 write-post-container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h2 className="text-center mb-0">게시글 수정</h2>
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

                  {/* 기존 이미지 표시 */}
                  {existingImages.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label">기존 이미지</label>
                      <div className="row">
                        {existingImages.map((image, index) => (
                          <div key={index} className="col-md-4 mb-2">
                            <div className="position-relative">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`이미지 ${index + 1}`}
                                className="img-thumbnail"
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="postImage" className="form-label">
                      이미지 추가 (선택사항)
                    </label>
                    <input type="file" className="form-control" id="postImage" accept="image/*" multiple />
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate(`/community/post/${id}`)}
                    >
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
                          수정 중...
                        </>
                      ) : (
                        "게시글 수정"
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

export default EditPostPage

