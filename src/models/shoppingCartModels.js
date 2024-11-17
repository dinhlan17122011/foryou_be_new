import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const ObjectId = Schema.ObjectId;

const shoppingModels = new Schema({
    id:{type:ObjectId},
    image:{type:String,required: true},
    price:{type:String,required: true},
    quantity:{type:Number,required: true},
    totalPrice:{type:Number,required: true},
    writingcake:{type:String,required: true}
});

const MyModel = model('shoppingcart', shoppingModels);

export default MyModel;
