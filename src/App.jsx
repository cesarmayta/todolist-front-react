import React from 'react';
import axios from 'axios';

class App extends React.Component{

  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log("cargando tareas ...")
    axios.get('http://localhost:5000/tarea')
    .then(res=>{
      console.log(res.data);
    })
  }

  render(){
    return(
      <div>
        <h1>Lista de Tareas</h1>
      </div>
    )
  }

}

export default App;