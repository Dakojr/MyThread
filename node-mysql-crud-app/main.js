const Promise = require('bluebird')
const AppDAO = require('./dao')
const ProjectRepository = require('./projectrepository')
const TaskRepository = require('./taskrepository')
const UserRepositry = require('./userepository')

// function main() {
//     const dao = new AppDAO('./mythread.db')
//     const blogProjectData = { name: 'Write Node.js - SQLite Tutorial' }
//     const projectRepo = new ProjectRepository(dao)
//     const taskRepo = new TaskRepository(dao)
// const UserRepo = new UserRepository(dao)

//     let projectId

//     projectRepo.createTable()
//         .then(() => taskRepo.createTable())
//         .then(() => projectRepo.create(blogProjectData.name))
//         .then((data) => {
//             projectId = data.id
//             console.log(data);
//             const tasks = [
//                 {
//                     name: 'Outline',
//                     description: 'High level overview of sections',
//                     isComplete: 1,
//                     projectId
//                 },
//                 {
//                     name: 'Write',
//                     description: 'Write article contents and code examples',
//                     isComplete: 0,
//                     projectId
//                 }
//             ]
//             return Promise.all(tasks.map((task) => {
//                 const { name, description, isComplete, projectId } = task
//                 return taskRepo.create(name, description, isComplete, projectId)
//             }))
//         })
//         .then(() => projectRepo.getById(projectId))
//         .then((project) => {
//             console.log(`\nRetreived project from database`)
//             console.log(`project id = ${project.id}`)
//             console.log(`project name = ${project.name}`)
//             return projectRepo.getTasks(project.id)
//         })
//         .then((tasks) => {
//             console.log('\nRetrieved project tasks from database')
//             return new Promise((resolve, reject) => {
//                 tasks.forEach((task) => {
//                     console.log(`task id = ${task.id}`)
//                     console.log(`task name = ${task.name}`)
//                     console.log(`task description = ${task.description}`)
//                     console.log(`task isComplete = ${task.isComplete}`)
//                     console.log(`task projectId = ${task.projectId}`)
//                     // console.log(taskRepo)
//                     // console.log(projectRepo)
//                 })
//             })
//             resolve('success')
//         })
//         .catch((err) => {
//             console.log('Error: ')
//             console.log(JSON.stringify(err))
//         })
// }

function maintwo() {
    const dao = new AppDAO('./mythread.db')
    const UserRepo = new UserRepositry(dao)

    let User;

    UserRepo.getUser()
        .then((data) => {
            User = data
            console.log(User)
        })

}

// main()

maintwo()