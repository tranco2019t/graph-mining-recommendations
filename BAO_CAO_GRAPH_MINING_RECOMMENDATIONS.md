# BAO CAO DE TAI GRAPH MINING
## Chu de: He thong goi y phim su dung Neo4j Graph Database

## 1. Tong quan de tai

Du an xay dung mot he thong recommendation tren bo du lieu phim, dien vien, dao dien, the loai va hanh vi danh gia cua nguoi dung. 
Thay vi mo hinh bang bang quan he truyen thong, du an su dung **labeled property graph** trong Neo4j de khai thac cac lien ket do thi va tao goi y theo thoi gian thuc.

Muc tieu cua he thong:

- De xuat phim lien quan voi mot phim dang xem.
- De xuat phim dua tren hanh vi rating cua cong dong user.
- So sanh cac chien luoc recommendation theo goc nhin Graph Mining.
- Trien khai API de trinh bay va demo ket qua.

## 2. Bai toan Graph Mining trong de tai

### 2.1 Dinh nghia bai toan

Cho do thi khong dong nhat gom cac loai dinh/quan he:

- Dinh: `Movie`, `User`, `Genre`, `Actor`, `Director`
- Quan he: `RATED`, `IN_GENRE`, `ACTED_IN`, `DIRECTED`

Can tim tap phim `rec:Movie` co do lien quan cao nhat voi:

1. mot seed movie, hoac
2. mot seed user

dua tren cau truc ket noi va trong so rating.

### 2.2 Ly do chon graph cho recommendation

- **Path-centric**: de xuat duoc tao tu cac duong di y nghia (`User-RATED-Movie`, `Movie-IN_GENRE-Genre-Movie`).
- **Real-time traversal**: index-free adjacency phu hop truy van dong va de xuat online.
- **Giai thich duoc**: moi ket qua de xuat co the truy vet theo path trong graph.

## 3. Nguon du lieu va mo hinh du lieu

### 3.1 Nguon du lieu

Du lieu ket hop tu:

- Open Movie Database (metadata phim)
- MovieLens (hanh vi danh gia phim)

### 3.2 Kich thuoc du lieu (ban da load local)

- Nodes: `28,863`
- Relationships: `166,261`

### 3.3 Mo hinh do thi

Mo hinh trung tam dat `Movie` lam node hub, lien ket toi:

- `Genre` qua `IN_GENRE`
- `Actor` qua `ACTED_IN`
- `Director` qua `DIRECTED`
- `User` qua `RATED`

Anh mo ta mo hinh:

- `documentation/img/model.png`
- `documentation/img/datamodel.png`

## 4. Phan tich noi dung cac hinh trong thu muc `documentation/img`

Muc nay tong hop y nghia cua cac hinh minh hoa trong de tai (phuc vu bao cao/slides).

### 4.1 Nhom hinh gioi thieu boi canh

1. `openmoviegraph.png`  
   Gioi thieu concept "Open Movie Graph", mang tinh banner/nhan dien bo du lieu.

2. `title1.png`  
   Minh hoa do thi user-movie va ket noi chung giua hai user thong qua cac phim da rate.

3. `icon-movie.svg`  
   Icon chu de phim dung cho nhan dien de tai.

### 4.2 Nhom hinh mo hinh do thi va data integration

4. `lpg.png`  
   Minh hoa labeled property graph tong quat (node, relationship, direction, property).

5. `datamodel.png`  
   Vi du cu the tren domain phim: thong tin movie, user rating, actor/director/genre.

6. `model.png`  
   So do rut gon, the hien `Movie` la trung tam lien ket da loai thuc the.

7. `silo1.png`  
   Minh hoa bai toan data silos (Consumers, Products, Payments, Social, Suppliers) dang bi tach roi.

8. `silo2.png`  
   Minh hoa ket noi lai cac silo thanh mot graph logic thong nhat (Customer Graph, Product Graph, Supply Graph).

### 4.3 Nhom hinh recommendation theo noi dung va hanh vi

9. `content1.png`  
   Hai phim duoc noi boi overlap trait (genre, actor, director) -> content-based filtering.

