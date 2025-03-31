# 🗂️ ERD 구조

## 1. 🧑‍💻 User (회원)

| 컬럼명    | 타입   | 설명              |
|----------|--------|-------------------|
| user_id  | PK     | 사용자 ID (기본키) |
| username | String | 사용자 이름/닉네임 |

---

## 2. 📍 Location (장소)

| 컬럼명      | 타입   | 설명                  |
|-------------|--------|-----------------------|
| location_id | PK     | 장소 ID (기본키)      |
| name        | String | 장소 이름             |
| address     | String | 주소                  |
| lat         | Float  | 위도                  |
| lng         | Float  | 경도                  |

---

## 3. 📝 Post (게시글)

| 컬럼명      | 타입   | 설명                                           |
|-------------|--------|------------------------------------------------|
| post_id     | PK     | 게시글 ID (기본키)                              |
| title       | String | 제목                                           |
| content     | Text   | 내용                                           |
| author_id   | FK     | 작성자 ID → User.user_id                       |
| created_at  | Date   | 작성일                                         |
| updated_at  | Date   | 수정일                                         |
| view_count  | Int    | 조회수                                         |
| location_id | FK     | 장소 ID (선택사항) → Location.location_id      |

---

## 4. 💬 Comment (댓글)

| 컬럼명     | 타입   | 설명                                 |
|------------|--------|--------------------------------------|
| comment_id | PK     | 댓글 ID (기본키)                     |
| post_id    | FK     | 게시글 ID → Post.post_id             |
| author_id  | FK     | 작성자 ID → User.user_id             |
| content    | Text   | 댓글 내용                            |
| created_at | Date   | 작성일                               |
| updated_at | Date   | 수정일                               |

---

## 5. 🚨 Report (신고)

| 컬럼명      | 타입                    | 설명                                               |
|-------------|-------------------------|----------------------------------------------------|
| report_id   | PK                      | 신고 ID (기본키)                                    |
| target_type | ENUM('post', 'comment') | 신고 대상 유형                                     |
| target_id   | FK                      | 대상 ID → Post.post_id 또는 Comment.comment_id     |
| reason      | String                  | 신고 사유                                           |
| count       | Int                     | 같은 사유로 신고된 횟수                            |
| reporter_id | FK                      | 신고자 ID → User.user_id                           |
| created_at  | Date                    | 신고 접수 일시                                     |
