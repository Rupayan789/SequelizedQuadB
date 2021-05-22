const { sequelize ,User,Post}=require('./models');
const express=require('express');
const app=express();
const PORT=5000 || process.env.PORT;
app.use(express.json())
app.post('/users',async (req,res)=>{
    const {name,email,role}=req.body;
    try{
        const user=await User.create({
            name,
            email,
            role
        })
        return res.json(user)
    }
    catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
})
app.get('/users',async(req,res)=>{
    try{
        const users=await User.findAll({include:'posts'});

        return res.json(users)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong"})
    }
})
app.get('/users/:id',async(req,res)=>{
    const uuid=req.params.id;
    try{
        const user=await User.findOne({
            where: { uuid },
            include:'posts'
        })
        return res.json(user);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Something went wrong"})
    }
})
app.delete('/users/:uid',async(req,res)=>{
    const uuid=req.params.uid;
    try{
        const user=await User.findOne({
            where: { uuid }
        })
        user.destroy();
        res.status(200).json({message:"User Deleted"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Something went wrong"})
    }
})
app.put('/users/:uid',async(req,res)=>{
    const uuid=req.params.uid;
    const {name,email,role}=req.body;
    try{
        const user=await User.findOne({
            where :{
                uuid
            }
        })
        user.name=name;
        user.email=email;
        user.role=role;
        await user.save();
        return res.json(user);

    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong"})
    }
})
app.post('/posts',async (req,res)=>{
    const { userUuid , body }=req.body;
    try{
        const user=await User.findOne({
            where:{
                uuid:userUuid
            }
        });
        const post=await Post.create({
            body,
            userId:user.id
        })
        return res.json(post)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong"})
    }

})
app.get('/posts',async(req,res)=>{
    try{
        const posts=await Post.findAll({include:'user'});
        return res.json(posts);
    }
    catch(err){
        console.log(err);
        return res.json({error:"Something went wrong"})
    }
    
})
app.listen(PORT,async()=>{
    await sequelize.authenticate()
    console.log("Server running on http://localhost:5000");
    console.log("Database Connected");
})

