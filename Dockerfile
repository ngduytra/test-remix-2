# ---- Base ----
FROM public.ecr.aws/docker/library/node:20-alpine AS base
WORKDIR /usr/app

# Copy package manager files
COPY package.json yarn.lock ./

# ---- Dependencies ----
FROM base AS deps

# Install dependencies
RUN yarn install --frozen-lockfile

# ---- Builder ----
FROM base AS builder

# Install jq for JSON parsing
RUN apk add --no-cache jq

# Set environment variables
ARG APP_CONFIG
# Convert APP_CONFIG JSON into .env format and save to .env file
RUN echo $APP_CONFIG | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' > .env

# Copy installed dependencies
COPY --from=deps /usr/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# ---- Production ----
FROM base AS production
COPY --from=builder /usr/app/build ./build
COPY --from=builder /usr/app/node_modules ./node_modules
ENTRYPOINT ["yarn", "start"]
