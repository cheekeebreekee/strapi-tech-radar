const fetch = require("node-fetch");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '576fe97a164a55ed3caf93e5acc234b7cdbc9852';
const GITHUB_API_ENDPOINT = process.env.GITHUB_API_ENDPOINT || 'https://api.github.com';
const MLAB_DATABASE_ENDPOINT = 'https://api.mlab.com/api/1/databases/heroku_t0w09wdf/collections/repos_stats?apiKey=4rwl9RgE5c0O_npRpxmD_AiYopAF_3Na'

const GITHUB_REPOS_LIST = [
    'vuejs/vue',
    'facebook/react',
    'angular/angular'
]

const postDataToDatabase = async (dbUrl, data) => {
    fetch(dbUrl, {  
        method: 'POST',  
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(data => console.log('Request success: ', data))  
    .catch(err => console.log('Request failure: ', err));
}

const getDataFromGithubRepos = async endpoints => {
    for (const repoUrl of endpoints) {
        let response = await fetch(`${GITHUB_API_ENDPOINT}/repos/${repoUrl}?${GITHUB_TOKEN}`)
        let data = await response.json();
        await postDataToDatabase(MLAB_DATABASE_ENDPOINT, data)
    }
}

getDataFromGithubRepos(GITHUB_REPOS_LIST);
