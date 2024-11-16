import { connect } from 'mongoose';

// Kết nối MongoDB

function  data (params) {
  connect('mongodb://localhost:27017/foryou', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Kết nối MongoDB thành công!'))
    .catch((err) => console.log('Kết nối MongoDB thất bại:', err));
  
}

export default data