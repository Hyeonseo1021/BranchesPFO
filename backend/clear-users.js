// MongoDB 사용자 데이터 초기화 스크립트
const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017/mydatabase';

async function clearUsers() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('✅ MongoDB 연결 성공');

    const db = client.db('mydatabase');
    const result = await db.collection('users').deleteMany({});

    console.log(`✅ ${result.deletedCount}개의 사용자 데이터가 삭제되었습니다.`);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await client.close();
    console.log('✅ MongoDB 연결 종료');
  }
}

clearUsers();
