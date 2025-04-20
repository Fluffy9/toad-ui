# TOAD UI

TOAD (Trustless Onchain Autonomous Delegate) is an AI-powered voting delegate system. This repo contains the UI and AI agent. The UI is built with Vercel AI SDK and the AI agent uses GOAT. GAIA is used for the LLM

## Development

1. Modify the .env.example file with your own information
2. Rename .env.example to .env
3. To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- A domain name with DNS access
- A server with ports 80 and 443 accessible

### Setup Instructions

1. Create a `docker-compose.yaml` file with the following content:

```yaml
services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: always
    security_opt:
      - no-new-privileges:true
    ports:
      - "80:80"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=home_web"
  toad-ui-dao:
    image: pupcakes/toad-ui
    container_name: toad-ui-dao
    restart: always
    expose:
      - "3000"
    volumes:
      - ./dao.env:/app/.env
    networks:
      - web
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 300s
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=home_web"
      - "traefik.http.routers.toad-ui-dao.rule=Host(`dao.domain.com`)"
      - "traefik.http.routers.toad-ui-dao.entrypoints=web"
      - "traefik.http.routers.toad-ui-dao.service=toad-ui-dao"
      - "traefik.http.services.toad-ui-dao.loadbalancer.server.port=3000"
      - "traefik.http.services.toad-ui-dao.loadbalancer.healthcheck.path=/"
      - "traefik.http.services.toad-ui-dao.loadbalancer.healthcheck.interval=10s"
      - "traefik.http.services.toad-ui-dao.loadbalancer.healthcheck.timeout=5s"

  toad-wallet-dao:
    image: pupcakes/toad-wallet
    container_name: toad-wallet-dao
    restart: always
    volumes:
      - ./dao.env:/usr/src/app/.env

networks:
  web:
    name: home_web
    driver: bridge
```

2. Configure your environment:
   - Create a `dao.env` file with your environment variables
   - Update the domain in the docker-compose.yaml file (replace `dao.domain.com` with your actual domain)

3. DNS Configuration:
   - Point your domain's DNS A record to your server's IP address
   - If using a subdomain (recommended), create a CNAME record pointing to your main domain

4. Deployment Steps:
   ```bash
   # First, bring up the TOAD UI container
   docker compose up toad-ui-dao

   # Once the UI is running, bring up the rest of the services
   docker compose up -d
   ```

5. Verify the deployment:
   - Access your TOAD UI at `http://dao.domain.com` (replace with your actual domain)
   - Check the Traefik dashboard for service status
   - Monitor container logs if needed: `docker compose logs -f`

### Notes
- Make sure to replace `dao.domain.com` with your actual domain in the docker-compose.yaml file
- The deployment assumes you're using Traefik as a reverse proxy
- Health checks are configured to ensure service availability
- All services are configured to restart automatically in case of failure

