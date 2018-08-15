import React, { Component } from 'react';
import List from './List';
import NewListForm from './NewListForm';
import EditListForm from './EditListForm';
import axios from 'axios';

class ListsContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      lists: [],
      editingListId: null
    }
    this.addNewList = this.addNewList.bind(this)
    this.removeList = this.removeList.bind(this)
    this.editingList = this.editingList.bind(this)
    this.editList = this.editList.bind(this)
  }

  componentDidMount() {
    // https://stackoverflow.com/questions/44932650/running-a-react-rails-app-locally
    axios.get('api/v1/lists.json')
    .then(response => {
      console.log(response)
      this.setState({
        lists: response.data
      })
    })
    .catch(error => console.log(error))
  }

  addNewList(title, excerpt){
    console.log(title, excerpt);
    axios.post('/api/v1/lists', { list: {title, excerpt} })
    .then(response => {
        console.log(response)
        const lists = [ ...this.state.lists, response.data ]
        this.setState({lists})
    })
    .catch(error => {
        console.log(error)
    })
  }

  editingList(id) {
      this.setState({
          editingListId: id
      })
  }

  editList(id, title, excerpt) {
    axios.put( '/api/v1/lists/' + id, {
        list: {
            title,
            excerpt
        }
    })
    .then(response => {
        console.log(response);
        const lists = this.state.lists;

        // this only works if no lists are destroyed, mr. tutorial...
        // fix might be to map to find with the right index, but skipping for now
        lists[id-1] = {id, title, excerpt}


        // setState with function, interesting
        // https://medium.freecodecamp.org/functional-setstate-is-the-future-of-react-374f30401b6b
        this.setState(() => ({
            lists,
            editingListId: null
        }))
    })
    .catch(error => console.log(error));
  }

  removeList(id) {
    axios.delete('/api/v1/lists/' + id )
    .then(response => {
      const lists = this.state.lists.filter(
        list => list.id !== id
      )
      this.setState({lists})
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <div className="Lists-container">
        <NewListForm onNewList={this.addNewList} />
        {this.state.lists.map(list => {
          if (this.state.editingListId === list.id){
            return (
              <EditListForm
                list={list}
                key={list.id}
                editList={this.editList} />
            )
          } else {
            return (
              <List
                list={list}
                key={list.id}
                onRemoveList={this.removeList}
                editingList={this.editingList} />
            )
          }
        })}
      </div>
    )
  }
}
export default ListsContainer;
