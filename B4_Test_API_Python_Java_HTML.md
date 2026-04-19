# Buoc 4 - Test API va Demo (Python + HTML/CSS/JS)

Ban nay la B4 viet lai theo dung flow ban dang dung, KHONG can C# va KHONG can Go.

## 1. Muc tieu

Sau Buoc 4, ban can:

- Test duoc GraphQL API tren Playground.
- Chay duoc 2 script Python local.
- Chay duoc trang demo HTML/CSS/JS goi API.

## 2. Input va Output

| Thanh phan | Noi dung |
|---|---|
| INPUT | Neo4j Docker dang chay (`localhost:7687`) |
| INPUT | GraphQL server dang chay (`localhost:4000`) |
| INPUT | Cac file trong `code/python` va `code/html` |
| OUTPUT | Query GraphQL tra du lieu dung |
| OUTPUT | Python in duoc recommendation + actors |
| OUTPUT | HTML demo hien JSON response |

## 3. Chay dung terminal (rat quan trong)

Ban dung 3 terminal rieng:

1. Terminal A (Neo4j): de container chay (`docker ps` thay `neo4j-recommendations` la `Up`).
2. Terminal B (GraphQL):

```bash
cd /d D:\Graph_CK\recommendations\graphql
npm run start
```

3. Terminal C (test Python hoac HTML): chay command trong root repo.

Neu Terminal B tat, HTML demo se bao `Failed to fetch`.

## 4. Cac buoc test chi tiet

### Buoc 4A - Test GraphQL tren Playground

Mo:

```text
http://localhost:4000
```

Query 1 (co ban):

```graphql
{
  movies(options: { limit: 5 }) {
    title
    year
    imdbRating
  }
}
```

Query 2 (`similar`):

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

Query 3 (user-rated):

```graphql
{
  users(options: { limit: 2 }) {
    userId
    rated(options: { limit: 3 }) {
      title
    }
  }
}
```

### Buoc 4B - Test Python recommendation

Chay tu root repo:

```bash
cd /d D:\Graph_CK\recommendations
pip install neo4j
python code\python\example_local.py --movie "Matrix, The"
```

### Buoc 4C - Test Python actors

```bash
cd /d D:\Graph_CK\recommendations
python code\python\example_actors_local.py --movie "Matrix, The"
```

### Buoc 4D - Test HTML/CSS/JS demo

1. Chay static server:

```bash
cd /d D:\Graph_CK\recommendations\code\html
python -m http.server 5500
```

2. Mo browser:

```text
http://localhost:5500
```

3. Tren form:

- Endpoint: `http://localhost:4000/` (neu fail thi doi `http://127.0.0.1:4000/`)
- Movie title: `Matrix, The`

4. Bam `Load 5 movies` hoac `Load similar`.

## 5. Loi thuong gap (ban da gap roi) va cach xu ly

### Loi 1: `python: can't open file ...graphql\code\python\...`

Nguyen nhan:

- Ban dang o thu muc `graphql`, duong dan tuong doi bi sai.

Cach xu ly:

- Ve root repo roi chay:

```bash
cd /d D:\Graph_CK\recommendations
python code\python\example_local.py --movie "Matrix, The"
```

### Loi 2: HTML bao `Error: Failed to fetch`

Nguyen nhan:

- GraphQL server port 4000 khong chay.

Cach xu ly:

- O terminal khac, chay lai:

```bash
cd /d D:\Graph_CK\recommendations\graphql
npm run start
```

### Loi 3: `404 /favicon.ico` trong `python -m http.server`

Khong phai loi. Co the bo qua.

### Loi 4: Khong ket noi Bolt tu Python

Cach xu ly:

- `docker ps` kiem tra Neo4j dang `Up`.
- Kiem tra user/pass trong file Python:
  - user: `neo4j`
  - pass: `password123`

## 6. File B4 dang dung

- `code/python/example_local.py`
- `code/python/example_actors_local.py`
- `code/html/index.html`
- `code/html/style.css`
- `code/html/app.js`

## 7. Checklist hoan thanh Buoc 4

Danh dau xong khi ban da:

- Chay duoc 3 query GraphQL o `localhost:4000`.
- Script `example_local.py` in ra recommendation.
- Script `example_actors_local.py` in ra actor list.
- Trang HTML demo goi API va hien JSON response.

Neu check du 4 dong nay, B4 hoan tat.