10. `genres.png`  
   Hai movie chung genre (`Action`, `Adventure`) -> similarity theo trait.

11. `cf1.png`  
   Collaborative filtering co ban: 2 user dong danh gia mot tap phim chung, tu do sinh phim de xuat.

12. `cf2.png`  
   Minh hoa user-movie rating graph, lam nen cho similarity giua user.

13. `example.png`  
   Star-shaped user rating ego network (1 user va cac phim da rate), dung de phan tich so thich ca nhan.

### 4.4 Nhom hinh similarity metrics

14. `jaccard.png`  
   Cong thuc Jaccard: do do tuong dong giua 2 tap trait.

15. `cosine.png`  
   Cong thuc cosine similarity: do giong nhau huong vector rating.

16. `pearson.png`  
   Cong thuc Pearson correlation: do tuong quan sau khi chuan hoa theo mean rating.

## 5. Co so ly thuyet va thuat toan recommendation

## 5.1 Content-based filtering

Tu tuong:

- item nao co trait giong item nguoi dung quan tam thi duoc de xuat.

Trait trong de tai:

- `Genre`, `Actor`, `Director`

Cypher co ban:

```cypher
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)<-[:IN_GENRE]-(rec:Movie)
WHERE m.title = 'Inception'
RETURN rec.title, count(*) AS commonGenres
ORDER BY commonGenres DESC
LIMIT 10;
```

Weighted score (vi du):

- genre x5, actor x3, director x4

Y nghia Graph Mining:

- tinh do tuong dong dua tren so overlap trong k-hop neighborhood.

## 5.2 Collaborative filtering

Tu tuong:

- user co hanh vi rating giong nhau se de xuat phim cho nhau.

Path co ban:

`Movie <-[:RATED]- User -[:RATED]-> Movie`

Cypher:

```cypher
MATCH (m:Movie {title: 'Crimson Tide'})<-[:RATED]-(u:User)-[:RATED]->(rec:Movie)
WITH rec, COUNT(*) AS usersWhoAlsoWatched
RETURN rec.title, usersWhoAlsoWatched
ORDER BY usersWhoAlsoWatched DESC
LIMIT 25;
```

Y nghia Graph Mining:

- peer discovery + candidate generation dua tren common interactions.

## 5.3 Similarity metrics

### Jaccard

- phu hop khi so sanh theo tap trait (set overlap).
- khoang gia tri: `[0,1]`.

### Cosine

- xem moi user la vector rating.
- phu hop khi can do "do giong huong" preference.

### Pearson

- bo anh huong do "de tay/cham tay" cua tung user (mean rating bias).
- phu hop recommendation khi users co xu huong cho diem khac nhau.

## 5.4 Neighborhood-based recommendation (kNN)

Quy trinh:

1. Tim top-k user giong seed user nhat (Pearson/Cosine).
2. Lay phim ma nhom nay danh gia cao, nhung seed user chua xem.
3. Tong hop diem de xep hang.

Y nghia:

- day la bai toan neighborhood mining tren user-item graph.

## 6. Kien truc he thong

He thong chia 3 tang:

1. **Storage/Graph Layer**  
   Neo4j luu toan bo graph recommendation.

2. **Query/API Layer**  
   GraphQL server (`graphql/`) map schema va cung cap endpoint truy van.

3. **Client/Demo Layer**  
   Playground, Python scripts, HTML demo goi API va hien ket qua.

## 7. Cau truc thu muc du an (ban dang su dung)

