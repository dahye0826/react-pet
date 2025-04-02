"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "./WritePostPage.css"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function WritePostPage() {
  // 카카오맵 관련 상태 및 참조 설정 부분을 다음으로 교체:
  const [kakaoMapLoaded, setKakaoMapLoaded] = useState(false)
  const [mapLoadError, setMapLoadError] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [location, setLocation] = useState("")
  const [locationOptions, setLocationOptions] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 }) // 서울 중심
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // 실제 구현에서는 로그인 상태 확인 필요
  const navigate = useNavigate()

  // 카카오맵 API 스크립트 로드 부분을 다음으로 교체:
  useEffect(() => {
    const loadKakaoMap = () => {
      // 이미 로드되었는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log("Kakao Maps API already loaded")
        setKakaoMapLoaded(true)
        return
      }

      // 스크립트 생성 및 로드
      const script = document.createElement("script")
      script.id = "kakao-maps-sdk"
      script.async = true
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=97c75dad0b53b5e0f179e360aea22433&libraries=services&autoload=false"

      script.onload = () => {
        window.kakao.maps.load(() => {
          console.log("Kakao Maps API loaded successfully")
          setKakaoMapLoaded(true)
          setMapLoadError(null)
        })
      }

      script.onerror = (error) => {
        console.error("Error loading Kakao Maps API:", error)
        setMapLoadError("카카오맵 API를 로드하는데 문제가 발생했습니다.")
      }

      document.head.appendChild(script)
    }

    loadKakaoMap()

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null
      }
      clearMarkers()
    }
  }, [])

  // 지도 표시 상태가 변경될 때 지도 초기화 부분을 다음으로 교체:
  useEffect(() => {
    if (showMap && kakaoMapLoaded && mapRef.current) {
      // 약간의 지연을 두고 지도 초기화 (DOM이 완전히 렌더링된 후)
      const timer = setTimeout(() => {
        initializeMap()
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [showMap, kakaoMapLoaded])

  // 지도 초기화 함수를 다음으로 교체:
  const initializeMap = () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      setMapLoadError("지도를 초기화할 수 없습니다.")
      return
    }

    try {
      // 지도 컨테이너 크기 확인 및 설정
      if (mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
        mapRef.current.style.width = "100%"
        mapRef.current.style.height = "400px"
      }

      // 지도 옵션 설정
      const options = {
        center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
        level: 3,
      }

      // 지도 인스턴스 생성
      const mapInstance = new window.kakao.maps.Map(mapRef.current, options)
      mapInstanceRef.current = mapInstance

      // 지도 크기 재설정
      setTimeout(() => mapInstance.relayout(), 100)

      // 선택된 위치가 있으면 마커 표시
      if (selectedLocation) {
        addMarker(selectedLocation)
      }
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapLoadError("지도를 초기화하는데 문제가 발생했습니다.")
    }
  }

  // 마커 추가 함수를 다음으로 교체:
  const addMarker = (location) => {
    if (!mapInstanceRef.current || !window.kakao || !window.kakao.maps) return

    // 기존 마커 제거
    clearMarkers()

    // 새 마커 생성
    const position = new window.kakao.maps.LatLng(location.lat, location.lng)
    const marker = new window.kakao.maps.Marker({
      position: position,
      map: mapInstanceRef.current,
    })

    // 마커 정보창 생성
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">${location.name}</div>`,
    })
    infowindow.open(mapInstanceRef.current, marker)

    // 마커 참조 저장
    markersRef.current.push({ marker, infowindow })

    // 지도 중심 이동
    mapInstanceRef.current.setCenter(position)
  }

  // 마커 제거 함수를 다음으로 교체:
  const clearMarkers = () => {
    markersRef.current.forEach((item) => {
      if (item.marker) item.marker.setMap(null)
      if (item.infowindow) item.infowindow.close()
    })
    markersRef.current = []
  }

  // 장소 검색 함수를 다음으로 교체:
  const searchLocations = (query) => {
    if (!query.trim()) {
      setLocationOptions([])
      return
    }

    if (kakaoMapLoaded && window.kakao && window.kakao.maps) {
      const places = new window.kakao.maps.services.Places()

      places.keywordSearch(query, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 검색 결과 처리
          const locations = result.map((place) => ({
            id: place.id,
            name: place.place_name,
            address: place.address_name,
            lat: Number.parseFloat(place.y),
            lng: Number.parseFloat(place.x),
          }))

          setLocationOptions(locations)

          // 검색 결과가 있으면 지도에 표시
          if (locations.length > 0 && mapInstanceRef.current) {
            // 첫 번째 결과로 지도 중심 이동
            setMapCenter({ lat: locations[0].lat, lng: locations[0].lng })

            // 지도 중심 이동
            const position = new window.kakao.maps.LatLng(locations[0].lat, locations[0].lng)
            mapInstanceRef.current.setCenter(position)

            // 마커 표시
            clearMarkers()

            // 검색 결과에 마커 표시
            locations.forEach((loc) => {
              const position = new window.kakao.maps.LatLng(loc.lat, loc.lng)
              const marker = new window.kakao.maps.Marker({
                position: position,
                map: mapInstanceRef.current,
              })

              // 마커 클릭 이벤트
              window.kakao.maps.event.addListener(marker, "click", () => {
                selectLocation(loc)
              })

              // 마커 정보창
              const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;">${loc.name}</div>`,
              })

              // 마커에 마우스 오버 이벤트
              window.kakao.maps.event.addListener(marker, "mouseover", () => {
                infowindow.open(mapInstanceRef.current, marker)
              })

              // 마커에 마우스 아웃 이벤트
              window.kakao.maps.event.addListener(marker, "mouseout", () => {
                infowindow.close()
              })

              markersRef.current.push({ marker, infowindow })
            })
          }
        } else {
          setLocationOptions([])
        }
      })
    } else {
      // API가 로드되지 않은 경우 처리
      setMapLoadError("카카오맵 API가 로드되지 않았습니다.")
    }
  }

  // 위치 선택 함수를 다음으로 교체:
  const selectLocation = (loc) => {
    setSelectedLocation(loc)
    setLocation(loc.name)
    setLocationOptions([])
    setShowMap(true)
    setMapCenter({ lat: loc.lat, lng: loc.lng })

    if (mapInstanceRef.current) {
      addMarker(loc)
    }
  }

  // 지도 표시/숨김 함수를 다음으로 교체:
  const handleShowMap = () => {
    setShowMap(true)
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

  // 지도 다시 로드 함수를 다음으로 교체:
  const handleRetryLoadMap = () => {
    setMapLoadError(null)

    // 스크립트 태그 제거
    const existingScript = document.getElementById("kakao-maps-sdk")
    if (existingScript) {
      existingScript.remove()
    }

    // kakao 객체 초기화
    if (window.kakao) {
      window.kakao = undefined
    }

    // 상태 초기화
    setKakaoMapLoaded(false)

    // 약간의 지연 후 스크립트 다시 로드
    setTimeout(() => {
      const script = document.createElement("script")
      script.id = "kakao-maps-sdk"
      script.async = true
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=97c75dad0b53b5e0f179e360aea22433&libraries=services&autoload=false"

      script.onload = () => {
        window.kakao.maps.load(() => {
          setKakaoMapLoaded(true)
        })
      }

      document.head.appendChild(script)
    }, 500)
  }

  const handleLocationChange = (e) => {
    setLocation(e.target.value)
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

                      {/* 지도 로딩 상태에 따른 표시 */}
                      {mapLoadError ? (
                        // 에러 발생 시
                        <div
                          className="map-view d-flex justify-content-center align-items-center bg-light"
                          style={{ height: "400px" }}
                        >
                          <div className="text-center p-4">
                            <div className="text-danger mb-3">
                              <i className="bi bi-exclamation-triangle-fill fs-1"></i>
                            </div>
                            <p className="text-danger">{mapLoadError}</p>
                            <button type="button" className="btn btn-outline-primary mt-2" onClick={handleRetryLoadMap}>
                              <i className="bi bi-arrow-clockwise me-1"></i> REST API 키로 다시 시도
                            </button>
                          </div>
                        </div>
                      ) : !kakaoMapLoaded ? (
                        // 로딩 중
                        <div
                          className="map-view d-flex justify-content-center align-items-center bg-light"
                          style={{ height: "400px" }}
                        >
                          <div className="text-center">
                            <div className="spinner-border text-primary mb-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>지도를 불러오는 중...</p>
                          </div>
                        </div>
                      ) : (
                        // 지도 표시
                        <div
                          id="map-container"
                          ref={mapRef}
                          style={{
                            width: "100%",
                            height: "400px",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #dee2e6",
                          }}
                        ></div>
                      )}

                      <div className="map-footer mt-2">
                        <small className="text-muted">* 지도에서 원하는 장소를 검색하고 선택하세요.</small>
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

