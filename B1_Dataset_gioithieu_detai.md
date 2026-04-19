# Gioi thieu bo du lieu Recommendations (Neo4j)

Tai lieu nay dung de mo ta nhanh bo du lieu phim trong project `recommendations`, cach doc cau truc graph, va cach giai thich bo data cho nguoi moi.

## 1. Bo du lieu nay la gi?

Day la bo du lieu mau "Recommendations" trong he sinh thai Neo4j Graph Examples, mo phong bai toan goi y phim theo hanh vi danh gia (ratings) cua nguoi dung.

- Muc tieu nghiep vu: de xuat phim lien quan cho user.
- Muc tieu ky thuat: minh hoa suc manh cua graph database cho recommendation.
- Cong nghe chinh: Neo4j + Cypher + (tuy chon) GraphQL API.

## 2. File du lieu trong repo

Thu muc: `data/`

- `recommendations-5.26.dump`: dump chinh dung voi Neo4j 5.26.x.
- `recommendations-5.26-block.dump`: bien the store format `block`.
- `recommendations-embeddings-aligned-5.26.dump`: ban co embedding cho `Movie.embedding`.
- `recommendations-embeddings-block-5.26.dump`: ban embedding voi store `block`.

Ban da load thanh cong bang Docker + `neo4j-admin database load`.

## 3. Mo hinh du lieu (Graph Schema)

### Node labels chinh

- `Movie`: thong tin phim (`title`, `year`, `plot`, `imdbRating`, ...)
- `User`: nguoi dung danh gia phim (`userId`, `name`)
- `Genre`: the loai phim (`name`)
- `Actor`: dien vien (`name`, `born`, `bio`, ...)
- `Director`: dao dien (`name`, `bio`, ...)

### Relationship types chinh

- `(:User)-[:RATED]->(:Movie)`
- `(:Movie)-[:IN_GENRE]->(:Genre)`
- `(:Actor)-[:ACTED_IN]->(:Movie)`
- `(:Director)-[:DIRECTED]->(:Movie)`

## 4. Snapshot so lieu thuc te (tu database da load)

So lieu ben duoi duoc lay truc tiep tu container `neo4j-recommendations` cua ban.

### Tong quan

| Chi so | Gia tri |
|---|---:|
| Total nodes | 28,863 |
| Total relationships | 166,261 |

### So node theo label

| Label | So luong |
|---|---:|
| Movie | 9,125 |
| User | 671 |
| Genre | 20 |
| Actor | 15,443 |
| Director | 4,091 |

Ghi chu quan trong:

- Tong theo label co the lon hon `total_nodes` vi 1 node co the mang nhieu label.
- Trong dataset nay co `487` node vua la `Actor` vua la `Director`.
- So node nguoi (Actor hoac Director, distinct) la `19,047`.

### So relationship theo loai

| Relationship | So luong |
|---|---:|
| RATED | 100,004 |
| ACTED_IN | 35,910 |
| IN_GENRE | 20,340 |
| DIRECTED | 10,007 |

### Mot vai thong ke mo ta

| Chi so | Gia tri |
|---|---:|
| So genre trung binh / movie | 2.23 |
| So rating trung binh / user | 149.04 |

## 5. Cach doc hinh visualization ban gui

Voi hinh graph mau ban vua chup:

- Cac node xanh la la `Movie` (ten phim hien trong dau ngoac kep).
- Cac node xanh duong la `Genre` (Action, Adventure, Comedy, ...).
- Mui ten `IN_GENRE` di tu `Movie` sang `Genre`.
- 1 phim co the thuoc nhieu genre, va 1 genre co nhieu phim.

No cho thay duoc ngay tinh chat "nhieu-nhieu" cua graph, va day la nen tang cho truy van goi y.

## 6. Cach minh giai thich bo data nay (khung 5 buoc)

Day la framework gon de ban thuyet trinh hoac viet bao cao:

1. Bai toan
   "Can goi y phim dua tren hanh vi rating va noi dung phim."
2. Thuc the
   "Co 5 loai node: Movie, User, Genre, Actor, Director."
3. Quan he
   "User RATED Movie; Movie IN_GENRE Genre; Actor/Director lien ket voi Movie."
4. Logic recommendation
   "User cung rate cung phim => co xac suat thich cac phim khac giong nhau."
5. Kiem chung
   "Chay query va doi chieu ket qua mau (vd: Crimson Tide -> danh sach recommendation)."

## 7. Query mau de trinh bay

### 7.1 Kiem tra tong node

```cypher
MATCH (n) RETURN count(n) AS total_nodes;
```

### 7.2 Lay 5 phim dau tien

```cypher
MATCH (m:Movie)
RETURN m.title, m.year, m.imdbRating
LIMIT 5;
```

### 7.3 Goi y phim dua tren co-rating

```cypher
MATCH (m:Movie {title: "Crimson Tide"})<-[:RATED]-(u:User)-[:RATED]->(rec:Movie)
RETURN DISTINCT rec.title AS recommendation
LIMIT 20;
```

### 7.4 Tim phim "tuong tu" theo overlap genre/actor/director

```cypher
MATCH (m:Movie {title: "The Matrix"})-[:ACTED_IN|:DIRECTED|:IN_GENRE]-(x)-[:ACTED_IN|:DIRECTED|:IN_GENRE]-(rec:Movie)
WHERE rec <> m
RETURN rec.title, COUNT(*) AS score
ORDER BY score DESC
LIMIT 10;
```

## 8. Cach lien ket voi cac buoc tiep theo

- Buoc 1 (ban da xong): Load dump vao Neo4j.
- Buoc 2: Hoc Cypher va schema dua tren data that.
- Buoc 3: Dung `graphql/` de expose API.
- Buoc 4: Test query qua GraphQL Playground va code examples.

## 9. Kiem tra nhanh de dam bao data "on"

Checklist nhanh:

- `MATCH (n) RETURN count(n)` = `28863`
- `MATCH ()-[r]->() RETURN count(r)` = `166261`
- Query recommendation tra ve danh sach phim (khong rong)
- Query movie sample tra ve title/year/rating hop ly

Neu 4 dong tren deu dung, co the coi he thong data da san sang cho API va demo.

