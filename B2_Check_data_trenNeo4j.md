# Buoc 2 - Hoc Cypher va Truy Van Du Lieu

Tai lieu nay mo ta ro rang Buoc 2 ban can lam gi, theo dung data ban da load o Buoc 1.

## 1. Muc tieu

Sau Buoc 2, ban can dat duoc 3 muc tieu:

- Hieu schema graph: node labels va relationship types.
- Chay duoc cac query Cypher quan trong (xem phim, tim actor, recommendation).
- Tu sua query de truy van cho mot phim bat ky.

## 2. Cong nghe dung trong buoc nay

- `Neo4j Browser`: giao dien chay query.
- `Cypher`: ngon ngu truy van cua Neo4j.
- `Database neo4j` da load dump thanh cong.

## 3. Input va Output

| Thanh phan | Noi dung |
|---|---|
| INPUT | Neo4j container dang chay, dang nhap duoc `http://localhost:7474` |
| INPUT | Data da co `28863` nodes |
| OUTPUT | Chay duoc bo query nen tang |
| OUTPUT | Hieu quan he `RATED`, `IN_GENRE`, `ACTED_IN`, `DIRECTED` |

## 4. Cac buoc lam cu the

### Buoc 2A - Xem schema tong quan

Chay trong Neo4j Browser:

```cypher
CALL db.schema.visualization();
```

Ban se thay cac cum node/quan he chinh:

- `(:User)-[:RATED]->(:Movie)`
- `(:Movie)-[:IN_GENRE]->(:Genre)`
- `(:Actor)-[:ACTED_IN]->(:Movie)`
- `(:Director)-[:DIRECTED]->(:Movie)`

### Buoc 2B - Query 1: Xem danh sach phim

```cypher
MATCH (m:Movie)
RETURN m.title, m.year
LIMIT 10;
```

Muc dich:

- Lam quen syntax `MATCH ... RETURN ... LIMIT`.
- Kiem tra du lieu `Movie` da co that.

### Buoc 2C - Query 2: Xem chi tiet 1 phim

Luu y trong dataset nay ten phim la `Matrix, The` (khong phai `The Matrix`).

```cypher
MATCH (m:Movie {title: "Matrix, The"})
RETURN m.title, m.year, m.plot, m.imdbRating;
```

Neu muon tim theo tu khoa:

```cypher
MATCH (m:Movie)
WHERE m.title CONTAINS "Matrix"
RETURN m.title, m.year
LIMIT 10;
```

### Buoc 2D - Query 3: Tim actor cua phim

```cypher
MATCH (m:Movie {title: "Matrix, The"})-[:ACTED_IN]-(a:Actor)
RETURN a.name
LIMIT 20;
```

Muc dich:

- Hieu cach di qua relationship de lay du lieu lien quan.

### Buoc 2E - Query 4: Recommendation theo co-rating (quan trong nhat)

```cypher
MATCH (m:Movie {title: "Crimson Tide"})<-[:RATED]-(u:User)-[:RATED]->(rec:Movie)
RETURN DISTINCT rec.title AS recommendation
LIMIT 20;
```

Logic:

- User nao da rate `Crimson Tide`.
- Lay cac phim khac ma nhung user do cung rate.
- Loai bo trung lap bang `DISTINCT`.

### Buoc 2F - Query 5: Tim phim cung the loai

```cypher
MATCH (m:Movie {title: "Matrix, The"})-[:IN_GENRE]->(g:Genre)<-[:IN_GENRE]-(similar:Movie)
WHERE m.movieId <> similar.movieId
RETURN DISTINCT similar.title, similar.year
LIMIT 10;
```

Muc dich:

- Hieu recommendation theo noi dung (content-based) thay vi chi dua tren user behavior.

### Buoc 2G - Query 6: Actor co nhieu phim duoc 5 sao

```cypher
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)<-[r:RATED {rating: 5}]-(u:User)
RETURN a.name, COUNT(DISTINCT m) AS movies_rated_5_stars
ORDER BY movies_rated_5_stars DESC
LIMIT 10;
```

Muc dich:

- Luyen tong hop + sap xep (`COUNT`, `ORDER BY`).

### Buoc 2H - Query 7: Dem so luong tung nhom du lieu

```cypher
MATCH (m:Movie) RETURN COUNT(m) AS total_movies;
MATCH (u:User) RETURN COUNT(u) AS total_users;
MATCH (g:Genre) RETURN COUNT(g) AS total_genres;
MATCH ()-[r:RATED]->() RETURN COUNT(r) AS total_ratings;
```

Muc dich:

- Nam kich thuoc data de ly giai toc do query va chat luong recommendation.

## 5. Loi thuong gap va cach xu ly nhanh

### Loi 1: Query phim khong ra ket qua

Nguyen nhan:

- Ten phim khong dung y chang trong data (`The Matrix` vs `Matrix, The`).

Cach xu ly:

- Tim bang `CONTAINS` truoc, sau do moi query exact title.

### Loi 2: `Connect ECONNREFUSED` khi query bang code

Nguyen nhan:

- Neo4j container chua chay hoac sai port.

Cach xu ly:

- Kiem tra `docker ps`.
- Dam bao dung `bolt://localhost:7687` cho driver.

### Loi 3: Dang nhap Browser that bai

Nguyen nhan:

- Sai tai khoan/mat khau.

Cach xu ly:

- Dung tai khoan da setup: `neo4j / password123` (neu ban chua doi).

## 6. Lien ket sang Buoc 3

Nhung gi ban hoc o Buoc 2 se map thang qua API o Buoc 3:

- Query Cypher <-> field/relationship trong `graphql/schema.graphql`.
- Recommendation query <-> custom field `similar` hoac truy van API tuong duong.

## 7. Checklist hoan thanh Buoc 2

Danh dau xong khi ban da:

- Chay duoc tat ca 7 query tren.
- Hieu duoc vai tro cua 4 relationship chinh.
- Tu doi ten phim trong query recommendation va nhan ket qua khac nhau.
- Giai thich duoc it nhat 2 cach goi y:
  - Collaborative filtering (`RATED` theo user behavior).
  - Content-based (`IN_GENRE` / actor / director overlap).

Neu ban check du 4 dong tren, ban da san sang qua Buoc 3 (GraphQL API setup).

