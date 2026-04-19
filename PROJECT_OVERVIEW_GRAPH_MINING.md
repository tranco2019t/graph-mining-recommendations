# Gioi thieu du an Recommendations (goc nhin Graph Mining)

Tai lieu nay dung de gioi thieu nhanh du an, muc tieu, cau truc thu muc, va luong xu ly tong the.
Noi dung duoc viet theo huong phuc vu bao cao mon/bai toan **Graph Mining**.

## 1. Du an nay lam gi?

Day la du an xay dung he goi y phim dua tren **du lieu do thi** trong Neo4j.

Thay vi luu du lieu theo bang quan he truyen thong, du an mo hinh hoa he thong phim thanh mot graph gom:

- `Movie` (phim)
- `User` (nguoi dung)
- `Genre` (the loai)
- `Actor` (dien vien)
- `Director` (dao dien)

Va cac quan he:

- `(:User)-[:RATED]->(:Movie)`
- `(:Movie)-[:IN_GENRE]->(:Genre)`
- `(:Actor)-[:ACTED_IN]->(:Movie)`
- `(:Director)-[:DIRECTED]->(:Movie)`

Tu do, he thong khai thac cau truc ket noi de:

- tim phim tuong tu
- goi y phim cho user/cho mot phim dau vao
- trinh bay ket qua qua GraphQL API.

## 2. Muc tieu chinh cua du an

### 2.1 Muc tieu ky thuat

- Xay dung CSDL do thi Neo4j tu dump file.
- Viet truy van Cypher de phan tich va recommendation.
- Expose du lieu qua GraphQL API de de tich hop frontend/script.

### 2.2 Muc tieu Graph Mining (phu hop bao cao)

- Mo hinh hoa bai toan recommendation thanh bai toan tren graph khong dong nhat (heterogeneous graph).
- Khai thac neighborhood va path de sinh candidate.
- Tinh diem tuong dong/score dua tren overlap quan he.
- Giai thich duoc ket qua recommendation bang duong di trong graph (explainable path).

## 3. Nhan manh goc nhin Graph Mining

Trong du an nay, recommendation khong chi la "loc theo dieu kien", ma la mot bai toan khai pha do thi:

1. **Path-based recommendation (collaborative)**  
   `Movie <- RATED - User - RATED -> Movie`  
   Y nghia: nhung phim duoc cung nhom user danh gia se la ung vien recommendation.

2. **Similarity mining theo overlap thuc the noi dung**  
   `Movie - (Actor|Director|Genre) - Movie`  
   Y nghia: 2 phim chia se nhieu dinh "ngu canh" (dien vien, dao dien, the loai) thi giong nhau hon.

3. **Ranking theo tan suat ket noi**  
   Dem so overlap (`COUNT(*)`) de xep hang recommendation.

Noi ngan gon: day la graph mining dua tren **khai thac lien ket + xep hang theo do manh ket noi**.

## 4. Cau truc thu muc toan du an

```text
recommendations/
|-- data/                     # dump files Neo4j, du lieu nguon
|-- graphql/                  # GraphQL server (schema, index.js, .env)
|-- code/
|   |-- python/               # script Python test recommendation/actors
|   |-- html/                 # demo HTML/CSS/JS goi GraphQL API
|   |-- javascript/           # vi du JS ket noi Neo4j truc tiep
|   |-- java/                 # vi du Java (tuy chon)
|   `-- graphql/              # vi du GraphQL client
|-- documentation/            # tai lieu va hinh anh mo ta mo hinh
|-- bloom/                    # perspective cho Neo4j Bloom
|-- B1_Dataset_gioithieu_detai.md
|-- B2_Check_data_trenNeo4j.md
|-- B3_GUIDE_VI.md
`-- B4_Test_API_Python_Java_HTML.md
```

### Vai tro tung khoi trong flow bao cao

- `data/`: chung minh nguon du lieu va kha nang tai tao database.
- `graphql/`: chung minh kha nang san xuat API tren graph.
- `code/python` + `code/html`: chung minh kha nang tieu thu ket qua graph mining.
- `documentation/`: hinh anh/phu luc cho slide.
- `B1 -> B4`: bo tai lieu huong dan va quy trinh thuc nghiem.

## 5. Luong xu ly tong the (end-to-end)

## 5.1 Pipeline 4 buoc

1. **Data ingest (B1)**  
   Load dump vao Neo4j (Docker), kiem tra node/relationship.

2. **Graph query & understanding (B2)**  
   Chay Cypher de hieu schema va khai thac recommendation query.

3. **API layer (B3)**  
   Khoi dong GraphQL server, map schema graph sang endpoint truy van.

4. **Validation & demo (B4)**  
   Test query tren Playground + script Python + web demo HTML.

## 5.2 Luong xu ly recommendation tren graph

Vi du recommendation cho phim `Crimson Tide`:

1. Chon seed node `Movie {title: "Crimson Tide"}`.
2. Di nguoc quan he `RATED` sang tap `User` da rate phim nay.
3. Tu tap user do, di tiep `RATED` sang cac phim khac (`rec:Movie`).
4. Loai trung lap, co the tinh them score, sau do xep hang.

Cypher mau:

```cypher
MATCH (m:Movie {title: "Crimson Tide"})<-[:RATED]-(u:User)-[:RATED]->(rec:Movie)
RETURN DISTINCT rec.title AS recommendation
LIMIT 20;
```

## 5.3 Luong similarity tren graph

Vi du similarity cho `Matrix, The`:

1. Chon seed movie.
2. Tim cac node overlap qua `ACTED_IN | DIRECTED | IN_GENRE`.
3. Dem overlap de tao score.
4. Tra ve top-N phim co score cao.

## 6. Gia tri hoc thuat cho bao cao Graph Mining

Du an nay phu hop bao cao Graph Mining vi:

- Co mo hinh graph ro rang, da loai node/edge.
- Co bai toan thuc te (recommendation) de demo path mining.
- Co metric ranking duoc xay tu cau truc ket noi.
- Co API va demo de chung minh tinh ung dung.

Neu can mo rong bao cao, co the them:

- so sanh collaborative vs content-based recommendation
- danh gia chat luong ket qua theo top-K
- phan tich explainability bang cac duong di cu the tren graph.

## 7. Tom tat 1 doan de dua vao mo dau bao cao

"Du an Recommendations su dung Neo4j de mo hinh hoa bai toan goi y phim thanh bai toan Graph Mining tren do thi khong dong nhat gom Movie-User-Genre-Actor-Director. He thong khai thac cac duong di va muc do overlap lien ket de sinh va xep hang phim de xuat, sau do cung cap ket qua qua GraphQL API va cac script demo."

