import React, {Component} from 'react';
import './App.css';
import { Layout, Input, Button, List, Icon } from "antd";

import firestore from './config/firestore';

const {Header, Footer, Content} = Layout;

class App extends Component {
  constructor(props){
    super(props);
    this.state = { addingTodo: false, pendingTodo:'', todos: []}
    this.addTodo = this.addTodo.bind(this);
    this.completeTodo = this.completeTodo.bind(this);

    //We listen for live changes to our todos collection in Firestore
    firestore.collection("todos").onSnapshot(snapshot => {
      let todos = [];
      snapshot.forEach(doc => {
        const todo = doc.data();
        todo.id = doc.id;
        if(!todo.completed) todos.push(todo);
      });

      //Sort our todos bades on time added
      todos.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      // Anytime the state of our database changes, we update state
      this.setState({todos});
    });
  }

  async completeTodo(id){
    //Mark the todo as completed
    await firestore.collection("todos").doc(id).set({completed:true});
  }

  async addTodo(evt){
    if(!this.state.pendingTodo) return;
    //Set a flag to indicate loading
    this.setState({addingTodo:true});
    //Add a new todo from the value of the input
    await firestore.collection("todos").add({
      content: this.state.pendingTodo,
      completed: false,
      createdAt: new Date().toISOString()
    });
    //Remove the loading flag and clear the input
    this.setState({addingTodo:false, pendingTodo: ''});
  }

  render(){
    const {addingTodo, pendingTodo} = this.state;
    return (
      <Layout className="App">
        <Header className="App-header">
          <h1>Quick Todo</h1>
        </Header>
        <Content className="App-content">
          <Input 
            ref="add-todo-input"
            className="App-add-todo-input"
            size="large"
            placeholder="Whats need to be done?"
            disable={addingTodo.toString()}
            onChange={evt => this.setState({pendingTodo: evt.target.value})}
            value={pendingTodo}
            onPressEnter={this.addTodo}
            />
          <Button 
              className="App-add-todo-button"
              size="large"
              type="primary"
              onClick={this.addTodo}
              loading={addingTodo}>Add to do</Button>
          <List 
              className="App-todos"
              size="large"
              bordered
              dataSource={this.state.todos}
              renderItem={todo => (
                <List.Item>
                  {todo.content}
                  <Icon 
                    onClick={evt => this.completeTodo(todo.id)}
                    className="App-todo-complete"
                    type="check"
                    />
                </List.Item>
              )}
              />
        </Content>
        <Footer className="app-footer">&copy; Munditower</Footer>
      </Layout>
    );
  }
}

export default App;
