import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table,Container,Button,Form} from 'react-bootstrap'

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = ({
      tareas:[],
      descripcion:'',
      estado:'pendiente',
      id:0,
      pos:null,
      tituloBoton:'Agregar Tarea'
    })
    this.cambioDescripcion = this.cambioDescripcion.bind(this);
    this.guardar = this.guardar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.mostrar = this.mostrar.bind(this);
  }

  cambioDescripcion(e){
    console.log(e.target.value)
    this.setState({
      descripcion : e.target.value
    })
  }

  mostrar(cod,index){
    axios.get('http://localhost:5000/tarea/'+cod)
    .then(res=>{
      this.setState({
        pos:index,
        descripcion:res.data.content.descripcion,
        id:res.data.content.id,
        tituloBoton:'Actualizar Tarea'
      })
    })
  }

  guardar(e){
    e.preventDefault();

    let cod = this.state.id;

    const dataTarea = {
      descripcion : this.state.descripcion,
      estado : this.state.estado
    }
    if(cod>0){
      //actualizar
      axios.put('http://localhost:5000/tarea/'+cod,dataTarea)
      .then(res=>{
        let indx = this.state.pos;
        this.state.tareas[indx] = res.data.content;
        var temp = this.state.tareas;
        this.setState({
          descripcion:'',
          tareas:temp,
          tituloBoton:'Agregar Tarea',
          pos:null,
          id:0
        })
      })
    }
    else{
      //insertar
        axios.post('http://localhost:5000/tarea',dataTarea)
      .then(res=>{
        console.log(res.data.content)
        this.state.tareas.push(res.data.content)
        var temp = this.state.tareas
        this.setState({
          descripcion:'',
          tareas:temp,
          tituloBoton:'Agregar Tarea',
          pos:null,
          id:0
        }).catch((error)=>{
          alert(error.toString());
        })
      })
    }
    
  }

  eliminar(cod){
    axios.delete('http://localhost:5000/tarea/'+cod)
    .then(res=>{
      var temp = this.state.tareas.filter((tarea)=>tarea.id !== cod);
      this.setState({
        tareas:temp
      })
    })
  }

  componentDidMount(){
    console.log("cargando tareas ...")
    axios.get('http://localhost:5000/tarea')
    .then(res=>{
      console.log(res.data);
      this.setState({
        tareas : res.data.content
      })
    })
  }

  render(){
    return(
      <div>
        <Container>
          <h1>Lista de Tareas</h1>
          <Form onSubmit={this.guardar}>
            <Form.Group classname="mb-3">
              <Form.Control type="text" value={this.state.descripcion} onChange={this.cambioDescripcion} />
            </Form.Group>
            <Button variant="primary" type="submit">
              {this.state.tituloBoton}
            </Button>
          </Form>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Id</th>
                <th>Tarea</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tareas.map((tarea,index)=>{
                return(
                  <tr key={tarea.id}>
                    <td>{tarea.id}</td>
                    <td>{tarea.descripcion}</td>
                    <td>{tarea.estado}</td>
                    <td>                      
                      <Button variant="success" onClick={()=>this.mostrar(tarea.id,index)}>Editar</Button>
                      <Button variant="danger" onClick={()=>this.eliminar(tarea.id)}>Eliminar</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Container>
        
      </div>
    )
  }

}

export default App;