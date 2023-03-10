import { Schema, model, connect } from 'mongoose';
const env = require('../env');
import bcrypt from "bcrypt";

type diaryPage = {
  date: Date,
  message: string;

}
// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string,
  nickName: string,
  password : string,
  email: string,
  pages: diaryPage[]
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true},
  nickName: { type: String, required: true, unique: true},
  password :{type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true},
  pages: {type: [] ,required: true}
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

async function createUser(name: string, nickName:string,  password: string, email: string) {

  let protectedPassword = "";

  await connect(env.MONGO_URL);

  bcrypt.genSalt(10, async(err, salt)=>{
    bcrypt.hash(password, salt, async(err, hash) =>{

      const user = new User({
        name,
        nickName,
        password: hash,
        email,
        diaryPage: {}
      });

      await user.save()
      .then(() =>{
        console.log("User saved")
        return "User saved successfully";
      }).catch(() => {
        return "Something went wrong when adding user";
      })
    })

  })
}

async function getUserById(id: string) {
  
  const user = await User.findById(id).exec();
  return user;
}
createUser("Minha Maria", "maria.jujuba", "maria@jujuba", "maria@jujuba.com")
.catch((err)=>{console.log(err)})

//getUser("640a70a1a30e15fda4d498c8").then((user) => console.log("Found:" + user))
