import { Schema as _Schema, model, mongoose} from 'mongoose';
const Schema = _Schema;
const ObjectId = Schema.ObjectId;

const placer = new Schema({
  name:{type: String,required: true},
  phone:{type:Number,required: true},  
})

const receiver = new Schema({
    similarToAbove: { type: Boolean, required: true },
    name: { type: String },
    phone: { type: Number },
})

const address = new Schema({
    district:{type : String,required: true},
    ward:{type:String,required: true}
})

const bill = new Schema({
    tickBill:{type : Boolean,required: true}
})

const time = new Schema({
    day:{type:String,required: true},
    time:{type:String,required: true}
})

const orderConfirmationModels = new Schema({
  id:{type : ObjectId},
  userId: {              // Liên kết với người dùng
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},
  placers:placer,
  receivers:receiver,
  addresss:address,
  bills:bill,
  times:time
});

orderConfirmationModels.pre('save', function (next) {
    if (this.receiver.similarToAbove) {
      this.receiver.name = this.placer.name;
      this.receiver.phone = this.placer.phone;
    }
    next();
  });

const MyModel = model('orderConfirmationModels', orderConfirmationModels);

export default MyModel;
