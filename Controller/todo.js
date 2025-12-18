const TODO = require("../Model/todo")

async function getTodos(req,res){
    try{
        const search = req.query.search;
        console.log("search",search)
        let page = parseInt(req.query.page)   
        console.log("page",page);
        
        const limit = parseInt(req.query.limit) || 5;
        const total = await TODO.countDocuments();
        const totalPages = Math.ceil(total/limit);
        if(isNaN(page)){
            page = parseInt(Math.ceil(total/limit));
            console.log("page",page); 
        }

        console.log("page&limit",page,limit);

        let skip = (page-1)*limit;
        console.log("skip&total&totalPages",skip,total,totalPages);

        const todos = await TODO.find( {todo: {$regex:search, $options:"i"}} ).skip(skip).limit(limit);
        // console.log("getTodos",todos);
        res.json({todos,total,page,totalPages});
    }
    catch(error){
        console.log("getError:",error.message);
    }
}

async function setTodos(req,res){
    try{
        console.log("todo",req.body)
        const {todo} = req.body;
        const postRes = await TODO.create({todo});
        // console.log("postRes",postRes);
        res.json({postRes});
    }
    catch(error){
        console.log("postError:",error.message);
    }
}

async function updateTodos(req,res){
    try{
        console.log("updateTodos",req.body,req.params)
        const {id} = req.params;
        const data = req.body.todo;
        const updateRes = await TODO.findByIdAndUpdate(id, {todo:data}, {new:true});
        // console.log("updateRes",res)
        res.json({updateRes})
    }
    catch(error){
        console.log("updateError:",error.message);
    }
}

async function deleteTodos(req,res){
    try{
        const {id} = req.params;
        const delRes = await TODO.findByIdAndDelete(id);
        // console.log("delRes",delRes);
        res.json({delRes})
    }
    catch(error){
        console.log("delError:",error.message);
    }
}

async function updateStatusTodos(req,res) {
   try{
    // console.log(req.params)
    const {id} = req.params;

    // console.log(req.body)
    const {status} = req.body;

    console.log("status",status)
    const statusRes = await TODO.findByIdAndUpdate(id,{status},{new:true})
    console.log("statusRes",statusRes)
    res.json({statusRes})
   }
   catch(error){
    console.log("updateStatusTodosError", error.message);
   }
}

async function getStatusUpdatedTodos(req,res){
    try{
        const {status} = req.query;
        const filter={};
        if(status){
            filter.status = status
        }
        console.log("status",status)
        const statusUpdatedTodos = await TODO.find(filter)
        console.log("statusUpdatedTodos",statusUpdatedTodos)
        res.json({statusUpdatedTodos});
    }
    catch(error){
        console.log("getStatusUpdatedTodos", error.message)
    }
}

module.exports = {getTodos,setTodos,updateTodos,deleteTodos,updateStatusTodos,getStatusUpdatedTodos}