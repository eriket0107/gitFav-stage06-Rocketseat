export class GithubUser {
  static async search(user ){

    const endpoint = `https://api.github.com/users/${user}`
    const response = await fetch(endpoint)
    const {login, name, public_repos, followers} = await response.json()

    return{login, name, public_repos, followers}
  }
}