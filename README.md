## 기술
<h3 align="center"> BackEnd </h3>
<div align="center">
<img alt="Static Badge" src="https://img.shields.io/badge/-Typescript-%233178C6?style=flat-square&logo=typescript&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-Nest.js-%23E0234E?style=flat-square&logo=nestjs&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-typeORM-%23FE0803?style=flat-square&logo=typeorm&logoColor=white">
</div>

<h3 align="center"> Tools </h3>
<div align="center">
<img alt="Static Badge" src="https://img.shields.io/badge/-Git-%23F05032?style=flat-square&logo=git&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-Github-%23181717?style=flat-square&logo=github&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-Vscode-%23007ACC?style=flat-square&logo=visualstudiocode&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-Amazon%20EC2-%23FF9900?style=flat-square&logo=amazonec2&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-Amazon%20RDS-%23527FFF?style=flat-square&logo=amazonrds&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-Ubuntu-%23E95420?style=flat-square&logo=ubuntu&logoColor=white">
</div>

## ERD
![ex_screenshot](./erd.png)

## API 명세서
![ex_screenshot](./api1.png)
![ex_screenshot](./api2.png)

## 프로젝트 설치 및 실행 방법
### 코드 불러오기
```
git clone https://github.com/lemonpie313/spartaNodejs07-tickets.git .
```

### 백엔드
#### 2. 패키지 설치
```
cd backend
npm install
```

#### 3. .env 파일 생성
```
PORT=3000
DB_HOST="사용할 RDS 엔드포인트"
DB_PORT=사용할 RDS 포트(3306)
DB_USERNAME="사용할 RDS의 계정이름"
DB_PASSWORD="사용할 RDS의 비밀번호"
DB_NAME="사용할 RDS DB 이름"
DB_SYNC=true
JWT_ACCESS_SECRET_KEY="jwt 토큰 시크릿 키(임의 지정)"
PASSWORD_HASH=10
```

#### 4. 서버 실행
```
npm run start:dev
```

#### 5. 서버 접속
- ```localhost:3000/api``` 로 접속
- swagger 를 이용하여 API 테스트 가능


### 프론트엔드
#### 2. 패키지 설치
```
# 디렉토리가 backend일 경우 > cd ..
cd frontend
npm install
```

#### 3. 서버 실행
```
npm start
```
#### 4. 서버 접속
- ```localhost:3000``` 로 접속


## Github Commit Rules
| 작업 타입	| 작업내용 |
|------|------|
| ✨ update | 해당 파일에 새로운 기능이 생김 |
| 🎉 add |	없던 파일을 생성함, 초기 세팅 |
| 🐛 bugfix	| 버그 수정 |
| ♻️ refactor |	코드 리팩토링 |
| 🩹 fix |  수정 |
| 🚚 move	| 파일 옮김/정리 |
| 🔥 del |	기능/파일을 삭제 |
| 🍻 test	| 테스트 코드를 작성 |
| 💄 style	| css |
| 🙈 gitfix	| gitignore 수정 |
| 🔨script	| package.json 변경(npm 설치 등) |