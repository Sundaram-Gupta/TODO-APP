import React,{ useState,useEffect } from 'react'
import axios from "axios";
import styles from './cssStyle';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //For Updating Todo
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");

  //For Searching Todo
  const [searchText, setSearchText] = useState("");

  //For Pagination 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  
  // fetchTodo
  const fetchTodo = async()=>{
    // console.log("searchText",searchText)
    try{
      console.log(page);
      const res = await axios.get(`http://localhost:4000/todos/get?search=${searchText}&page=${page}&limit=5`);
      const {todos} = res.data;
      setTotalPages(res.data.totalPages);
      console.log("getData",res.data);
      if(res.status === 200) setTodos(todos);
    }
    catch(error){
      setError(error.message)
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{  
    const deBounseTimer = setTimeout(()=>{
      fetchTodo();
    },1000)
    setLoading(true);

    return ()=> clearTimeout(deBounseTimer);
  },[searchText,page]);

  // {console.log("todos",todos)}

  //sendTodo
  const sendTodo = async()=>{
    if(!inputText) return;

      try{
        const res = await axios.post("http://localhost:4000/todos/set",{
        todo:inputText })
        console.log("postRes", res.data)
        setPage(null);
        fetchTodo();
        setInputText("");  
      }
      catch(error){
        console.log(error)
      }
  }

  // deleteTodo
  const deleteTodo = async(id)=>{
    try{
      const res = await axios.delete(`http://localhost:4000/todos/delete/${id}`);
      console.log("delRes",res.data)
      console.log(todos)
      setTodos(todos.filter((t)=> t._id !== id ));
      setPage(null);
      fetchTodo();
    }
    catch(error){
      console.log(error)
    }
  }
  // console.log("afterDelete",todos)

  //HandleEdit
  const handleEdit = (t)=>{
    // console.log("todo in handleEdit",todo);
    setEditTodoId(t._id)
    setEditTodoText(t.todo)
  }
  // console.log("editTodo",editTodo)
  
  // updateTodo
  const updateTodo = async(id)=>{
    if(!editTodoText) return;
    // console.log("todo in updateTodo",id);

    const res = await axios.put(`http://localhost:4000/todos/update/${id}`,{
      todo:editTodoText
    })
    console.log("updateRes",res.data)
    const resTodo = res.data.updateRes.todo;
    setTodos(todos.map((todo)=> (todo._id===id ? {...todo, todo:resTodo} : todo))); 
    setEditTodoId(null);
  }

  // filterStatus
  const fetchTodosByStatus = async(status)=>{
    console.log("Status",status);
    if(status === "all") status="";
    const res = await axios.get(`http://localhost:4000/todos/get/status/?status=${status}`);
    console.log("filterTodosRes", res.data);
    setTodos(res.data.statusUpdatedTodos);  
  }

  // updateStatus 
  const updateStatus = async(t,status)=>{
    console.log("Status",status);
    if(!status) return;

    const res =  await axios.put(`http://localhost:4000/todos/update/status/${t._id}`,{status});
    fetchTodo()
    console.log("updateStatusRes",res.data)
  }
  
  return (
    <div style={styles.container}>

      {/* search */}
      <div>
        <input 
          type="text"
          placeholder='Search a todo'
          value={searchText}
          style={styles.input}
          onChange={(e)=> setSearchText(e.target.value)}
        />
        {/* 
          <button
            style={styles.searchButton}
            onClick={()=>{
              if(!searchText) return alert("search box is empty!")
              fetchTodo()
            }}
          >
          🔍 Search </button>
        */}
        { searchText && (
          <button
              style={styles.cancelButton}
              onClick={()=>{
                setSearchText("")
              }}
            >
            ❌ Cancel </button>
        )
        }
      </div>

      {/* Add Todo */}
      <h1 style={styles.heading}>📌 TO-DO LIST</h1>
      <div style={styles.form}>
        <input 
          type="text"
          placeholder='Enter a new todo...'
          value={inputText}
          onChange={(e)=> setInputText(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === "Enter") sendTodo()
          }}
          style={styles.input}
        />
        <button 
          style={styles.button}
          onClick={(e)=>{
            if(searchText) return alert("Can't add todo || First clear the search box!")
            sendTodo()
          }}
          >
          ADD
        </button>
      </div>

      {loading && <p style={{color:"#555"}}> Loading... </p>}
      {error && <p style={{color:"red"}}>Error: {error}</p>}

      {/* filter buttons based on sattus      */}
      <div>
        <button
          style={styles.statusButton}
          value={"all"}
          onClick={(e)=>{
            const status = e.target.value;
            fetchTodosByStatus(status)
          } }
          >
          All
        </button>

        <button
          style={styles.statusButton}
          value={"completed"}
          onClick={(e)=>{
            const status = e.target.value;
            fetchTodosByStatus(status)
          } }
          >
          Completed
        </button>

        <button
          style={styles.statusButton}
          value={"pending"}
          onClick={(e)=>{
            const status = e.target.value;
            fetchTodosByStatus(status)
          } }
        >
          Pending
        </button>
        <hr />
      </div>

      {/* {console.log("todos",todos)} */}
      {/* Todo List */}
      <ol style={styles.list}>
        { 
          todos.map((t)=>(
            <li key={t._id} style={styles.item}>

              {/* Status Dropdown */}
              <div>
                <label htmlFor="status">Status: </label> 
                <select value={t.status} 
                  style={{borderRadius:"5px" ,color:"white", backgroundColor:t.status === "completed" ? "green" : "red",}  } 
                  onChange={(e)=> updateStatus(t,e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

            {/* Todo & buttons */}
            {
              editTodoId === t._id
              ? 
              ( <>
              <input 
                type="text"
                placeholder='Edit a todo...'
                value={editTodoText}
                onChange={(e)=> setEditTodoText(e.target.value)}
                style={styles.input}
              />
              <button 
                style={styles.saveButton}
                onClick={()=> updateTodo(t._id)}
              > 💾 Save </button> 

              <button 
                style={styles.cancelButton}
                onClick={()=> setEditTodoId(null)}
              > ❌ Cancel </button> 
              </> )
              : 
              ( <>
              <p className='todo' >
                {t.todo}
              </p>

              <div>
                <button 
                style={styles.editButton}
                onClick={()=> handleEdit(t)}
              > ✏️ Edit </button>

              <button 
                style={styles.deleteButton}
                onClick={()=> deleteTodo(t._id)}
              > 🗑 Delete </button>
              </div>

              </> )
            }

            </li>
          ))
        } 
      </ol>

      {/* Pagination */}
      <div>
        {Array.from({length: totalPages}, (_,i) =>(
          <button 
            key={i} 
            style={styles.button}
            onClick={()=> setPage(i+1)}
          >
            Page {i+1}
          </button>
        ))}
      </div>

      
    </div>
  )
}

export default App
