import { GithubUser } from "./requestGithub.js"

//Classe para manusear dados
export class Favorite{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
    this.checkIfIsEmpty()
  }

  async add(usertoFavorite){
    try{
      
      const userExist = this.users.find(entry => entry.login == usertoFavorite )
      
      if(userExist){
        throw new Error('Esse usuário já está listado')
      }
  
      const user = await GithubUser.search(usertoFavorite)
      
      if(user.login === undefined){
        throw new Error(`${usertoFavorite} não foi encontrado`)
      }

      this.users = [user, ...this.users]
      this.updateTable()
      this.save()
      this.checkIfIsEmpty()

    }catch(e){
      alert(e.message)
    }
  }

  load(){
    this.users = JSON.parse(localStorage.getItem('@users-fav:')) || []
  }

  save(){
    localStorage.setItem('@users-fav:', JSON.stringify(this.users))
  }

  checkIfIsEmpty(){
    const isTableEmpty = this.users.length == 0
    if(isTableEmpty){
      this.root.querySelector('.empty').style.display = 'flex'
    }
    if(!isTableEmpty){
      this.root.querySelector('.empty').style.display = 'none'
    }

  }

  delete(username){
    const filteredUsersToDelete = this.users.filter(user => user.login !== username.login)
    this.users = filteredUsersToDelete
    
    this.checkIfIsEmpty()
    this.save()
    this.updateTable()
  }

}

//classe para visual dos dados na tela
export class Display extends Favorite{
  constructor(root){
    super(root)
    this.tbody = this.root.querySelector('tbody')
    this.updateTable()
  }

  updateTable(){
    this.clearTable()
    this.loadRow()
    this.addUser()
  }

  addUser(){ 
    const favoriteUser = document.querySelector('#favoriteUser')

    favoriteUser.onclick = () =>{
      const { value } = document.querySelector('#inputSearch')
      this.add(value)
    }
  }

  loadRow(){
    this.users.forEach(user => {
      const row = this.createRow()
      
      row.querySelector('.user img').src = `https://github.com./${user.login}.png`
      row.querySelector('.user a').href = `https://github.com./${user.login}`
      row.querySelector('.user p').textContent = `${user.name}`
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = `${user.public_repos}`
      row.querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('.delete').onclick = () =>{
        const isOk = confirm('Deseja remover usuário?')
        if(isOk){
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `
        <td class="user">
        <img src="https://github.com./eriket0107.png" alt="">
        <a href="https://github.com./eriket0107" target="_blank">
          <p>Erik Oliveira</p>
        <span>eriket0107</span>
        </a>
      </td>
      <td class="repositories">
        27
      </td>
      <td class="followers">
        11
      </td>
      <td class="action">
        <Button class='delete'>Remove</Button>
      </td>
      `
    return tr
  }

  clearTable(){
   this.tbody.querySelectorAll('tbody tr')
    .forEach(tr => tr.remove())
  }
}