```text
recommendations/
|-- data/                           # dump file Neo4j
|-- graphql/                        # GraphQL server (schema, index.js, .env)
|-- code/
|   |-- python/                     # script Python demo local
|   |-- html/                       # demo web HTML/CSS/JS
|   |-- javascript/                 # vi du JS khac
|   |-- java/                       # vi du Java (tuy chon)
|   `-- graphql/                    # vi du GraphQL client
|-- documentation/
|   |-- recommendations.adoc
|   |-- recommendations.workspace.adoc
|   `-- img/                        # bo hinh minh hoa (da phan tich o Muc 4)
|-- B1_Dataset_gioithieu_detai.md
|-- B2_Check_data_trenNeo4j.md
|-- B3_GUIDE_VI.md
|-- B4_Test_API_Python_Java_HTML.md
`-- PROJECT_OVERVIEW_GRAPH_MINING.md
```

## 8. Luong xu ly tong the

1. Load dump vao Neo4j (B1)
2. Truy van Cypher de hieu schema + recommendation (B2)
3. Mo API GraphQL de truy cap graph (B3)
4. Test va demo bang Playground/Python/HTML (B4)

Data flow:

`Data dump -> Neo4j Graph -> Cypher/GraphQL -> Demo outputs`

## 9. Ket qua dat duoc

- Da khoi tao thanh cong graph recommendations tren Neo4j.
- Da truy van duoc content-based va collaborative recommendations.
- Da trien khai GraphQL API local.
- Da demo thanh cong query `similar(first: 5)` cho `Matrix, The`.

## 10. Danh gia uu diem va han che

### Uu diem

- Mo hinh graph truc quan, de mo rong.
- Giai thich duoc recommendation bang path.
- Tot cho bai toan ket noi da nguon du lieu (de-silo).

### Han che

- Chua benchmark chat luong recommendation theo metric (Precision@K, Recall@K, NDCG).
- Chua dua yeu to thoi gian (timestamp decay) vao scoring.
- Chua huan luyen embedding/feature-rich model cho ranking sau cung.

## 11. Huong phat trien

- Them temporal weighting cho `RATED`.
- Ket hop Graph Data Science (FastRP + kNN + link prediction).
- Danh gia A/B giua content-based, CF va hybrid model.
- Bo sung explainability report cho moi recommendation.

---

## 12. HUONG DAN CHAY VA DEMO (bat buoc)

Phan nay viet theo dung moi truong Windows/CMD ma nhom da dung.

### 12.1 Chuan bi

- Da cai Docker
- Da cai Node.js + npm
- Da cai Python

### 12.2 Khoi dong Neo4j (neu chua chay)

```cmd
docker run -d --name neo4j-recommendations -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password123 -v neo4j-recommendations-data:/data neo4j:5.26
```

Kiem tra:

```cmd
docker ps
docker exec neo4j-recommendations cypher-shell -u neo4j -p password123 "MATCH (n) RETURN count(n) AS total_nodes;"
```

Ky vong: `total_nodes = 28863`

### 12.3 Chay GraphQL Server

```cmd
cd /d D:\Graph_CK\recommendations\graphql
npm run start
```

Mo:

`http://localhost:4000`

### 12.4 Demo tren GraphQL Playground

Query co ban:

```graphql
{
  movies(options: { limit: 5 }) {
    title
    year
    imdbRating
  }
}
```

Query recommendation:

```graphql
{
  movies(where: { title: "Matrix, The" }) {
    movieId
    title
    year
    similar(first: 5) {
      title
      year
    }
  }
}
```

### 12.5 Demo bang Python

Terminal moi:

```cmd
cd /d D:\Graph_CK\recommendations
pip install neo4j
python code\python\example_local.py --movie "Matrix, The"
python code\python\example_actors_local.py --movie "Matrix, The"
```

### 12.6 Demo bang HTML/CSS/JS

Terminal moi:

```cmd
cd /d D:\Graph_CK\recommendations\code\html
python -m http.server 5500
```

Mo browser:

`http://localhost:5500`

Neu bi `Failed to fetch`:

- dam bao terminal GraphQL van dang chay port `4000`
- doi endpoint tren form thanh `http://127.0.0.1:4000/`

### 12.7 Kich ban demo de bao cao tren lop

1. Mo so do schema trong Neo4j Browser.
2. Chay query `movies(limit:5)`.
3. Chay query `similar(first:5)` voi `Matrix, The`.
4. Chay script Python de in recommendation.
5. Mo web demo va bam `Load similar`.
6. Ket luan: cung mot graph backend, nhieu cach tieu thu ket qua (Playground, Python, Web).

