# Buoc 3 - Setup GraphQL API Server (ban da fix thuc te)

Tai lieu nay la ban cap nhat theo dung luong ban vua lam xong tren may: GraphQL chay local, ket noi Neo4j Docker local, query `similar` da hoat dong.

## 1. Muc tieu

Sau Buoc 3, can dat:

- Chay duoc GraphQL server o `http://localhost:4000`.
- API doc dung data tu Neo4j local (`localhost:7687`).
- Query nang cao `similar(first: ...)` tra ve ket qua.

## 2. Cong nghe dung trong buoc nay

- `Node.js` + `npm`
- `Apollo Server`
- `@neo4j/graphql`
- `neo4j-driver`
- Neo4j Docker (database local)

## 3. Input va Output

| Thanh phan | Noi dung |
|---|---|
| INPUT | Neo4j container `neo4j-recommendations` dang chay |
| INPUT | DB da co data (`28863` nodes) |
| INPUT | Thu muc app: `graphql/` |
| OUTPUT | GraphQL server ready tai `http://localhost:4000` |
| OUTPUT | Query `movies` va `similar` deu tra du lieu |

## 4. Cac buoc setup chuan

### Buoc 3A - Kiem tra Neo4j container

```bash
docker ps
```

Can thay:

- container `neo4j-recommendations` dang `Up`
- port `7474` va `7687` da map ra host

### Buoc 3B - Vao thu muc GraphQL

```bash
cd D:\Graph_CK\recommendations\graphql
```

### Buoc 3C - Cau hinh `.env` ve local DB

File `graphql/.env` phai la:

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password123
NEO4J_DATABASE=neo4j
```

Luu y:

- `7474` la Browser UI.
- `7687` la Bolt port cho app.

### Buoc 3D - Cai dependencies

```bash
npm install
```

Neu dung PowerShell bi chan script (`npm.ps1 cannot be loaded`), dung:

```bash
npm.cmd install
```

### Buoc 3E - Start GraphQL server

```bash
npm run start
```

Hoac (neu can):

```bash
npm.cmd run start
```

Ket qua mong doi:

```text
GraphQL server ready at http://localhost:4000/
```

## 5. Test API tren Playground

Mo `http://localhost:4000`.

### Query test co ban

```graphql
{
  movies(options: { limit: 5 }) {
    title
    year
    imdbRating
  }
}
```

### Query test nang cao (`similar`)

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

Neu tra ve danh sach phim tuong tu, Buoc 3 dat yeu cau.

## 6. Giai thich thay doi ky thuat da fix

Trong lan chay thuc te, ban gap loi:

- `Unknown function 'apoc.cypher.runFirstColumn'`

Nguyen nhan:

- Field `similar` truoc day dung `@cypher`, va ban `@neo4j/graphql` nay sinh query phu thuoc routine APOC cu.

Cach da fix:

- Trong `graphql/schema.graphql`: bo `@cypher` o field `similar`.
- Trong `graphql/index.js`: them custom resolver `Movie.similar`.
- Resolver moi query truc tiep Neo4j va fallback:
  - uu tien `movieId`
  - neu khong co `movieId` thi dung `title`

Ket qua:

- Khong con bi phu thuoc `apoc.cypher.runFirstColumn`.
- Query `similar` da chay on dinh.

## 7. Loi thuong gap va cach xu ly nhanh

### Loi 1: `Unknown function 'apoc.cypher.runFirstColumn'`

Cach xu ly:

- Dam bao code da cap nhat theo ban fix moi (`schema.graphql` + `index.js`).
- Restart lai GraphQL server sau khi sua code.

### Loi 2: `Expected parameter(s): movieId`

Cach xu ly:

- Day la code cu chua fallback.
- Pull/luu dung ban `index.js` moi roi restart server.
- Hoac tam thoi them `movieId` trong query.

### Loi 3: `ECONNREFUSED 127.0.0.1:7687`

Cach xu ly:

- Kiem tra `docker ps`.
- Cho Neo4j boot xong roi moi query.

### Loi 4: Bam Play khong ra ket qua

Cach xu ly:

- Kiem tra query syntax (khong du/dieu dau ngoac).
- Xoa ky tu du thua trong o query (vi du `re` o cuoi).

## 8. File quan trong trong Buoc 3

- `graphql/.env`: thong tin ket noi DB local
- `graphql/schema.graphql`: dinh nghia type/relationship
- `graphql/index.js`: khoi tao server + custom resolver `similar`

## 9. Checklist hoan thanh Buoc 3

Danh dau xong khi ban da:

- Chay duoc `npm install` (hoac `npm.cmd install`).
- Start duoc server va thay `GraphQL server ready...`.
- Query `movies(limit:5)` tra du lieu.
- Query `similar(first:5)` tra du lieu.
- Khong con loi APOC/parameter missing.

Neu check du cac dong tren, ban chinh thuc xong Buoc 3 va san sang Buoc 4.
