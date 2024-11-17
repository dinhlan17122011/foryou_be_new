import { Schema as _Schema, model,mongoose } from 'mongoose';
const Schema = _Schema;
const ObjectId = Schema.ObjectId;

const shoppingModels = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Liên kết với bảng Users
        required: true,
    },
    id:{type:ObjectId},
    image:{type:String,required: true},
    price:{type:String,required: true},
    quantity:{type:Number,required: true},
    totalPrice:{type:Number,required: true},
    writingcake:{type:String,required: true}
});

const MyModel = model('shoppingcart', shoppingModels);

export default MyModel;
