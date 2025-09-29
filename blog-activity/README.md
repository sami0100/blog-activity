# Full-Stack Blog (Activity-29Sept25)

A tiny full-stack blog (React + Node/Express + MongoDB) designed to satisfy the activity requirements:
- GitHub flow with branches & PRs
- Frontend + backend
- Dockerfiles for both
- Docker Compose with a database
- Push images to a registry
- Document steps

> You can run this **entirely without local Docker** using **GitHub Codespaces** or a **remote Linux VM**. VS Code connects to either.

## 0) One-time: Create a repo & open in VS Code

- Create a new GitHub repository and upload this project (`blog-activity/` contents).
- Click **Code → Create codespace**. (Or connect VS Code desktop to the Codespace.)

## 1) Run the stack in Docker (inside Codespaces or a remote VM)

```bash
docker compose up --build -d
# Forward port 8080 if Codespaces doesn’t do it automatically.
```

Open the forwarded URL → You should see the Mini Blog UI. Add posts; they persist in the Mongo volume.

Check health:
```bash
curl http://localhost:8080/api/health   # via nginx → backend
```

## 2) GitHub flow (branches, commits, PRs)

```bash
git checkout -b feat/add-like-button
# make changes…
git add -A && git commit -m "feat: add like button"
git push -u origin feat/add-like-button
# Open Pull Request in GitHub → Review → Merge
```

## 3) Push images to a registry

### Option A: GitHub Container Registry (GHCR)
1. Ensure repo is public or you are authenticated.
2. Login:
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin  # in GitHub Actions
# OR in terminal: docker login ghcr.io -u <your-username> -p <a PAT with 'write:packages'>
```
3. Build & tag:
```bash
docker build -t ghcr.io/<user>/<repo>-backend:latest -f server/Dockerfile .
docker build -t ghcr.io/<user>/<repo>-frontend:latest -f client/Dockerfile .
```
4. Push:
```bash
docker push ghcr.io/<user>/<repo>-backend:latest
docker push ghcr.io/<user>/<repo>-frontend:latest
```

### Option B: Docker Hub
```bash
docker login
docker build -t <dockerhub-user>/blog-backend:latest -f server/Dockerfile .
docker build -t <dockerhub-user>/blog-frontend:latest -f client/Dockerfile .
docker push <dockerhub-user>/blog-backend:latest
docker push <dockerhub-user>/blog-frontend:latest
```

## 4) Optional: CI builds & pushes (GitHub Actions)

A workflow is included at `.github/workflows/docker.yml`. Once you set the repo and (for GHCR) permissions, pushes to `main` will build and push images automatically.

## 5) Clean up

```bash
docker compose down -v
```

---

## Dev notes

- Frontend is built with Vite and served by Nginx. Nginx proxies `/api/*` to the backend service.
- Backend connects to Mongo using the Compose service name `mongo`.
- Data is persisted via the named volume `mongo-data`.
