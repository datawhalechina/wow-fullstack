FROM python:3.11-slim

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container.
COPY . /tm-backend
COPY .env /tm-backend/.env


# Install the application dependencies.
WORKDIR /tm-backend
RUN uv sync --frozen --no-cache

# Run the application.
CMD ["/tm-backend/.venv/bin/fastapi", "run", "main.py", "--port", "8008", "--host", "0.0.0.0"]