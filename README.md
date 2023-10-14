This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It was created to
complete a task by Luxonis as a part of hiring process.

## Run with Docker

To run this project with docker, you need to have docker installed on your machine. Then, run the following command:

```bash
docker-compose up
```

It will start the project, results can be viewed on [http://localhost:8080](http://localhost:8080)

On [http://localhost:8081](http://localhost:8081) you can view the database through adminer. Credentials can be found
in `docker-compose.yml` file in db service.

## Running Locally

Install dependencies and start the database:

```bash
npm install
docker-compose up db -d
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:3000) with your browser to see the result.


